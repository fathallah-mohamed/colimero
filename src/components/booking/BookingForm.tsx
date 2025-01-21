import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, BookingFormData } from "./form/schema";
import { useState } from "react";
import { StepIndicator } from "./form/steps/StepIndicator";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useBookingCreation } from "@/hooks/useBookingCreation";
import { useBookingValidation } from "@/hooks/useBookingValidation";
import { useBookingFormState } from "@/hooks/useBookingFormState";
import { BookingFormSteps } from "./form/BookingFormSteps";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface BookingFormProps {
  tourId: number;
  pickupCity: string;
  onSuccess?: () => void;
}

export function BookingForm({ tourId, pickupCity, onSuccess }: BookingFormProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { createBooking, isLoading } = useBookingCreation(tourId, onSuccess);
  const { uploadPhotos, isUploading } = usePhotoUpload();
  
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

  const form = useForm<BookingFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sender_name: "",
      sender_phone: "",
      recipient_name: "",
      recipient_phone: "",
      recipient_address: "",
      recipient_city: "",
      item_type: "",
      package_description: "",
      pickup_city: pickupCity,
      delivery_city: "",
      weight: 5,
      special_items: [],
      content_types: [],
      photos: []
    } satisfies Partial<BookingFormData> as BookingFormData
  });

  // Fetch and set user data when component mounts
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
        // If no session, redirect to login
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

  const { validateStep } = useBookingValidation(form);

  const onSubmit = async (values: BookingFormData) => {
    try {
      const photoUrls = await uploadPhotos(photos);
      
      const formattedSpecialItems = specialItems.map(item => ({
        name: item,
        quantity: itemQuantities[item] || 1
      }));

      const bookingData = {
        ...values,
        weight,
        special_items: formattedSpecialItems,
        content_types: contentTypes,
        photos: photoUrls
      };

      await createBooking(bookingData);
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

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 || isLoading || isUploading}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Button>

          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={handleNextStep}
              disabled={isLoading || isUploading}
              className="flex items-center gap-2"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isLoading || isUploading}
              className="flex items-center gap-2"
            >
              {isLoading || isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer la réservation"
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}