import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { TourCard } from "@/components/tour/TourCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function CurrentTours() {
  const { toast } = useToast();

  const { data: nextTour, isLoading } = useQuery({
    queryKey: ['next-planned-tour'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tours')
        .select(`
          *,
          carriers (
            company_name,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('status', 'planned')
        .gte('departure_date', new Date().toISOString())
        .order('departure_date', { ascending: true })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleEdit = () => {
    toast({
      title: "Modification non disponible",
      description: "Cette action n'est pas disponible sur la page d'accueil",
    });
  };

  const handleDelete = () => {
    toast({
      title: "Suppression non disponible",
      description: "Cette action n'est pas disponible sur la page d'accueil",
    });
  };

  const handleStatusChange = () => {
    toast({
      title: "Changement de statut non disponible",
      description: "Cette action n'est pas disponible sur la page d'accueil",
    });
  };

  if (isLoading) {
    return (
      <div className="py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Prochaine tournée planifiée</h2>
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (!nextTour) {
    return (
      <div className="py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Prochaine tournée planifiée</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">
              Aucune tournée planifiée pour le moment
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Prochaine tournée planifiée</h2>
      <TourCard 
        tour={nextTour}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}