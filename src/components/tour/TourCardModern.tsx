import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowRight, Calendar, Euro, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { differenceInDays } from "date-fns";
import type { Tour } from "@/types/tour";

interface TourCardModernProps {
  tour: Tour;
  onBookingClick: () => void;
  isBookingEnabled: boolean;
}

export function TourCardModern({
  tour,
  onBookingClick,
  isBookingEnabled
}: TourCardModernProps) {
  const getDepartureCity = () => {
    if (!tour.route || !Array.isArray(tour.route)) return null;
    return tour.route[0]?.name;
  };

  const getDestinationCity = () => {
    if (!tour.route || !Array.isArray(tour.route)) return null;
    return tour.route[tour.route.length - 1]?.name;
  };

  const departureCity = getDepartureCity();
  const destinationCity = getDestinationCity();
  const daysUntilDeparture = differenceInDays(new Date(tour.departure_date), new Date());
  const isUrgent = daysUntilDeparture <= 7 && daysUntilDeparture >= 0;
  const capacityPercentage = (tour.remaining_capacity / tour.total_capacity) * 100;
  const isLowCapacity = capacityPercentage <= 20;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
        {/* En-tête avec trajet */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-medium">
            <span>{departureCity}</span>
            <ArrowRight className="h-5 w-5 text-primary" />
            <span>{destinationCity}</span>
          </div>
          {isUrgent && (
            <span className="px-3 py-1 bg-success/10 text-success text-sm font-medium rounded-full">
              Départ imminent
            </span>
          )}
        </div>

        {/* Date et capacité */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5 text-primary" />
            <span>
              {format(new Date(tour.departure_date), "d MMMM yyyy", { locale: fr })}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <span>{tour.remaining_capacity} kg disponibles</span>
              </div>
              {isLowCapacity && (
                <span className="text-warning">Dernières places</span>
              )}
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-500",
                  isLowCapacity ? "bg-warning" : "bg-success"
                )}
                style={{ width: `${100 - capacityPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Prix et bouton de réservation */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-lg font-medium text-primary">
            <Euro className="h-5 w-5" />
            <span>{tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 5}€/kg</span>
          </div>
          <Button
            onClick={onBookingClick}
            disabled={!isBookingEnabled}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Réserver maintenant
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}