import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { generateTourPDF } from "./tour-card/PDFGenerator";
import { useToast } from "@/hooks/use-toast";
import type { Tour } from "@/types/tour";

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
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const success = await generateTourPDF(tour);
      if (success) {
        toast({
          title: "PDF généré avec succès",
          description: "Le fichier a été téléchargé",
        });
      } else {
        throw new Error("Erreur lors de la génération du PDF");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le PDF",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!hasBookings) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownloadPDF}
      disabled={isGeneratingPDF}
      className="flex items-center gap-2"
    >
      <FileDown className="h-4 w-4" />
      {isGeneratingPDF ? "Génération..." : "Télécharger PDF"}
    </Button>
  );
}