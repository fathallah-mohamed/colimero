import { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "../schema";
import { supabase } from "@/integrations/supabase/client";

interface SenderStepProps {
  form: UseFormReturn<BookingFormData>;
}

export function SenderStep({ form }: SenderStepProps) {
  useEffect(() => {
    const fetchClientInfo = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: clientData, error } = await supabase
          .from('clients')
          .select('first_name, last_name, phone')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching client data:', error);
          return;
        }

        if (clientData) {
          form.setValue('sender_name', `${clientData.first_name} ${clientData.last_name}`.trim());
          form.setValue('sender_phone', clientData.phone || '');
        }
      } catch (error) {
        console.error('Error in fetchClientInfo:', error);
      }
    };

    fetchClientInfo();
  }, [form]);

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
              <FormMessage />
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
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}