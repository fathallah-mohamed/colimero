import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { BookingContentTypes } from "./BookingContentTypes";
import { BookingWeightSelector } from "./BookingWeightSelector";
import { BookingPhotoUpload } from "./BookingPhotoUpload";
import { BookingSpecialItems } from "./BookingSpecialItems";
import { BookingErrorDialog } from "./form/BookingErrorDialog";
import { BookingConfirmDialog } from "./form/BookingConfirmDialog";
import { useNavigate } from "react-router-dom";
import { BookingFormFields } from "./form/BookingFormFields";
import { formSchema } from "./form/schema";
import { useBookingFormState } from "./form/useBookingFormState";
import { useBookingSubmit } from "./form/useBookingSubmit";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import * as z from "zod";

const specialItems = [
  { name: "Vélo", price: 50, icon: "bicycle" },
  { name: "Trottinette", price: 30, icon: "scooter" },
  { name: "Télévision", price: 40, icon: "tv" },
  { name: "Meuble", price: 60, icon: "cabinet" },
  { name: "Instrument de musique", price: 45, icon: "music" },
  { name: "Équipement sportif", price: 35, icon: "dumbbell" }
];

const contentTypes = [
  "Vêtements",
  "Électronique",
  "Documents",
  "Alimentaire",
  "Cosmétiques",
  "Autres",
];

export interface BookingFormProps {
  tourId: number;
  pickupCity: string;
  onSuccess: () => void;
}

export function BookingForm({ tourId, pickupCity, onSuccess }: BookingFormProps) {
  const navigate = useNavigate();
  const {
    weight,
    selectedTypes,
    selectedItems,
    itemQuantities,
    photos,
    showErrorDialog,
    showConfirmDialog,
    trackingNumber,
    errorMessage,
    setShowErrorDialog,
    setShowConfirmDialog,
    setTrackingNumber,
    setErrorMessage,
    handleWeightChange,
    handleTypeToggle,
    handleItemToggle,
    handleQuantityChange,
    handlePhotoUpload
  } = useBookingFormState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: 5,
      recipient_name: "",
      recipient_address: "",
      recipient_phone: "",
      sender_name: "",
      sender_phone: "",
      item_type: "",
      special_items: "",
    },
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: clientData } = await supabase
          .from('clients')
          .select('first_name, last_name, phone')
          .eq('id', user.id)
          .single();

        if (clientData) {
          form.setValue('sender_name', `${clientData.first_name} ${clientData.last_name}`.trim());
          form.setValue('sender_phone', clientData.phone || '');
        }
      }
    };

    fetchUserInfo();
  }, [form]);

  const { handleSubmit, isLoading } = useBookingSubmit(
    tourId,
    onSuccess,
    setTrackingNumber,
    setShowConfirmDialog,
    setErrorMessage,
    setShowErrorDialog
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formattedSpecialItems = selectedItems.map(itemName => ({
      name: itemName,
      quantity: itemQuantities[itemName] || 1
    }));

    const formData = {
      ...values,
      weight,
      pickup_city: pickupCity,
      delivery_city: "À définir",
      content_types: selectedTypes,
      photos,
      special_items: formattedSpecialItems,
      sender_name: values.sender_name,
      sender_phone: values.sender_phone,
      recipient_name: values.recipient_name,
      recipient_address: values.recipient_address,
      recipient_phone: values.recipient_phone,
      item_type: values.item_type
    };

    await handleSubmit(values, formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BookingWeightSelector
          weight={weight}
          onWeightChange={handleWeightChange}
        />

        <BookingContentTypes
          selectedTypes={selectedTypes}
          onTypeToggle={handleTypeToggle}
          contentTypes={contentTypes}
        />

        <BookingSpecialItems
          selectedItems={selectedItems}
          onItemToggle={handleItemToggle}
          specialItems={specialItems}
          itemQuantities={itemQuantities}
          onQuantityChange={handleQuantityChange}
        />

        <BookingFormFields form={form} />

        <BookingPhotoUpload
          photos={photos}
          onPhotoUpload={handlePhotoUpload}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Création en cours..." : "Réserver"}
        </Button>
      </form>

      <BookingErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        message={errorMessage}
      />

      <BookingConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        trackingNumber={trackingNumber}
        onConfirm={() => {
          setShowConfirmDialog(false);
          navigate('/mes-reservations');
        }}
      />
    </Form>
  );
}