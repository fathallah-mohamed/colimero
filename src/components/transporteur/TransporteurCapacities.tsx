import { Card } from "@/components/ui/card";
import { Scale, Euro } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const TransporteurCapacities = () => {
  const { id } = useParams();

  const { data: capacities, isLoading } = useQuery({
    queryKey: ["carrier-capacities", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carrier_capacities")
        .select("*")
        .eq("carrier_id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Capacités et Tarifs</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#E5DEFF] flex items-center justify-center">
            <Scale className="h-5 w-5 text-[#00B0F0]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Capacité totale</p>
            <p className="text-gray-900">
              {capacities?.total_capacity || 0} kg
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#E5DEFF] flex items-center justify-center">
            <Euro className="h-5 w-5 text-[#00B0F0]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Prix par kilo</p>
            <p className="text-gray-900">
              {capacities?.price_per_kg || 0}€/kg
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};