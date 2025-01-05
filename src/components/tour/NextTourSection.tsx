import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tour } from "@/types/tour";

interface NextTourSectionProps {
  isLoading: boolean;
  nextTour: Tour | null;
}

export function NextTourSection({ isLoading, nextTour }: NextTourSectionProps) {
  if (isLoading) {
    return (
      <div className="py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Tournée à ne pas manquer !</h2>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!nextTour) {
    return (
      <div className="py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Tournée à ne pas manquer !</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">
              Aucune tournée planifiée pour le moment
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="text-center mb-6">
      <h2 className="text-3xl font-bold text-primary mb-2">Tournée à ne pas manquer !</h2>
      <p className="text-gray-600">
        Réservez votre place sur notre prochaine tournée et profitez des meilleurs tarifs
      </p>
    </div>
  );
}