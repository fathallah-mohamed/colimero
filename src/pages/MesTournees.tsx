import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TourCard } from "@/components/tour/TourCard";
import { TourEditDialog } from "@/components/tour/TourEditDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      const { data: toursData, error: toursError } = await supabase
        .from('tours')
        .select(`
          *,
          bookings (
            id,
            pickup_city,
            delivery_city,
            weight,
            tracking_number,
            status,
            recipient_name,
            recipient_phone
          )
        `)
        .eq('carrier_id', session.user.id)
        .order('departure_date', { ascending: true });

      if (toursError) {
        console.error('Error fetching tours:', toursError);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les tournées",
        });
        return;
      }

      setTours(toursData || []);
    }
    setLoading(false);
  };

  const handleDelete = async (tourId: number) => {
    // Ne pas permettre la suppression des tournées terminées
    const tour = tours.find(t => t.id === tourId);
    if (tour?.status === 'completed') {
      toast({
        variant: "destructive",
        title: "Action impossible",
        description: "Les tournées terminées ne peuvent pas être supprimées",
      });
      return;
    }

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
    // Ne pas permettre l'édition des tournées terminées
    if (tour.status === 'completed') {
      toast({
        variant: "destructive",
        title: "Action impossible",
        description: "Les tournées terminées ne peuvent pas être modifiées",
      });
      return;
    }
    setSelectedTour(tour);
    setIsEditDialogOpen(true);
  };

  const handleStatusChange = async (tourId: number, newStatus: string) => {
    // Ne pas permettre le changement de statut pour les tournées terminées
    const tour = tours.find(t => t.id === tourId);
    if (tour?.status === 'completed') {
      toast({
        variant: "destructive",
        title: "Action impossible",
        description: "Le statut des tournées terminées ne peut pas être modifié",
      });
      return;
    }

    // Mettre à jour l'état local immédiatement pour une meilleure UX
    setTours(tours.map(tour => 
      tour.id === tourId ? { ...tour, status: newStatus } : tour
    ));

    // La mise à jour dans la BDD est gérée par le composant TourStatusTimeline
  };

  const onEditComplete = () => {
    setIsEditDialogOpen(false);
    setSelectedTour(null);
    fetchTours();
  };

  const upcomingTours = tours.filter(tour => tour.status !== 'completed');
  const completedTours = tours.filter(tour => tour.status === 'completed');

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

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Tournées à venir</TabsTrigger>
            <TabsTrigger value="completed">Tournées terminées</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="grid gap-6">
              {upcomingTours.length === 0 ? (
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
                upcomingTours.map((tour) => (
                  <TourCard
                    key={tour.id}
                    tour={tour}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid gap-6">
              {completedTours.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune tournée terminée
                  </h3>
                  <p className="text-gray-500">
                    Les tournées terminées apparaîtront ici.
                  </p>
                </div>
              ) : (
                completedTours.map((tour) => (
                  <TourCard
                    key={tour.id}
                    tour={tour}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                    isCompleted={true}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

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
