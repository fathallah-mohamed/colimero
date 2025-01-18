import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./schema";

interface BookingFormFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  readOnly?: boolean;
}

export function BookingFormFields({ form, readOnly = false }: BookingFormFieldsProps) {
  return (
    <>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="sender_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Votre nom</FormLabel>
              <FormControl>
                <Input {...field} readOnly className="bg-gray-100" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sender_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Votre téléphone</FormLabel>
              <FormControl>
                <Input {...field} type="tel" readOnly className="bg-gray-100" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="recipient_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du destinataire</FormLabel>
              <FormControl>
                <Input {...field} readOnly={readOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recipient_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse de livraison</FormLabel>
              <FormControl>
                <Input {...field} readOnly={readOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recipient_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone du destinataire</FormLabel>
              <FormControl>
                <Input {...field} type="tel" readOnly={readOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="item_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description du colis</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Vêtements, documents..." readOnly={readOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="special_items"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions spéciales (optionnel)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Ex: Fragile, manipuler avec précaution..."
                  readOnly={readOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}