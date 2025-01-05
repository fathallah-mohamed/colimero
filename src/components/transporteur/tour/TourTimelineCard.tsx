import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tour } from "@/types/tour";
import { formatDate } from "@/lib/utils";
import { TourStatus } from "@/types/tour";
import { TourStatusBadge } from "@/components/tour/TourStatusBadge";
import { TourCapacity } from "@/components/tour/TourCapacity";
import { TourPrice } from "@/components/tour/TourPrice";
import { TourRoute } from "@/components/tour/TourRoute";
import AuthDialog from "@/components/auth/AuthDialog";
import { useAuth } from "@/hooks/use-auth";

export function TourTimelineCard({ tour }: { tour: Tour }) {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleReserveClick = () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    navigate(`/reserver/${tour.id}`);
  };

  const handleAuthSuccess = () => {
    setShowAuthDialog(false);
    navigate(`/reserver/${tour.id}`);
  };

  const getStatusColor = (status: TourStatus) => {
    switch (status) {
      case "planned":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isReservable = tour.status === "planned" && tour.remaining_capacity > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Tournée du {formatDate(tour.departure_date)}
          </h3>
          <TourStatusBadge status={tour.status} />
        </div>
        <TourPrice tour={tour} />
      </div>

      <TourRoute tour={tour} />

      <div className="flex justify-between items-center">
        <TourCapacity tour={tour} />
        
        {isReservable && (
          <Button
            onClick={handleReserveClick}
            className="bg-[#00B0F0] hover:bg-[#0082b3] text-white"
          >
            Réserver
          </Button>
        )}
      </div>

      <div className="border-t pt-4 mt-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {tour.carriers?.avatar_url ? (
              <img
                src={tour.carriers.avatar_url}
                alt={tour.carriers?.company_name}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200" />
            )}
          </div>
          <div>
            <p className="font-medium">{tour.carriers?.company_name}</p>
            <p className="text-sm text-gray-500">Transporteur vérifié</p>
          </div>
        </div>
      </div>

      <AuthDialog
        open={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={handleAuthSuccess}
        requiredUserType="client"
      />
    </div>
  );
}