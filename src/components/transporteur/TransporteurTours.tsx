import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { TransporteurAvatar } from "./TransporteurAvatar";

export function TransporteurTours({ tours }: { tours: any[] }) {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      {tours.map((tour) => (
        <Card key={tour.id} className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <TransporteurAvatar
                  avatarUrl={tour.carriers?.avatar_url}
                  name={tour.carriers?.company_name}
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
              <p>Date: {new Date(tour.date).toLocaleDateString()}</p>
              <p>Statut: {tour.status}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
