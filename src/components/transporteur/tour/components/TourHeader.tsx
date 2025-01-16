import { Badge } from "@/components/ui/badge";
import { Hash } from "lucide-react";
import { Tour } from "@/types/tour";
import { TourCardHeader } from "@/components/transporteur/TourCardHeader";

interface TourHeaderProps {
  tour: Tour;
  hideAvatar?: boolean;
  isUpcoming?: boolean;
}

export function TourHeader({ tour, hideAvatar, isUpcoming }: TourHeaderProps) {
  return (
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
  );
}