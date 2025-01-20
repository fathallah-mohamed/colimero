import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TourDetailsHero } from "@/components/tour/TourDetailsHero";
import { ClientTourCard } from "@/components/send-package/tour/ClientTourCard";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import type { Tour, TourStatus, BookingStatus } from "@/types/tour";
import Navigation from "@/components/Navigation";
import AuthDialog from "@/components/auth/AuthDialog";
import { ApprovalRequestDialog } from "@/components/tour/ApprovalRequestDialog";
import { useState } from "react";

export default function TourDetails() {
  const { tourId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [selectedPickupCity, setSelectedPickupCity] = useState<string | null>(null);
  const {
    showAuthDialog,
    setShowAuthDialog,
    showAccessDeniedDialog,
    setShowAccessDeniedDialog,
    handleBookingClick,
    handleAuthSuccess
  } = useBookingFlow();

  const { data: tour, isLoading } = useQuery({
    queryKey: ["tour", tourId],
    queryFn: async () => {
      if (!tourId) throw new Error("Tour ID is required");
      
      const { data, error } = await supabase
        .from("tours")
        .select(`
          *,
          carriers (
            *,
            carrier_capacities (*)
          ),
          bookings (*)
        `)
        .eq("id", parseInt(tourId))
        .single();

      if (error) throw error;

      // Transform the route data to match the Tour type
      const transformedTour: Tour = {
        ...data,
        route: Array.isArray(data.route) 
          ? data.route 
          : typeof data.route === 'string' 
            ? JSON.parse(data.route) 
            : data.route,
        status: data.status as TourStatus,
        previous_status: data.previous_status as TourStatus | null,
        type: data.type,
        customs_declaration: Boolean(data.customs_declaration),
        terms_accepted: Boolean(data.terms_accepted),
        bookings: data.bookings?.map(booking => ({
          ...booking,
          status: booking.status as BookingStatus,
          special_items: Array.isArray(booking.special_items) 
            ? booking.special_items 
            : typeof booking.special_items === 'string'
              ? JSON.parse(booking.special_items)
              : [],
          content_types: booking.content_types || [],
          terms_accepted: Boolean(booking.terms_accepted),
          customs_declaration: Boolean(booking.customs_declaration)
        })) || []
      };

      return transformedTour;
    }
  });

  const handleShare = async () => {
    const tourUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Partager la tournée',
          text: 'Consultez cette tournée',
          url: tourUrl,
        });
      } else {
        await navigator.clipboard.writeText(tourUrl);
        toast({
          title: "Lien copié !",
          description: "Le lien de la tournée a été copié dans votre presse-papiers",
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de partager la tournée",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900">Tournée non trouvée</h1>
        <p className="text-gray-600 mt-2">La tournée que vous recherchez n'existe pas.</p>
      </div>
    );
  }

  const handleBooking = async () => {
    if (!tour) return;
    const firstStop = tour.route[0];
    setSelectedPickupCity(firstStop.name);

    if (tour.type === 'private') {
      setShowApprovalDialog(true);
    } else {
      await handleBookingClick(tour.id, firstStop.name);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <TourDetailsHero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Tournée {tour.tour_number || `#${tour.id}`}
                </h2>
                <p className="text-gray-600">
                  {tour.carriers?.company_name}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Partager
              </Button>
            </div>

            <ClientTourCard 
              tour={tour}
              onBookingClick={handleBooking}
              showBookingButton={true}
            />
          </div>
        </div>
      </div>

      <AuthDialog 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={handleAuthSuccess}
        requiredUserType="client"
      />

      <ApprovalRequestDialog
        isOpen={showApprovalDialog}
        onClose={() => setShowApprovalDialog(false)}
        tourId={parseInt(tourId || "0")}
        pickupCity={selectedPickupCity || ""}
      />
    </div>
  );
}