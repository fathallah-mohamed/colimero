import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ApprovalRequestHeaderProps {
  tour: any;
  userType: string | null;
  user: any;
}

export function ApprovalRequestHeader({ tour, userType, user }: ApprovalRequestHeaderProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold">
        {tour?.departure_country} → {tour?.destination_country}
      </h2>
      <p className="text-gray-600">
        Transporteur : {tour?.carriers?.company_name}
      </p>
      {userType === 'carrier' && user && (
        <>
          <p className="text-gray-600">
            Client : {user.first_name} {user.last_name}
          </p>
          {user.phone && (
            <p className="text-gray-600">
              Téléphone : {user.phone}
            </p>
          )}
        </>
      )}
      <p className="text-gray-600">
        Date de départ : {tour?.departure_date ? 
          format(new Date(tour.departure_date), "EEEE d MMMM yyyy", { locale: fr }) : 
          'Non spécifiée'}
      </p>
    </div>
  );
}