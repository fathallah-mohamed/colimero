import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { TransporteurAvatar } from "./TransporteurAvatar";
import type { Tour } from "@/types/tour";

interface TransporteurToursProps {
  tours: Tour[];
  isLoading?: boolean;
  type?: 'public' | 'private';
}

export function TransporteurTours({ tours, isLoading, type }: TransporteurToursProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {tours.map((tour) => (
        <Card key={tour.id} className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <TransporteurAvatar
                  avatarUrl={tour.carriers?.avatar_url}
                  name={tour.carriers?.company_name || ""}
                  size="sm"
                />
                <span className="text-gray-600">
                  {tour.carriers?.company_name}
                </span>
              </div>
              <button
                onClick={() => navigate(`/tours/${tour.id}`)}
                className="text-blue-600 hover:underline"
              >
                Voir les détails
              </button>
            </div>
            <div className="text-gray-500">
              <p>Date: {new Date(tour.departure_date).toLocaleDateString()}</p>
              <p>Type: {tour.type}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}