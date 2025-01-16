import React, { useState, useEffect } from "react";
import { TourCardHeader } from "@/components/transporteur/TourCardHeader";
import { Button } from "@/components/ui/button";
import { Tour, TourStatus } from "@/types/tour";
import { ClientTimeline } from "@/components/tour/timeline/client/ClientTimeline";
import { SelectableCollectionPointsList } from "@/components/tour/SelectableCollectionPointsList";
import { Eye, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import AuthDialog from "@/components/auth/AuthDialog";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface TourTimelineCardProps {
  tour: Tour;
  onBookingClick: (tourId: number, pickupCity: string) => void;
  onStatusChange?: (tourId: number, newStatus: TourStatus) => Promise<void>;
  hideAvatar?: boolean;
  userType?: string;
  isUpcoming?: boolean;
}

export function TourTimelineCard({ 
  tour, 
  onBookingClick, 
  onStatusChange,
  hideAvatar, 
  userType,
  isUpcoming = false
}: TourTimelineCardProps) {
  const [selectedPickupCity, setSelectedPickupCity] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [existingRequest, setExistingRequest] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    checkExistingRequest();
  }, [tour.id]);

  const checkExistingRequest = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: request, error } = await supabase
      .from('approval_requests')
      .select('*')
      .eq('tour_id', tour.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error checking existing request:', error);
      return;
    }

    setExistingRequest(request);
  };

  const handleActionClick = async () => {
    if (!selectedPickupCity) {
      toast({
        variant: "destructive",
        title: "Point de collecte requis",
        description: "Veuillez sélectionner un point de collecte",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    if (tour.type === 'private') {
      if (existingRequest) {
        toast({
          title: "Demande existante",
          description: `Votre demande est ${existingRequest.status === 'pending' ? 'en attente' : existingRequest.status}`,
        });
        return;
      }
      setShowApprovalDialog(true);
    } else {
      navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(selectedPickupCity)}`);
    }
  };

  const getActionButtonText = () => {
    if (!selectedPickupCity) return "Sélectionnez un point de collecte";
    if (tour.type === 'private') {
      if (existingRequest) {
        switch (existingRequest.status) {
          case 'pending':
            return "Demande en attente d'approbation";
          case 'approved':
            return "Demande approuvée - Réserver";
          case 'rejected':
            return "Demande rejetée";
          default:
            return "Demander l'approbation";
        }
      }
      return "Demander l'approbation";
    }
    return "Réserver maintenant";
  };

  const isActionEnabled = () => {
    if (!selectedPickupCity) return false;
    if (tour.type === 'private') {
      if (existingRequest) {
        return existingRequest.status === 'approved';
      }
      return true;
    }
    return true;
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden transition-all duration-200 border border-gray-100 hover:shadow-lg shadow-md">
      <div className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-primary">
                {tour.tour_number || "Numéro non défini"}
              </span>
              {isUpcoming && (
                <Badge className="bg-[#9b87f5]/10 text-[#9b87f5] hover:bg-[#9b87f5]/20 transition-colors ml-2">
                  Prochaine tournée
                </Badge>
              )}
            </div>
          </div>

          <TourCardHeader tour={tour} hideAvatar={hideAvatar} />
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
                <ClientTimeline 
                  status={tour.status} 
                  tourId={tour.id}
                />

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

                {userType === 'client' && tour.status === "Programmée" && (
                  <div>
                    <Button 
                      onClick={handleActionClick}
                      className="w-full bg-[#0FA0CE] hover:bg-[#0FA0CE]/90 text-white"
                      disabled={!isActionEnabled()}
                    >
                      {getActionButtonText()}
                    </Button>
                  </div>
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
          checkExistingRequest();
        }}
        requiredUserType="client"
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