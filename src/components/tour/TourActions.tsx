import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Tour } from "@/types/tour";
import { generateDeliverySlip } from "@/utils/generateDeliverySlip";

interface TourActionsProps {
  tour: Tour;
  hasBookings: boolean;
  isGeneratingPDF: boolean;
  setIsGeneratingPDF: (value: boolean) => void;
}

export function TourActions({ 
  tour,
  hasBookings,
  isGeneratingPDF,
  setIsGeneratingPDF
}: TourActionsProps) {
  const handleGeneratePDF = async () => {
    if (!hasBookings) return;
    
    setIsGeneratingPDF(true);
    try {
      await generateDeliverySlip(tour);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleGeneratePDF}
        disabled={!hasBookings || isGeneratingPDF}
        className="text-[#0FA0CE] hover:text-[#0FA0CE] hover:bg-[#0FA0CE]/10"
      >
        <Download className="w-4 h-4 mr-2" />
        {isGeneratingPDF ? "Génération..." : "Bordereau"}
      </Button>
    </div>
  );
}