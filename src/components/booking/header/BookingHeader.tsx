import { Badge } from "@/components/ui/badge";

const statusMap = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmée", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Annulée", color: "bg-red-100 text-red-800" },
  collected: { label: "Collectée", color: "bg-blue-100 text-blue-800" },
};

interface BookingHeaderProps {
  booking: any;
}

export function BookingHeader({ booking }: BookingHeaderProps) {
  const status = statusMap[booking.status as keyof typeof statusMap];

  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-medium">{booking.recipient_name}</h3>
        <p className="text-sm text-gray-500">{booking.recipient_phone}</p>
        <p className="text-sm text-gray-500">{booking.delivery_city}</p>
      </div>
      <Badge className={status.color}>{status.label}</Badge>
    </div>
  );
}