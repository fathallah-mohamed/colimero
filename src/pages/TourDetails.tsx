import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tour, RouteStop } from "@/types/tour";
import { Loader2, Calendar, MapPin, Package2, Users } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { TourRoute } from "@/components/send-package/tour/components/TourRoute";
import { TourStatusBadge } from "@/components/tour/TourStatusBadge";
import { Badge } from "@/components/ui/badge";
import { TourMainInfo } from "@/components/send-package/tour/components/TourMainInfo";
import { ClientTourDetails } from "@/components/send-package/tour/ClientTourDetails";
import { ClientTourTimeline } from "@/components/send-package/tour/ClientTourTimeline";

export default function TourDetails() {
  const { id } = useParams();

  const { data: tour, isLoading } = useQuery({
    queryKey: ["tour", id],
    queryFn: async () => {
      if (!id) throw new Error("Tour ID is required");
      
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
        .eq("id", parseInt(id))
        .maybeSingle();

      if (error) {
        console.error("Error fetching tour:", error);
        throw error;
      }
      if (!data) throw new Error("Tour not found");

      // Convert the JSON route to RouteStop[]
      const routeData = typeof data.route === 'string' ? JSON.parse(data.route) : data.route;
      const parsedRoute: RouteStop[] = Array.isArray(routeData) 
        ? routeData.map(stop => ({
            name: stop.name,
            location: stop.location,
            time: stop.time,
            type: stop.type
          }))
        : [];

      return {
        ...data,
        route: parsedRoute
      } as Tour;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Tournée {tour.tour_number}
              </h1>
              <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  {format(new Date(tour.departure_date), "d MMMM yyyy", { locale: fr })}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  {tour.departure_country} → {tour.destination_country}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Package2 className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  {tour.remaining_capacity} kg disponibles
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  {tour.bookings?.length || 0} réservations
                </div>
              </div>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2">
              <TourStatusBadge status={tour.status} />
              <Badge variant={tour.type === "public" ? "default" : "secondary"}>
                {tour.type === "public" ? "Publique" : "Privée"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Tour Details */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Main Info Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <TourMainInfo tour={tour} />
          </div>

          {/* Tour Details Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <ClientTourDetails tour={tour} />
          </div>

          {/* Timeline Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <ClientTourTimeline tour={tour} />
          </div>
        </div>
      </div>
    </div>
  );
}