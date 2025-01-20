import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, Check } from "lucide-react";
import { BookingFormData } from "../schema";

interface RecipientStepProps {
  form: UseFormReturn<BookingFormData>;
}

interface Recipient {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export function RecipientStep({ form }: RecipientStepProps) {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);

  useEffect(() => {
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    try {
      const { data: recipientsData, error } = await supabase
        .from('recipients')
        .select('*');

      if (error) throw error;
      setRecipients(recipientsData || []);
    } catch (error) {
      console.error('Error fetching recipients:', error);
    }
  };

  const handleRecipientSelect = (recipient: Recipient) => {
    setSelectedRecipient(recipient);
    form.setValue('recipient_name', `${recipient.first_name} ${recipient.last_name}`);
    form.setValue('recipient_phone', recipient.phone);
    form.setValue('recipient_address', recipient.address);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-semibold">Informations du destinataire</h2>

      {recipients.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Destinataires enregistrés</h3>
          <div className="grid gap-2">
            {recipients.map((recipient) => (
              <Button
                key={recipient.id}
                type="button"
                variant={selectedRecipient?.id === recipient.id ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => handleRecipientSelect(recipient)}
              >
                {selectedRecipient?.id === recipient.id ? (
                  <Check className="w-4 h-4 mr-2" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                {recipient.first_name} {recipient.last_name}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6">
        <FormField
          control={form.control}
          name="recipient_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input placeholder="Nom du destinataire" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recipient_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input placeholder="+33 6 XX XX XX XX" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recipient_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse complète</FormLabel>
              <FormControl>
                <Input placeholder="Adresse de livraison" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}