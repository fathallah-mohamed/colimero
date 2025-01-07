import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, Calendar, Eye, Package, Truck, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClientTourTimeline } from "./ClientTourTimeline";
import { ClientTourDetails } from "./ClientTourDetails";
import { Tour } from "@/types/tour";
import { Avatar } from "@/components/ui/avatar";
import { SelectableCollectionPointsList } from "@/components/tour/SelectableCollectionPointsList";

interface ClientTourCardProps {
  tour: Tour;
  onBookingClick: (tourId: number, pickupCity: string) => void;
}

export function ClientTourCard({ tour, onBookingClick }: ClientTourCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<string>("");
  const pricePerKg = tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 0;

  const statusIcons = [
    { status: "Programmé", icon: Package, label: "Programmé", current: tour.status === "Programmé" },
    { status: "Ramassage en cours", icon: Truck, label: "Ramassage en cours", current: tour.status === "Ramassage en cours" },
    { status: "En transit", icon: ArrowRight, label: "En transit", current: tour.status === "En transit" },
    { status: "Livraison en cours", icon: Truck, label: "Livraison en cours", current: tour.status === "Livraison en cours" }
  ];

  const handleBookingClick = () => {
    if (selectedPoint) {
      onBookingClick(tour.id, selectedPoint);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12">
          <img 
            src={tour.carriers?.avatar_url || "/placeholder.svg"} 
            alt={tour.carriers?.company_name || "Carrier"} 
          />
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-medium">{tour.carriers?.company_name}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>
                {tour.route?.[0]?.name} → {tour.route?.[tour.route.length - 1]?.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>
                {format(new Date(tour.departure_date), "d MMM yyyy", { locale: fr })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" />
              <span>{tour.remaining_capacity} kg disponibles</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{pricePerKg}€/kg</span>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            {statusIcons.map((item, index) => (
              <div 
                key={item.status} 
                className="flex flex-col items-center gap-2"
              >
                <div className={`rounded-full p-4 ${
                  item.current 
                    ? "bg-[#00B0F0] text-white" 
                    : "bg-gray-100 text-gray-400"
                }`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className={`text-xs ${
                  item.current 
                    ? "text-[#00B0F0] font-medium" 
                    : "text-gray-500"
                }`}>
                  {item.label}
                </span>
                <span className="text-xs text-gray-400">
                  {item.current ? "En cours" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full text-[#00B0F0] hover:text-[#00B0F0] hover:bg-blue-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Eye className="h-4 w-4 mr-2" />
        {isExpanded ? "Masquer les détails" : "Afficher les détails"}
      </Button>

      {isExpanded && (
        <div className="space-y-4">
          <ClientTourTimeline tour={tour} />
          <ClientTourDetails tour={tour} />
          
          <div className="mt-6">
            <h4 className="font-medium mb-4">Points de collecte disponibles</h4>
            <SelectableCollectionPointsList
              points={tour.route || []}
              selectedPoint={selectedPoint}
              onPointSelect={setSelectedPoint}
              isSelectionEnabled={true}
              tourDepartureDate={tour.departure_date}
            />
          </div>

          <Button 
            className="w-full bg-[#00B0F0] hover:bg-[#0090D0] text-white"
            onClick={handleBookingClick}
            disabled={!selectedPoint}
          >
            {selectedPoint ? "Réserver sur cette tournée" : "Sélectionnez un point de collecte"}
          </Button>
        </div>
      )}
    </div>
  );
}