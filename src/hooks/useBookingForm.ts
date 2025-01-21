import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { formSchema, BookingFormData } from "../components/booking/form/schema";
import { supabase } from "@/integrations/supabase/client";

export function useBookingForm(tourId: number, pickupCity: string) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: clientData } = await supabase
          .from('clients')
          .select('first_name, last_name, phone')
          .eq('id', user.id)
          .maybeSingle();

        if (clientData) {
          return {
            sender_name: `${clientData.first_name} ${clientData.last_name}`.trim(),
            sender_phone: clientData.phone || "",
            recipient_name: "",
            recipient_phone: "",
            recipient_address: "",
            delivery_city: "",
            pickup_city: pickupCity,
            item_type: "",
            weight: 5,
            special_items: [],
            content_types: [],
            photos: [],
            package_description: "",
            terms_accepted: false,
            customs_declaration: false
          };
        }
      }

      return {
        sender_name: "",
        sender_phone: "",
        recipient_name: "",
        recipient_phone: "",
        recipient_address: "",
        delivery_city: "",
        pickup_city: pickupCity,
        item_type: "",
        weight: 5,
        special_items: [],
        content_types: [],
        photos: [],
        package_description: "",
        terms_accepted: false,
        customs_declaration: false
      };
    }
  });

  return {
    form,
    currentStep,
    setCurrentStep,
    completedSteps,
    setCompletedSteps
  };
}