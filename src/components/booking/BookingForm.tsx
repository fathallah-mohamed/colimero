import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./form/schema";
import { useBookingSubmit } from "./form/useBookingSubmit";
import { BookingFormFields } from "./form/BookingFormFields";
import { BookingConfirmDialog } from "./form/BookingConfirmDialog";
import { BookingErrorDialog } from "./form/BookingErrorDialog";
import { useState } from "react";

interface BookingFormProps {
  tourId: number;
  pickupCity: string;
}

export function BookingForm({ tourId, pickupCity }: BookingFormProps) {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  
  const [weight, setWeight] = useState(5);
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [specialItems, setSpecialItems] = useState<string[]>([]);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});
  const [photos, setPhotos] = useState<File[]>([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sender_name: "",
      sender_phone: "",
      recipient_name: "",
      recipient_phone: "",
      recipient_address: "",
      recipient_city: "",
      item_type: "",
      special_instructions: "",
    },
  });

  const { isLoading, handleSubmit } = useBookingSubmit(tourId);

  const onSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        weight,
        pickup_city: pickupCity,
        special_items: specialItems,
        content_types: contentTypes,
        photos
      };

      const trackingNumber = await handleSubmit(formData);
      setTrackingNumber(trackingNumber);
      setShowConfirmDialog(true);
    } catch (error: any) {
      setErrorMessage(error.message);
      setShowErrorDialog(true);
    }
  };

  const handleWeightChange = (increment: boolean) => {
    setWeight(prev => {
      const newWeight = increment ? prev + 1 : prev - 1;
      return Math.min(Math.max(newWeight, 5), 30);
    });
  };

  const handleContentTypeToggle = (type: string) => {
    setContentTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSpecialItemToggle = (item: string) => {
    setSpecialItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
    if (!itemQuantities[item]) {
      setItemQuantities(prev => ({ ...prev, [item]: 1 }));
    }
  };

  const handleQuantityChange = (itemName: string, increment: boolean) => {
    setItemQuantities(prev => ({
      ...prev,
      [itemName]: Math.max(1, prev[itemName] + (increment ? 1 : -1))
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setPhotos(prev => [...prev, ...newFiles]);
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    form.reset();
    setWeight(5);
    setContentTypes([]);
    setSpecialItems([]);
    setItemQuantities({});
    setPhotos([]);
    navigate('/mes-reservations');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BookingFormFields
          form={form}
          weight={weight}
          onWeightChange={handleWeightChange}
          contentTypes={contentTypes}
          onContentTypeToggle={handleContentTypeToggle}
          specialItems={specialItems}
          onSpecialItemToggle={handleSpecialItemToggle}
          itemQuantities={itemQuantities}
          onQuantityChange={handleQuantityChange}
          photos={photos}
          onPhotoUpload={handlePhotoUpload}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Création..." : "Créer la réservation"}
          </Button>
        </div>

        <BookingConfirmDialog
          open={showConfirmDialog}
          onClose={handleConfirmClose}
          trackingNumber={trackingNumber}
        />

        <BookingErrorDialog
          open={showErrorDialog}
          onClose={() => setShowErrorDialog(false)}
          errorMessage={errorMessage}
        />
      </form>
    </Form>
  );
}