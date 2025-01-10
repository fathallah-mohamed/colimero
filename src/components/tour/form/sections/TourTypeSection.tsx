import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormSection } from "../FormSection";
import { Lock, Globe } from "lucide-react";

interface TourTypeSectionProps {
  form: UseFormReturn<any>;
}

export function TourTypeSection({ form }: TourTypeSectionProps) {
  return (
    <FormSection title="Type de tournée">
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de tournée</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type de tournée" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>Publique</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span>Privée</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {field.value === "public" 
                  ? "Une tournée publique est visible et accessible à tous les clients"
                  : "Une tournée privée nécessite votre approbation pour chaque réservation"}
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
    </FormSection>
  );
}