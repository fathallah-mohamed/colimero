import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookingForm } from "@/components/booking/BookingForm";
import { Tour, RouteStop, TourStatus } from "@/types/tour";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import CarrierAuthDialog from "@/components/auth/CarrierAuthDialog";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";

export default function Reserver() {
  const { tourId } = useParams();
  const [searchParams] = useSearchParams();
  const pickupCity = searchParams.get('pickupCity');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showCarrierDialog, setShowCarrierDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);
  const [accessDeniedReason, setAccessDeniedReason] = useState("");

  const { data: tour, isLoading } = useQuery({
    queryKey: ["tour", tourId],
    queryFn: async () => {
      if (!tourId) throw new Error("Tour ID is required");
      
      const { data, error } = await supabase
        .from("tours")
        .select(`
          *,
          carriers (
            company_name,
            first_name,
            last_name,
            avatar_url,
            carrier_capacities (
              price_per_kg
            )
          )
        `)
        .eq("id", parseInt(tourId, 10))
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Tour not found");

      const transformedTour: Tour = {
        ...data,
        id: parseInt(data.id.toString(), 10),
        route: (data.route as any[]).map((stop): RouteStop => ({
          name: stop.name,
          location: stop.location,
          time: stop.time,
          type: stop.type,
          collection_date: stop.collection_date
        })),
        status: data.status as TourStatus,
        previous_status: data.previous_status as TourStatus | null
      };

      return transformedTour;
    },
    enabled: !!tourId
  });

  useEffect(() => {
    const checkAuthAndAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        const currentPath = `/reserver/${tourId}${pickupCity ? `?pickupCity=${pickupCity}` : ''}`;
        sessionStorage.setItem('returnPath', currentPath);
        navigate('/connexion');
        return;
      }

      const userType = session.user.user_metadata?.user_type;
      if (userType === 'carrier') {
        setShowCarrierDialog(true);
        return;
      }

      // Vérifier s'il existe une réservation en attente pour cette tournée
      const { data: existingBooking, error: bookingError } = await supabase
        .from('bookings')
        .select('status')
        .eq('user_id', session.user.id)
        .eq('tour_id', parseInt(tourId!, 10))
        .eq('status', 'pending')
        .maybeSingle();

      if (bookingError) {
        console.error('Error checking existing booking:', bookingError);
        return;
      }

      if (existingBooking) {
        setAccessDeniedReason("Vous avez déjà une réservation en attente pour cette tournée. Veuillez attendre que votre réservation soit traitée avant d'en effectuer une nouvelle.");
        setShowAccessDeniedDialog(true);
        return;
      }

      // Pour les tournées privées, vérifier s'il y a une réservation annulée
      if (tour?.type === 'private') {
        const { data: cancelledBooking } = await supabase
          .from('bookings')
          .select('status')
          .eq('user_id', session.user.id)
          .eq('tour_id', parseInt(tourId!, 10))
          .eq('status', 'cancelled')
          .maybeSingle();

        if (cancelledBooking) {
          const { data: approvalRequest } = await supabase
            .from('approval_requests')
            .select('status')
            .eq('user_id', session.user.id)
            .eq('tour_id', parseInt(tourId!, 10))
            .eq('status', 'approved')
            .maybeSingle();

          if (!approvalRequest) {
            setShowApprovalDialog(true);
            return;
          }
        }
      }
    };

    if (tour) {
      checkAuthAndAccess();
    }
  }, [tour, tourId, pickupCity, navigate]);

  const handleDialogClose = () => {
    setShowCarrierDialog(false);
    navigate('/');
  };

  const handleApprovalSuccess = () => {
    setShowApprovalDialog(false);
    toast({
      title: "Demande envoyée",
      description: "Votre demande d'approbation a été envoyée avec succès",
    });
    navigate('/mes-reservations');
  };

  if (showCarrierDialog) {
    return <CarrierAuthDialog isOpen={true} onClose={handleDialogClose} />;
  }

  if (showAccessDeniedDialog) {
    return (
      <AccessDeniedMessage
        userType="client"
        isOpen={true}
        onClose={() => {
          setShowAccessDeniedDialog(false);
          navigate('/mes-reservations');
        }}
        message={accessDeniedReason}
      />
    );
  }

  if (showApprovalDialog && tourId) {
    return (
      <ApprovalRequestDialog
        isOpen={true}
        onClose={() => {
          setShowApprovalDialog(false);
          navigate('/');
        }}
        tourId={parseInt(tourId, 10)}
        pickupCity={pickupCity || ''}
        onSuccess={handleApprovalSuccess}
      />
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!tour) {
    return <div>Tour not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <BookingForm 
        tourId={tour.id}
        pickupCity={pickupCity || tour.route[0].name}
        onSuccess={() => {
          toast({
            title: "Réservation créée",
            description: "Votre réservation a été créée avec succès",
          });
          navigate('/mes-reservations');
        }}
      />
    </div>
  );
}