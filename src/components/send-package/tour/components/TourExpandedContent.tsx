import { Tour, TourStatus } from "@/types/tour";
import { ClientTimeline } from "@/components/tour/timeline/client/ClientTimeline";
import { SelectableCollectionPointsList } from "@/components/tour/SelectableCollectionPointsList";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import AuthDialog from "@/components/auth/AuthDialog";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";

interface TourExpandedContentProps {
  tour: Tour;
  selectedPoint: string;
  onPointSelect: (point: string) => void;
  onActionClick: () => void;
  isActionEnabled: boolean;
  actionButtonText: string;
  hasPendingRequest: boolean;
}

export function TourExpandedContent({
  tour,
  selectedPoint,
  onPointSelect,
  onActionClick,
  isActionEnabled,
  actionButtonText,
  hasPendingRequest
}: TourExpandedContentProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const pickupPoints = tour.route?.filter(stop => 
    stop.type === 'pickup' || stop.type === 'ramassage'
  ) || [];

  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="pt-6 space-y-6"
    >
      <ClientTimeline 
        status={tour.status} 
        tourId={tour.id}
      />

      <div>
        <h4 className="text-sm font-medium mb-2">Points de collecte</h4>
        <SelectableCollectionPointsList
          points={pickupPoints}
          selectedPoint={selectedPoint}
          onPointSelect={onPointSelect}
          isSelectionEnabled={tour.status === "Programmée"}
          tourDepartureDate={tour.departure_date}
        />
      </div>

      <div>
        <Button 
          onClick={onActionClick}
          className="w-full bg-[#0FA0CE] hover:bg-[#0FA0CE]/90 text-white"
          disabled={!isActionEnabled || hasPendingRequest}
        >
          {actionButtonText}
        </Button>
      </div>

      <AuthDialog 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={() => {
          setShowAuthDialog(false);
          onActionClick();
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
        pickupCity={selectedPoint}
      />
    </motion.div>
  );
}