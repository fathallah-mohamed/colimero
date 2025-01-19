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
import { BookingErrorDialog } from "./form/BookingErrorDialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { BookingFormFields } from "./form/BookingFormFields";
import { formSchema } from "./form/schema";
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
  const [userData, setUserData] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createBooking, isLoading } = useBookingForm(tourId, onSuccess);
  const [weight, setWeight] = useState(5);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});
  const [photos, setPhotos] = useState<File[]>([]);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: clientData, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          if (error) {
            console.error('Erreur lors de la récupération des données client:', error);
            return;
          }
          
          if (clientData) {
            setUserData(clientData);
            form.setValue('sender_name', `${clientData.first_name} ${clientData.last_name}`.trim());
            form.setValue('sender_phone', clientData.phone || '');
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
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

      const { success, error } = await createBooking(formData);
      
      if (success) {
        toast({
          title: "Réservation créée avec succès",
          description: "Votre demande de réservation a été envoyée. Vous serez notifié de son statut.",
          variant: "default",
        });
        form.reset();
        navigate('/mes-reservations');
      } else {
        if (error?.message?.includes('duplicate key value')) {
          setErrorMessage("Vous avez déjà une réservation pour cette tournée");
        } else {
          setErrorMessage(error?.message || "Une erreur est survenue lors de la création de la réservation");
        }
        setShowErrorDialog(true);
      }
    } catch (error: any) {
      console.error("Erreur lors de la création de la réservation:", error);
      setErrorMessage(error?.message || "Une erreur est survenue lors de la création de la réservation");
      setShowErrorDialog(true);
    }
  };

  const handleWeightChange = (increment: boolean) => {
    setWeight(prev => {
      const newWeight = increment ? prev + 1 : prev - 1;
      return Math.min(Math.max(newWeight, 5), 30);
    });
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleItemToggle = (itemName: string) => {
    setSelectedItems(prev =>
      prev.includes(itemName) ? prev.filter(i => i !== itemName) : [...prev, itemName]
    );
    if (!itemQuantities[itemName]) {
      setItemQuantities(prev => ({ ...prev, [itemName]: 1 }));
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

      <BookingErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        message={errorMessage}
      />
    </Form>
  );
}