import { useToast } from "@/hooks/use-toast";
import { TourStatusTimeline } from "./TourStatusTimeline";
import { TourBookingsList } from "./TourBookingsList";
import { TourHeader } from "./tour-card/TourHeader";
import { TourActions } from "./tour-card/TourActions";
import { generateTourPDF } from "./tour-card/PDFGenerator";

interface TourCardProps {
  tour: any;
  onEdit: (tour: any) => void;
  onDelete: (tourId: number) => void;
  onStatusChange: (tourId: number, newStatus: string) => void;
}

export function TourCard({ tour, onEdit, onDelete, onStatusChange }: TourCardProps) {
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    const success = await generateTourPDF(tour);
    
    if (success) {
      toast({
        title: "Succès",
        description: "Le PDF a été généré avec succès",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le PDF",
      });
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start">
        <TourHeader tour={tour} />
        <TourActions
          onEdit={() => onEdit(tour)}
          onDelete={() => onDelete(tour.id)}
          onDownloadPDF={handleDownloadPDF}
        />
      </div>

      <TourStatusTimeline 
        tourId={tour.id}
        currentStatus={tour.status}
        onStatusChange={(newStatus) => onStatusChange(tour.id, newStatus)}
      />

      <TourBookingsList 
        tourId={tour.id}
        tourStatus={tour.status}
      />
    </div>
  );
}