import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tour } from "@/types/tour";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export function CurrentTours() {
  const navigate = useNavigate();

  const { data: nextTour, isLoading, error } = useQuery({
    queryKey: ["nextTour"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("tours")
          .select(`
            *,
            carriers (
              company_name,
              first_name,
              last_name,
              avatar_url,
              carrier_capacities (
                price_per_kg
              )
            )
          `)
          .eq("status", "Programmée")
          .eq("type", "public")
          .gte("departure_date", new Date().toISOString())
          .order("departure_date", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching next tour:", error);
          return null;
        }

        return data as Tour | null;
      } catch (err) {
        console.error("Error in nextTour query:", err);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !nextTour) {
    return null;
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Prochaine tournée disponible</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-medium">
              {nextTour.carriers?.company_name}
            </p>
            <p className="text-gray-600">
              {nextTour.departure_country} → {nextTour.destination_country}
            </p>
          </div>
          <Button 
            onClick={() => navigate(`/reserver/${nextTour.id}`)}
            className="bg-primary hover:bg-primary/90"
          >
            Réserver
          </Button>
        </div>
      </div>
    </div>
  );
}