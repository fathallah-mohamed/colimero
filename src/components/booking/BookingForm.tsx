import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useBookingCreation } from "@/hooks/useBookingCreation";
import { useBookingValidation } from "@/hooks/useBookingValidation";
import { useBookingFormState } from "@/hooks/useBookingFormState";
import { BookingFormSteps } from "./form/BookingFormSteps";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";
import { StepIndicator } from "./form/steps/StepIndicator";
import { BookingFormActions } from "./form/BookingFormActions";
import { useBookingForm } from "./form/useBookingForm";
import { BookingFormData } from "./form/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

export interface BookingFormProps {
  tourId: number;
  pickupCity: string;
  onSuccess?: () => void;
}

export function BookingForm({ tourId, pickupCity, onSuccess }: BookingFormProps) {
  const { createBooking, isLoading } = useBookingCreation(tourId, onSuccess);
  const { uploadPhotos, isUploading } = usePhotoUpload();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  
  const {
    weight,
    contentTypes,
    specialItems,
    itemQuantities,
    photos,
    handleWeightChange,
    handleContentTypeToggle,
    handleSpecialItemToggle,
    handleQuantityChange,
    handlePhotoUpload
  } = useBookingFormState();

  const {
    form,
    currentStep,
    setCurrentStep,
    completedSteps,
    setCompletedSteps
  } = useBookingForm(tourId, pickupCity);

  const { validateStep } = useBookingValidation(form);

  const onSubmit = async (values: BookingFormData) => {
    try {
      console.log("Starting form submission with values:", values);
      
      const photoUrls = await uploadPhotos(photos);
      console.log("Photos uploaded:", photoUrls);
      
      const formattedSpecialItems = specialItems.map(item => ({
        name: item,
        quantity: itemQuantities[item] || 1
      }));
      console.log("Formatted special items:", formattedSpecialItems);

      const bookingData = {
        ...values,
        weight,
        pickup_city: pickupCity,
        special_items: formattedSpecialItems,
        content_types: contentTypes,
        photos: photoUrls,
        terms_accepted: true,
        customs_declaration: true
      };

      console.log("Submitting booking data:", bookingData);

      const result = await createBooking(bookingData);
      console.log("Booking creation result:", result);

      if (result?.tracking_number) {
        setTrackingNumber(result.tracking_number);
        setShowConfirmation(true);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la réservation.",
      });
    }
  };

  const handleNextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={4}
          completedSteps={completedSteps}
        />

        {(isLoading || isUploading) ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <BookingFormSteps
            currentStep={currentStep}
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
            onEdit={setCurrentStep}
          />
        )}

        <BookingFormActions
          currentStep={currentStep}
          isLoading={isLoading}
          isUploading={isUploading}
          onPrevious={handlePrevious}
          onNext={handleNextStep}
        />

        <Dialog open={showConfirmation} onOpenChange={handleCloseConfirmation}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Réservation confirmée
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                Votre réservation a été confirmée avec succès. Voici votre numéro de suivi :
              </p>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-mono text-lg font-bold">{trackingNumber}</p>
              </div>
              <Button onClick={handleCloseConfirmation} className="w-full">
                Compris
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}