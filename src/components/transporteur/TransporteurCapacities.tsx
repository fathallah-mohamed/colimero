import { Card } from "@/components/ui/card";
import { Scale } from "lucide-react";

interface TransporteurCapacitiesProps {
  totalCapacity?: number;
  pricePerKg?: number;
}

export const TransporteurCapacities = ({ totalCapacity, pricePerKg }: TransporteurCapacitiesProps) => {
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
              {totalCapacity || 0} kg
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#E5DEFF] flex items-center justify-center">
            <Scale className="h-5 w-5 text-[#00B0F0]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Prix par kilo</p>
            <p className="text-gray-900">
              {pricePerKg || 0}€/kg
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};