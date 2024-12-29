import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface CollectionPointFormProps {
  index: number;
  onRemove: (index: number) => void;
  form: UseFormReturn<any>;
  departureDate: Date;
}

export function CollectionPointForm({ index, onRemove, form, departureDate }: CollectionPointFormProps) {
  const { toast } = useToast();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const selectedDate = new Date(e.target.value);
      
      if (isNaN(selectedDate.getTime())) {
        throw new Error("Date invalide");
      }

      if (departureDate && !isNaN(departureDate.getTime()) && selectedDate > departureDate) {
        toast({
          variant: "destructive",
          title: "Date invalide",
          description: "La date de collecte doit être antérieure à la date de départ",
        });
        return;
      }

      form.setValue(`route.${index}.collection_date`, e.target.value);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Format de date invalide",
      });
    }
  };

  const maxDate = departureDate && !isNaN(departureDate.getTime()) 
    ? departureDate.toISOString().split('T')[0] 
    : undefined;

  const routeValue = form.watch(`route.${index}`);

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Point de collecte {index + 1}</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`route.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ville</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || routeValue?.name || ''} placeholder="Nom de la ville" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`route.${index}.location`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || routeValue?.location || ''} placeholder="Adresse précise" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`route.${index}.collection_date`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de collecte</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  value={field.value || routeValue?.collection_date || ''}
                  max={maxDate}
                  onChange={handleDateChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`route.${index}.time`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Heure</FormLabel>
              <FormControl>
                <Input type="time" {...field} value={field.value || routeValue?.time || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`route.${index}.type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || routeValue?.type || 'pickup'}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pickup">Collecte</SelectItem>
                  <SelectItem value="dropoff">Livraison</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}