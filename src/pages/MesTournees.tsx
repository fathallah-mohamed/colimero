import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Edit2, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { TourEditDialog } from "@/components/tour/TourEditDialog";

export default function MesTournees() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState<any[]>([]);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    fetchTours();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/connexion');
    }
  };

  const fetchTours = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('carrier_id', session.user.id)
        .order('departure_date', { ascending: true });

      if (error) {
        console.error('Error fetching tours:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les tournées",
        });
        return;
      }

      setTours(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (tourId: number) => {
    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', tourId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la tournée",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "La tournée a été supprimée",
    });
    fetchTours();
  };

  const handleEdit = (tour: any) => {
    setSelectedTour(tour);
    setIsEditDialogOpen(true);
  };

  const onEditComplete = () => {
    setIsEditDialogOpen(false);
    setSelectedTour(null);
    fetchTours();
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mes tournées</h1>
          <Button onClick={() => navigate('/planifier-une-tournee')}>
            Créer une nouvelle tournée
          </Button>
        </div>
        
        <div className="grid gap-6">
          {tours.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune tournée planifiée
              </h3>
              <p className="text-gray-500 mb-4">
                Vous n'avez pas encore créé de tournée. Commencez par en planifier une !
              </p>
              <Button onClick={() => navigate('/planifier-une-tournee')}>
                Planifier une tournée
              </Button>
            </div>
          ) : (
            tours.map((tour) => (
              <div key={tour.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-lg font-semibold">
                        {tour.departure_country} → {tour.destination_country}
                      </h2>
                      <Badge variant={tour.type === 'public' ? 'default' : 'secondary'}>
                        {tour.type === 'public' ? 'Public' : 'Privé'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-1">
                      Départ : {format(new Date(tour.departure_date), "d MMMM yyyy", { locale: fr })}
                    </p>
                    <div className="flex items-center gap-4">
                      <p className="text-gray-600">
                        Capacité restante : {tour.remaining_capacity} kg
                      </p>
                      <p className="text-gray-600">
                        Total : {tour.total_capacity} kg
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(tour)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer la tournée ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. Toutes les réservations associées seront également supprimées.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(tour.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <TourEditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          tour={selectedTour}
          onComplete={onEditComplete}
        />
      </div>
    </div>
  );
}