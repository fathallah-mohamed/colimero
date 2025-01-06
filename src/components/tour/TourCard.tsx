import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tour } from "@/types/tour";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import AuthDialog from "../auth/AuthDialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, Calendar, Truck, CreditCard, Users, Package, Clock } from "lucide-react";
import { CollectionPointsList } from "./CollectionPointsList";
import { Badge } from "@/components/ui/badge";

interface TourCardProps {
  tour: Tour;
  selectedPickupCity: string | null;
  onPickupCitySelect: (city: string) => void;
  isBookingEnabled: boolean;
  isPickupSelectionEnabled: boolean;
  bookingButtonText: string;
  onBookingClick: () => void;
}

export function TourCard({
  tour,
  selectedPickupCity,
  onPickupCitySelect,
  isBookingEnabled,
  isPickupSelectionEnabled,
  bookingButtonText,
  onBookingClick,
}: TourCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleBookingClick = () => {
    sessionStorage.setItem('returnPath', `/reserver/${tour.id}`);
    setShowAuthDialog(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthDialog(false);
    navigate(`/reserver/${tour.id}`);
  };

  const price = tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 0;
  const usedCapacity = tour.total_capacity - tour.remaining_capacity;
  const capacityPercentage = (usedCapacity / tour.total_capacity) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      case 'collecting':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planned':
        return 'Planifiée';
      case 'collecting':
        return 'En collecte';
      case 'in_transit':
        return 'En transit';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">Tournée #{tour.id}</h3>
            <Badge className={getStatusColor(tour.status || '')}>
              {getStatusLabel(tour.status || '')}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{tour.departure_country} → {tour.destination_country}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{price} € <span className="text-sm text-gray-600">/ kg</span></p>
          <p className="text-sm text-gray-600">Type: {tour.type === 'public' ? 'Publique' : 'Privée'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Départ: {format(new Date(tour.departure_date), "d MMMM yyyy", { locale: fr })}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Collecte: {format(new Date(tour.collection_date), "d MMMM yyyy", { locale: fr })}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Package className="h-4 w-4" />
            <span>Capacité totale: {tour.total_capacity} kg</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Truck className="h-4 w-4" />
            <span>Capacité restante: {tour.remaining_capacity} kg</span>
          </div>
        </div>
      </div>

      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div className="text-xs font-semibold text-primary uppercase">
            Capacité utilisée: {Math.round(capacityPercentage)}%
          </div>
        </div>
        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${capacityPercentage}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
          />
        </div>
      </div>

      {tour.route && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Points de collecte</h4>
          <CollectionPointsList points={tour.route} />
        </div>
      )}

      {tour.carriers && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-4 w-4" />
            <span>Transporteur: {tour.carriers.company_name}</span>
          </div>
        </div>
      )}
      
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleBookingClick}
          disabled={!isBookingEnabled}
          className="bg-primary text-white hover:bg-primary/90"
        >
          {bookingButtonText}
        </Button>
      </div>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={handleAuthSuccess}
        requiredUserType="client"
      />
    </Card>
  );
}