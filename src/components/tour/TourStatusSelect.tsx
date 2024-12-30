import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type TourStatus = "planned" | "collecting" | "in_transit" | "completed" | "cancelled";

const statuses: { value: TourStatus; label: string }[] = [
  { value: "planned", label: "Planifiée" },
  { value: "collecting", label: "Collecte en cours" },
  { value: "in_transit", label: "Livraison en cours" },
  { value: "completed", label: "Terminée" },
  { value: "cancelled", label: "Annulée" },
];

interface TourStatusSelectProps {
  tourId: number;
  currentStatus: TourStatus;
  onStatusChange: (newStatus: TourStatus) => void;
}

export function TourStatusSelect({ tourId, currentStatus, onStatusChange }: TourStatusSelectProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (value: TourStatus) => {
    try {
      const { error } = await supabase
        .from('tours')
        .update({ status: value })
        .eq('id', tourId);

      if (error) throw error;

      onStatusChange(value);
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la tournée a été mis à jour avec succès.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la tournée.",
      });
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {currentStatus ? statuses.find((status) => status.value === currentStatus)?.label : "Sélectionner un statut"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher un statut..." />
          <CommandEmpty>Aucun statut trouvé.</CommandEmpty>
          <CommandGroup>
            {statuses.map((status) => (
              <CommandItem
                key={status.value}
                value={status.value}
                onSelect={() => handleStatusChange(status.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    currentStatus === status.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {status.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}