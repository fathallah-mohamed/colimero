import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formSchema, BookingFormData } from "./schema";

export function useBookingForm(tourId: number, pickupCity: string) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

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
      package_description: ""
    }
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: clientData } = await supabase
          .from('clients')
          .select('first_name, last_name, phone')
          .eq('id', session.user.id)
          .single();

        if (clientData) {
          form.setValue('sender_name', `${clientData.first_name} ${clientData.last_name}`.trim());
          form.setValue('sender_phone', clientData.phone || '');
        }
      } else {
        navigate('/login', { 
          state: { 
            returnTo: window.location.pathname,
            tourId,
            pickupCity 
          }
        });
      }
    };

    fetchUserData();
  }, []);

  return {
    form,
    currentStep,
    setCurrentStep,
    completedSteps,
    setCompletedSteps
  };
}