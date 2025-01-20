import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TourMainInfo } from "./components/TourMainInfo";
import { TourRoute } from "./components/TourRoute";
import { TourExpandedContent } from "./components/TourExpandedContent";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import { ShareTourButton } from "@/components/tour/shared/ShareTourButton";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ClientTourCardProps {
  tour: any;
  onBookingSuccess?: () => void;
}

export function ClientTourCard({ tour, onBookingSuccess }: ClientTourCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const navigate = useNavigate();

  const handleTourClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleBookingClick = () => {
    setShowAuthDialog(true);
  };

  return (
    <div className="relative w-full rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="cursor-pointer" onClick={handleTourClick}>
              <TourMainInfo tour={tour} />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/tours/${tour.id}`)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Consulter
              </Button>
              <ShareTourButton tourId={tour.id} className="shrink-0" />
            </div>
          </div>
          
          <TourRoute
            route={tour.route}
            departureDate={tour.departure_date}
            collectionDate={tour.collection_date}
          />
        </div>

        {isExpanded && (
          <TourExpandedContent
            tour={tour}
            onBookingClick={handleBookingClick}
            onBookingSuccess={onBookingSuccess}
          />
        )}
      </div>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Authentification requise</DialogTitle>
            <DialogDescription>
              <AccessDeniedMessage />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}