import { motion } from "framer-motion";
import { Star, Package, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CarrierStats {
  satisfaction_rate: number | null;
  total_deliveries: number | null;
  cities_covered: number | null;
}

interface AggregatedStats extends CarrierStats {
  count: number;
}

export function TransporteurStats() {
  const { data: stats } = useQuery({
    queryKey: ["carrier-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carriers")
        .select("satisfaction_rate, total_deliveries, cities_covered");

      if (error) throw error;

      // Calculer les moyennes et totaux
      const aggregatedStats = data.reduce<AggregatedStats>(
        (acc, curr) => ({
          satisfaction_rate: acc.satisfaction_rate + (curr.satisfaction_rate || 0),
          total_deliveries: acc.total_deliveries + (curr.total_deliveries || 0),
          cities_covered: acc.cities_covered + (curr.cities_covered || 0),
          count: acc.count + 1,
        }),
        { satisfaction_rate: 0, total_deliveries: 0, cities_covered: 0, count: 0 }
      );

      return {
        satisfaction_rate: Math.round(aggregatedStats.satisfaction_rate / aggregatedStats.count),
        total_deliveries: aggregatedStats.total_deliveries,
        cities_covered: aggregatedStats.cities_covered,
      };
    },
  });

  const statItems = [
    {
      icon: Star,
      value: `${stats?.satisfaction_rate || 98}%`,
      label: "satisfaction client",
    },
    {
      icon: Package,
      value: `${stats?.total_deliveries || 0}+`,
      label: "colis transportés",
    },
    {
      icon: MapPin,
      value: `${stats?.cities_covered || 0}+`,
      label: "villes couvertes",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {statItems.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className="p-6 bg-white rounded-lg shadow-sm"
        >
          <stat.icon className="w-8 h-8 text-blue-500 mx-auto mb-4" />
          <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
          <div className="text-gray-600">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}