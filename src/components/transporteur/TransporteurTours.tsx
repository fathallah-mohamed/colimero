import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Tour {
  id: number;
  departure_date: string;
  departure_country: string;
  destination_country: string;
  remaining_capacity: number;
  total_capacity: number;
}

interface TransporteurToursProps {
  tours: Tour[];
  type: "public" | "private";
}

export function TransporteurTours({ tours, type }: TransporteurToursProps) {
  const title = type === "public" ? "Tournées Publiques" : "Tournées Privées";
  const buttonText = type === "public" ? "Réserver" : "Demander un accès";

  if (!tours.length) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">{title}</h2>
        <p className="text-center text-gray-500 py-4">
          Aucune tournée {type === "public" ? "publique" : "privée"} disponible
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">{title}</h2>
      <div className="space-y-4">
        {tours.map((tour) => (
          <div
            key={tour.id}
            className="border rounded-lg p-4 hover:border-[#00B0F0] transition-colors"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-[#00B0F0]" />
                <div>
                  <p className="font-medium">
                    {format(new Date(tour.departure_date), "d MMMM yyyy", {
                      locale: fr,
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {tour.departure_country} vers {tour.destination_country}
                  </p>
                </div>
              </div>
              <Button variant="outline">{buttonText}</Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00B0F0]"
                  style={{
                    width: `${(tour.remaining_capacity / tour.total_capacity) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">
                {tour.remaining_capacity}kg / {tour.total_capacity}kg
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}