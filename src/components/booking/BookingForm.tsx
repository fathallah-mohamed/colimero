import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { BookingContentTypes } from "./BookingContentTypes";
import { BookingWeightSelector } from "./BookingWeightSelector";
import { BookingPhotoUpload } from "./BookingPhotoUpload";
import { BookingSpecialItems } from "./BookingSpecialItems";
import { useBookingForm } from "@/hooks/useBookingForm";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BookingConfirmDialog } from "./form/BookingConfirmDialog";
import { BookingErrorDialog } from "./form/BookingErrorDialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { BookingFormFields } from "./form/BookingFormFields";
import { formSchema } from "./form/schema";
import { useBookingFormState } from "./form/useBookingFormState";

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
  const [userData, setUserData] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createBooking, isLoading } = useBookingForm(tourId, onSuccess);
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

  const {
    weight,
    selectedTypes,
    selectedItems,
    itemQuantities,
    photos,
    showConfirmDialog,
    showErrorDialog,
    errorMessage,
    formValues,
    responsibilityAccepted,
    setShowConfirmDialog,
    setShowErrorDialog,
    setFormValues,
    setResponsibilityAccepted,
    handleWeightChange,
    handleTypeToggle,
    handleItemToggle,
    handleQuantityChange,
    handlePhotoUpload,
  } = useBookingFormState();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: clientData } = await supabase
          .from('clients')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (clientData) {
          setUserData(clientData);
          form.setValue('sender_name', `${clientData.first_name} ${clientData.last_name}`.trim());
          form.setValue('sender_phone', clientData.phone || '');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
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
      photos: photos,
      special_items: formattedSpecialItems,
    };

    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('id')
      .eq('user_id', userData?.id)
      .eq('tour_id', tourId)
      .maybeSingle();

    if (existingBooking) {
      setErrorMessage("Vous avez déjà une réservation pour cette tournée");
      setShowErrorDialog(true);
      return;
    }

    setFormValues(formData);
    setShowConfirmDialog(true);
  };

  const handleConfirmBooking = async () => {
    if (!formValues) return;

    const { success } = await createBooking(formValues);
    if (success) {
      toast({
        title: "Réservation envoyée",
        description: "Votre demande de réservation a été envoyée avec succès. Le transporteur l'examinera et vous serez notifié de sa décision.",
      });
      form.reset();
      setShowConfirmDialog(false);
      setResponsibilityAccepted(false);
      navigate('/mes-reservations');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
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

      <BookingConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        responsibilityAccepted={responsibilityAccepted}
        onResponsibilityChange={setResponsibilityAccepted}
        onConfirm={handleConfirmBooking}
      />

      <BookingErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        message={errorMessage}
      />
    </Form>
  );
}