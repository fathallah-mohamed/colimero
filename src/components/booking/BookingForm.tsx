import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useBookingFormState } from "./form/useBookingFormState";
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

  const {
    weight,
    setWeight,
    recipientName,
    setRecipientName,
    recipientPhone,
    setRecipientPhone,
    recipientAddress,
    setRecipientAddress,
    recipientCity,
    setRecipientCity,
    senderName,
    setSenderName,
    senderPhone,
    setSenderPhone,
    itemType,
    setItemType,
    specialItems,
    setSpecialItems,
    contentTypes,
    setContentTypes,
    photos,
    setPhotos,
    resetForm
  } = useBookingFormState();

  const { isLoading, handleSubmit, handleComplete } = useBookingSubmit(tourId);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      weight,
      pickup_city: pickupCity,
      delivery_city: recipientCity,
      recipient_name: recipientName,
      recipient_address: recipientAddress,
      recipient_phone: recipientPhone,
      sender_name: senderName,
      sender_phone: senderPhone,
      item_type: itemType,
      special_items: specialItems,
      content_types: contentTypes,
      photos
    };

    try {
      const trackingNumber = await handleSubmit(formData);
      setTrackingNumber(trackingNumber);
      setShowConfirmDialog(true);
    } catch (error: any) {
      setErrorMessage(error.message);
      setShowErrorDialog(true);
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    resetForm();
    handleComplete();
  };

  return (
    <Form onSubmit={onSubmit} className="space-y-6">
      <BookingFormFields
        weight={weight}
        setWeight={setWeight}
        recipientName={recipientName}
        setRecipientName={setRecipientName}
        recipientPhone={recipientPhone}
        setRecipientPhone={setRecipientPhone}
        recipientAddress={recipientAddress}
        setRecipientAddress={setRecipientAddress}
        recipientCity={recipientCity}
        setRecipientCity={setRecipientCity}
        senderName={senderName}
        setSenderName={setSenderName}
        senderPhone={senderPhone}
        setSenderPhone={setSenderPhone}
        itemType={itemType}
        setItemType={setItemType}
        specialItems={specialItems}
        setSpecialItems={setSpecialItems}
        contentTypes={contentTypes}
        setContentTypes={setContentTypes}
        photos={photos}
        setPhotos={setPhotos}
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
    </Form>
  );
}