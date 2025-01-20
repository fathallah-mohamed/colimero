import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, BookingFormData } from "./form/schema";
import { useBookingSubmit } from "./form/useBookingSubmit";
import { useState } from "react";
import { StepIndicator } from "./form/steps/StepIndicator";
import { SenderStep } from "./form/steps/SenderStep";
import { RecipientStep } from "./form/steps/RecipientStep";
import { PackageStep } from "./form/steps/PackageStep";
import { ConfirmationStep } from "./form/steps/ConfirmationStep";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface BookingFormProps {
  tourId: number;
  pickupCity: string;
  onSuccess?: () => void;
}

export function BookingForm({ tourId, pickupCity, onSuccess }: BookingFormProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [weight, setWeight] = useState(5);
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [specialItems, setSpecialItems] = useState<string[]>([]);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});
  const [photos, setPhotos] = useState<File[]>([]);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sender_name: "",
      sender_phone: "",
      recipient_name: "",
      recipient_phone: "",
      recipient_address: "",
      item_type: "",
      package_description: "",
    },
  });

  const { isLoading, handleSubmit } = useBookingSubmit(tourId);

  const onSubmit = async (values: BookingFormData) => {
    try {
      const formData = {
        ...values,
        weight,
        pickup_city: pickupCity,
        special_items: specialItems,
        content_types: contentTypes,
        photos
      };

      await handleSubmit(formData);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/mes-reservations');
      }
    } catch (error: any) {
      console.error("Error submitting booking:", error);
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

  const validateStep = async () => {
    const fields = {
      1: ["sender_name", "sender_phone"],
      2: ["recipient_name", "recipient_phone", "recipient_address"],
      3: ["item_type"]
    };

    if (currentStep < 4) {
      const currentFields = fields[currentStep as keyof typeof fields];
      const result = await form.trigger(currentFields as any);
      
      if (result) {
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps(prev => [...prev, currentStep]);
        }
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <SenderStep form={form} />;
      case 2:
        return <RecipientStep form={form} />;
      case 3:
        return (
          <PackageStep
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
        );
      case 4:
        return (
          <ConfirmationStep
            form={form}
            onEdit={setCurrentStep}
            weight={weight}
            specialItems={specialItems}
            itemQuantities={itemQuantities}
            pricePerKg={10}
          />
        );
      default:
        return null;
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

        {renderStep()}

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Button>

          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={validateStep}
              className="flex items-center gap-2"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? "Création..." : "Créer la réservation"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}