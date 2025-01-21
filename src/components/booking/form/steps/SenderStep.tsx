import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BookingFormData } from "../schema";

interface SenderStepProps {
  form: UseFormReturn<BookingFormData>;
}

export function SenderStep({ form }: SenderStepProps) {
  const [senderData, setSenderData] = useState<{
    first_name?: string;
    last_name?: string;
    phone?: string;
  } | null>(null);

  useEffect(() => {
    const loadSenderData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: clientData } = await supabase
          .from('clients')
          .select('first_name, last_name, phone')
          .eq('id', user.id)
          .single();

        if (clientData) {
          setSenderData(clientData);
          // Pré-remplir le formulaire avec les données du client
          form.setValue('sender_name', `${clientData.first_name} ${clientData.last_name}`);
          form.setValue('sender_phone', clientData.phone || '');
        }
      }
    };

    loadSenderData();
  }, [form]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-4">Informations de l'expéditeur</h2>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="sender_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom et prénom</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Votre nom complet" />
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
                <FormLabel>Numéro de téléphone</FormLabel>
                <div className="flex gap-2">
                  <Select defaultValue="FR" disabled>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Pays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FR">France (+33)</SelectItem>
                      <SelectItem value="TN">Tunisie (+216)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormControl>
                    <Input {...field} type="tel" className="flex-1" placeholder="Votre numéro" />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}