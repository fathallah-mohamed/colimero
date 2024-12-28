import { motion } from "framer-motion";
import { Star, Package, MapPin } from "lucide-react";

const stats = [
  {
    icon: Star,
    value: "98%",
    label: "satisfaction client",
  },
  {
    icon: Package,
    value: "5000+",
    label: "colis transportés",
  },
  {
    icon: MapPin,
    value: "30+",
    label: "villes couvertes",
  },
];

export function TransporteurStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {stats.map((stat, index) => (
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