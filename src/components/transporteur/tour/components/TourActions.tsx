import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface TourActionsProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function TourActions({ isExpanded, onToggle }: TourActionsProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full mt-4 text-[#0FA0CE] hover:text-[#0FA0CE] hover:bg-[#0FA0CE]/10"
      onClick={onToggle}
    >
      <Eye className="w-4 h-4 mr-2" />
      {isExpanded ? "Masquer les détails" : "Afficher les détails"}
    </Button>
  );
}