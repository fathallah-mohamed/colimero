import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { formSchema, BookingFormData } from "@/components/booking/form/schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function useBookingForm(tourId: number, pickupCity: string) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    },
    mode: "onChange"
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        console.log("Loading user data for:", user.id);

        const { data: clientData, error } = await supabase
          .from('clients')
          .select('first_name, last_name, phone')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching client data:', error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger vos informations",
          });
          return;
        }

        if (clientData) {
          console.log("Client data loaded:", clientData);
          form.setValue('sender_name', `${clientData.first_name} ${clientData.last_name}`.trim());
          form.setValue('sender_phone', clientData.phone || "");
        }
      } catch (error) {
        console.error('Error in loadUserData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [form]);

  return {
    form,
    currentStep,
    setCurrentStep,
    completedSteps,
    setCompletedSteps,
    isLoading
  };
}