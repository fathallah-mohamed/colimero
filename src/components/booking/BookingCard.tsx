import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Info } from "lucide-react";
import { EditBookingDialog } from "./EditBookingDialog";
import { BookingActions } from "./card/BookingActions";
import { BookingHeaderSection } from "./header/BookingHeaderSection";
import { BookingDetailsContent } from "./details/BookingDetailsContent";
import type { Booking, BookingStatus } from "@/types/booking";

interface BookingCardProps {
  booking: Booking;
  isCollecting: boolean;
  onStatusChange: (bookingId: string, status: BookingStatus) => void;
  onUpdate: () => Promise<void>;
  tourStatus?: string;
}

export function BookingCard({ 
  booking, 
  isCollecting, 
  onStatusChange, 
  onUpdate, 
  tourStatus 
}: BookingCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  console.log("BookingCard - Booking status:", booking.status);
  console.log("BookingCard - Tour status:", tourStatus);

  const handleEdit = () => {
    console.log("Opening edit dialog for booking:", booking.id);
    setShowEditDialog(true);
  };

  const handleStatusChange = async (newStatus: BookingStatus) => {
    console.log("Changing booking status to:", newStatus);
    await onStatusChange(booking.id, newStatus);
  };

  return (
    <Card className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="space-y-4">
        <BookingHeaderSection booking={booking} />
        
        <div className="flex justify-end">
          <BookingActions
            bookingId={booking.id}
            status={booking.status}
            tourStatus={tourStatus || ''}
            onStatusChange={onStatusChange}
            onUpdate={onUpdate}
            onEdit={handleEdit}
            userType="carrier"
          />
        </div>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Info className="h-4 w-4" />
              {isExpanded ? "Masquer les détails" : "Voir les détails"}
            </Button>
          </CollapsibleTrigger>

          <BookingDetailsContent booking={booking} isExpanded={isExpanded} />
        </Collapsible>
      </div>

      <EditBookingDialog
        booking={booking}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={onUpdate}
      />
    </Card>
  );
}