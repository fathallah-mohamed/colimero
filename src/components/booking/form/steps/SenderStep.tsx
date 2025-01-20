import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "../schema";

interface SenderStepProps {
  form: UseFormReturn<BookingFormData>;
}

export function SenderStep({ form }: SenderStepProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-semibold">Informations de l'expéditeur</h2>
      <div className="grid gap-6">
        <FormField
          control={form.control}
          name="sender_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input placeholder="Votre nom complet" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sender_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input placeholder="+33 6 XX XX XX XX" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}