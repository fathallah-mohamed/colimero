import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Tour } from "@/types/tour";

interface TourActionsProps {
  tour: Tour;
}

export function TourActions({ tour }: TourActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Ouvrir le menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Voir les détails</DropdownMenuItem>
        {tour.status === 'planned' && (
          <DropdownMenuItem>Modifier</DropdownMenuItem>
        )}
        {tour.status !== 'cancelled' && tour.status !== 'completed' && (
          <DropdownMenuItem className="text-red-600">
            Annuler
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}