import { TourCardHeader } from "@/components/transporteur/TourCardHeader";
import { Button } from "@/components/ui/button";
import { Tour, TourStatus } from "@/types/tour";
import { TourTimelineDisplay } from "@/components/tour/shared/TourTimelineDisplay";
import { SelectableCollectionPointsList } from "@/components/tour/SelectableCollectionPointsList";
import { Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import AuthDialog from "@/components/auth/AuthDialog";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { BookingStatus } from "@/types/booking";

interface TourTimelineCardProps {
  tour: Tour;
  onBookingClick: (tourId: number, pickupCity: string) => void;
  onStatusChange?: (tourId: number, newStatus: TourStatus) => Promise<void>;
  onBookingStatusChange?: (bookingId: string, newStatus: BookingStatus) => Promise<void>;
  hideAvatar?: boolean;
  userType?: string;
  isUpcoming?: boolean;
}

export function TourTimelineCard({ 
  tour, 
  onBookingClick, 
  onStatusChange,
  onBookingStatusChange,
  hideAvatar, 
  userType,
  isUpcoming = false
}: TourTimelineCardProps) {
  const [selectedPickupCity, setSelectedPickupCity] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleBookingClick = async () => {
    if (!selectedPickupCity) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setShowAuthDialog(true);
      return;
    }

    const userType = session.user.user_metadata?.user_type;
    if (userType === 'carrier') {
      setShowAccessDeniedDialog(true);
      return;
    }

    if (tour.type === 'private') {
      setShowApprovalDialog(true);
    } else {
      navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
    }
  };

  const isCarrier = userType === 'carrier';
  const canEdit = isCarrier && tour.carrier_id === supabase.auth.getSession().then(({ data }) => data.session?.user?.id);

  return (
    <div className="bg-white rounded-xl overflow-hidden transition-all duration-200 border border-gray-100 hover:shadow-lg shadow-md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <TourCardHeader tour={tour} hideAvatar={hideAvatar} />
          {isUpcoming && (
            <Badge className="bg-[#9b87f5]/10 text-[#9b87f5] hover:bg-[#9b87f5]/20 transition-colors">
              Prochaine tournée
            </Badge>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full mt-4 text-[#0FA0CE] hover:text-[#0FA0CE] hover:bg-[#0FA0CE]/10"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Eye className="w-4 h-4 mr-2" />
          {isExpanded ? "Masquer les détails" : "Afficher les détails"}
        </Button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-6 space-y-6">
                <TourTimelineDisplay 
                  status={tour.status} 
                  tourId={tour.id}
                  onStatusChange={onStatusChange}
                  onBookingStatusChange={onBookingStatusChange}
                  userType={userType}
                  canEdit={true}
                  variant="carrier"
                />

                {!isCarrier && (
                  <>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Points de collecte</h4>
                      <SelectableCollectionPointsList
                        points={tour.route}
                        selectedPoint={selectedPickupCity || ''}
                        onPointSelect={setSelectedPickupCity}
                        isSelectionEnabled={tour.status === "Programmée"}
                        tourDepartureDate={tour.departure_date}
                      />
                    </div>

                    <div>
                      <Button 
                        onClick={handleBookingClick}
                        className="w-full bg-[#0FA0CE] hover:bg-[#0FA0CE]/90 text-white"
                        disabled={!selectedPickupCity || tour.status !== "Programmée"}
                      >
                        {!selectedPickupCity 
                          ? "Sélectionnez un point de collecte pour réserver"
                          : tour.type === 'private' 
                            ? "Demander l'approbation" 
                            : "Réserver sur cette tournée"
                        }
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)}
        onSuccess={() => {
          setShowAuthDialog(false);
          if (selectedPickupCity) {
            if (tour.type === 'private') {
              setShowApprovalDialog(true);
            } else {
              navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
            }
          }
        }}
        requiredUserType="client"
      />

      <AccessDeniedMessage
        userType="carrier"
        isOpen={showAccessDeniedDialog}
        onClose={() => setShowAccessDeniedDialog(false)}
      />

      <ApprovalRequestDialog
        isOpen={showApprovalDialog}
        onClose={() => setShowApprovalDialog(false)}
        tourId={tour.id}
        pickupCity={selectedPickupCity || ''}
      />
    </div>
  );
}