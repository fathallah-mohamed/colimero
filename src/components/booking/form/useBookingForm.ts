import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { formSchema, BookingFormData } from "./schema";

export function useBookingForm(tourId: number, pickupCity: string) {
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
      package_description: "",
      terms_accepted: false,
      customs_declaration: false
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