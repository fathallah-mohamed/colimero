import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, BookingFormData } from "./form/schema";
import { useState, useEffect } from "react";
import { StepIndicator } from "./form/steps/StepIndicator";
import { SenderStep } from "./form/steps/SenderStep";
import { RecipientStep } from "./form/steps/RecipientStep";
import { PackageStep } from "./form/steps/PackageStep";
import { ConfirmationStep } from "./form/steps/ConfirmationStep";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useBookingCreation } from "@/hooks/useBookingCreation";
import { useFormValidation } from "./form/useFormValidation";
import { useBookingFormState } from "@/hooks/useBookingFormState";

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
    }
  });

  const { validateStep } = useFormValidation(form);

  useEffect(() => {
    const fetchClientProfile = async () => {
      try {
        console.log('Checking authentication status...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error('Session error or no session:', sessionError);
          navigate('/connexion');
          return;
        }

        console.log('Fetching client data...');
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('first_name, last_name, phone')
          .eq('id', session.user.id)
          .single();

        if (clientError) {
          console.error('Error fetching client profile:', clientError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer votre profil.",
          });
          return;
        }

        if (clientData) {
          console.log('Client data found:', clientData);
          const fullName = `${clientData.first_name || ''} ${clientData.last_name || ''}`.trim();
          form.setValue('sender_name', fullName);
          form.setValue('sender_phone', clientData.phone || '');
        }
      } catch (error) {
        console.error('Error in fetchClientProfile:', error);
      }
    };

    fetchClientProfile();
  }, [form, navigate]);

  const onSubmit = async (values: BookingFormData) => {
    try {
      const formattedSpecialItems = specialItems.map(item => ({
        name: item,
        quantity: itemQuantities[item] || 1
      }));

      const bookingData = {
        ...values,
        weight,
        special_items: formattedSpecialItems,
        content_types: contentTypes,
        photos
      };

      await createBooking(bookingData);
    } catch (error) {
      console.error("Error in form submission:", error);
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

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          renderStep()
        )}

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 || isLoading}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Button>

          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={handleNextStep}
              disabled={isLoading}
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
              {isLoading ? (
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