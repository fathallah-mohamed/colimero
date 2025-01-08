import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tour, TourStatus } from "@/types/tour";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, Calendar, Eye, Package, Phone, User, Scale, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TourStatusTimeline } from "./TourStatusTimeline";
import { CollapsibleTrigger, CollapsibleContent, Collapsible } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TourCardProps {
  tour: Tour;
  onEdit: (tour: Tour) => void;
  onDelete: (tourId: number) => void;
  onStatusChange: (tourId: number, newStatus: TourStatus) => void;
  selectedPickupCity?: string;
  onPickupCitySelect?: (city: string) => void;
  isBookingEnabled?: boolean;
  isPickupSelectionEnabled?: boolean;
  bookingButtonText?: string;
  onBookingClick?: () => void;
}

export function TourCard({
  tour,
  onEdit,
  onDelete,
  onStatusChange,
  selectedPickupCity,
  onPickupCitySelect,
  isBookingEnabled,
  isPickupSelectionEnabled,
  bookingButtonText,
  onBookingClick
}: TourCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBookingDetails, setShowBookingDetails] = useState<Record<string, boolean>>({});

  const handleStatusChange = async (newStatus: TourStatus) => {
    try {
      onStatusChange(tour.id, newStatus);
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la tournée a été mis à jour avec succès.",
      });
    } catch (error) {
      console.error('Error updating tour status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la tournée",
      });
    }
  };

  const handleDelete = async () => {
    try {
      onDelete(tour.id);
      toast({
        title: "Tournée supprimée",
        description: "La tournée a été supprimée avec succès.",
      });
    } catch (error) {
      console.error('Error deleting tour:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la tournée",
      });
    }
  };

  const toggleBookingDetails = (bookingId: string) => {
    setShowBookingDetails(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };

  const getTypeColor = (type: string) => {
    return type === 'public' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  const getStatusColor = (status: TourStatus) => {
    switch (status) {
      case "Programmée":
        return 'bg-blue-100 text-blue-800';
      case "Ramassage en cours":
        return 'bg-yellow-100 text-yellow-800';
      case "En transit":
        return 'bg-purple-100 text-purple-800';
      case "Terminée":
        return 'bg-green-100 text-green-800';
      case "Annulée":
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">
              {tour.departure_country} → {tour.destination_country}
            </h3>
            <Badge className={getTypeColor(tour.type)}>
              {tour.type === 'public' ? 'Public' : 'Privé'}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Départ : {format(new Date(tour.departure_date), "d MMMM yyyy", { locale: fr })}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(tour)}
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Eye className="h-4 w-4" />
        {isExpanded ? "Masquer les détails" : "Voir les détails"}
      </Button>

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent className="space-y-4 mt-4">
          <TourStatusTimeline
            tourId={tour.id}
            status={tour.status}
            onStatusChange={handleStatusChange}
          />

          {tour.bookings && tour.bookings.length > 0 ? (
            <div className="space-y-3">
              {tour.bookings.map((booking) => (
                <Card key={booking.id} className="p-3">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className={getStatusColor(tour.status)}>
                          {booking.status}
                        </Badge>
                        <p className="font-medium mt-2">{booking.tracking_number}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookingDetails(booking.id)}
                      >
                        {showBookingDetails[booking.id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {showBookingDetails[booking.id] && (
                      <div className="space-y-4 border-t pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-start gap-2">
                            <User className="h-4 w-4 mt-1 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-500">Expéditeur</p>
                              <p className="font-medium">{booking.sender_name}</p>
                              <p className="text-sm text-gray-600">{booking.sender_phone}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <User className="h-4 w-4 mt-1 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-500">Destinataire</p>
                              <p className="font-medium">{booking.recipient_name}</p>
                              <p className="text-sm text-gray-600">{booking.recipient_phone}</p>
                              <p className="text-sm text-gray-600">{booking.recipient_address}</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-1 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-500">Ville de collecte</p>
                              <p className="font-medium">{booking.pickup_city}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-1 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-500">Ville de livraison</p>
                              <p className="font-medium">{booking.delivery_city}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Scale className="h-4 w-4 mt-1 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Poids</p>
                            <p className="font-medium">{booking.weight} kg</p>
                          </div>
                        </div>

                        {booking.content_types?.length > 0 && (
                          <div className="flex items-start gap-2">
                            <Package className="h-4 w-4 mt-1 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-500">Types de contenu</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {booking.content_types.map((type: string, index: number) => (
                                  <Badge key={index} variant="secondary">
                                    {type}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {booking.special_items?.length > 0 && (
                          <div className="flex items-start gap-2">
                            <Package className="h-4 w-4 mt-1 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-500">Objets spéciaux</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {booking.special_items.map((item: any, index: number) => (
                                  <Badge key={index} variant="secondary">
                                    {item.name} {item.quantity && `(${item.quantity})`}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {booking.package_description && (
                          <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 mt-1 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-500">Description du colis</p>
                              <p className="text-sm">{booking.package_description}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 mt-1 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Dates</p>
                            <div className="space-y-1">
                              <p className="text-sm">
                                <span className="font-medium">Créée le:</span>{" "}
                                {format(new Date(booking.created_at), "d MMMM yyyy", { locale: fr })}
                              </p>
                              {booking.updated_at && (
                                <p className="text-sm">
                                  <span className="font-medium">Dernière mise à jour:</span>{" "}
                                  {format(new Date(booking.updated_at), "d MMMM yyyy", { locale: fr })}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                Aucune réservation pour cette tournée.
              </AlertDescription>
            </Alert>
          )}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}