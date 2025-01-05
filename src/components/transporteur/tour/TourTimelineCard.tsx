import { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface TourTimelineCardProps {
  tour: Tour;
  onBookingClick: (tourId: number, pickupCity: string) => void;
  hideAvatar?: boolean;
  userType?: string | null;
  isUpcoming: boolean;
}

export function TourTimelineCard({ tour, onBookingClick, hideAvatar, userType, isUpcoming }: TourTimelineCardProps) {
  const navigate = useNavigate();

  const handleBookingClick = () => {
    if (!userType) {
      // Show auth dialog when user is not logged in
      const authDialog = document.createElement('div');
      authDialog.setAttribute('data-dialog-type', 'auth');
      document.body.appendChild(authDialog);
      const event = new CustomEvent('show-auth-dialog', { 
        detail: { 
          requiredUserType: 'client',
          returnPath: `/reserver/${tour.id}?pickupCity=${encodeURIComponent(tour.route[0].name)}`
        } 
      });
      document.dispatchEvent(event);
      return;
    }
    onBookingClick(tour.id, tour.route[0].name);
  };

  return (
    <div className={`border p-4 rounded-lg ${isUpcoming ? 'bg-green-100' : 'bg-white'}`}>
      <h3 className="text-lg font-semibold">{tour.title}</h3>
      <p>{tour.description}</p>
      <div className="flex justify-between items-center mt-4">
        <Button onClick={handleBookingClick} variant="primary">
          Réserver
        </Button>
        {hideAvatar ? null : <img src={tour.carriers.avatar_url} alt={tour.carriers.company_name} className="w-10 h-10 rounded-full" />}
      </div>
    </div>
  );
}
