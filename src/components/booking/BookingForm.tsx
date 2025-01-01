import { Button } from "@/components/ui/button";
import { BookingWeightSelector } from "./BookingWeightSelector";
import { BookingContentTypes } from "./BookingContentTypes";
import { BookingSpecialItems } from "./BookingSpecialItems";
import { BookingPhotoUpload } from "./BookingPhotoUpload";
import { SenderInfo } from "./form/SenderInfo";
import { RecipientInfo } from "./form/RecipientInfo";
import { BookingCommitments } from "./form/BookingCommitments";
import { BookingTotalPrice } from "./form/BookingTotalPrice";
import { useConsents } from "@/hooks/useConsents";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { BookingFormProvider } from "./context/BookingFormProvider";
import { useBookingFormContext } from "./context/BookingFormContext";
import { BookingConfirmDialog } from "./form/BookingConfirmDialog";
import { SpecialItemDisplay } from "./form/SpecialItemDisplay";

const contentTypes = [
  "Vêtements", "Chaussures", "Produits alimentaires", "Electronique",
  "Livres", "Jouets", "Cosmétiques", "Médicaments", "Documents", "Accessoires"
];

const specialItems = [
  { name: "Vélo", price: 50, icon: "bike" },
  { name: "Trottinette", price: 30, icon: "scooter" },
  { name: "Ordinateur portable", price: 20, icon: "laptop" },
  { name: "Smartphone", price: 15, icon: "smartphone" },
  { name: "Télévision", price: 40, icon: "tv" },
  { name: "Colis volumineux", price: 25, icon: "package" }
];

interface BookingFormProps {
  tourId: number;
  pickupCity: string;
  destinationCountry: string;
  onSuccess: () => void;
  onCancel: () => void;
}

function BookingFormContent({ 
  pickupCity, 
  destinationCountry,
  onCancel,
  tourId 
}: Omit<BookingFormProps, 'onSuccess'>) {
  const { consentTypes, userConsents } = useConsents();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [responsibilityAccepted, setResponsibilityAccepted] = useState(false);
  const {
    isLoading,
    weight,
    selectedContentTypes,
    selectedSpecialItems,
    itemQuantities,
    photos,
    pricePerKg,
    formData,
    setState,
    handleSubmit,
  } = useBookingFormContext();

  const handleWeightChange = (increment: boolean) => {
    setState(prev => ({
      ...prev,
      weight: Math.min(Math.max(prev.weight + (increment ? 1 : -1), 5), 30)
    }));
  };

  const handleContentTypeToggle = (type: string) => {
    setState(prev => ({
      ...prev,
      selectedContentTypes: prev.selectedContentTypes.includes(type)
        ? prev.selectedContentTypes.filter(t => t !== type)
        : [...prev.selectedContentTypes, type]
    }));
  };

  const handleSpecialItemToggle = (item: string) => {
    setState(prev => {
      const newSelectedItems = prev.selectedSpecialItems.includes(item)
        ? prev.selectedSpecialItems.filter(i => i !== item)
        : [...prev.selectedSpecialItems, item];
      
      const newItemQuantities = { ...prev.itemQuantities };
      if (!prev.selectedSpecialItems.includes(item)) {
        newItemQuantities[item] = 1;
      }
      
      return {
        ...prev,
        selectedSpecialItems: newSelectedItems,
        itemQuantities: newItemQuantities
      };
    });
  };

  const handleQuantityChange = (itemName: string, increment: boolean) => {
    setState(prev => ({
      ...prev,
      itemQuantities: {
        ...prev.itemQuantities,
        [itemName]: Math.max(1, (prev.itemQuantities[itemName] || 1) + (increment ? 1 : -1))
      }
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setState(prev => ({
        ...prev,
        photos: [...prev.photos, ...Array.from(e.target.files!)]
      }));
    }
  };

  const handleFormDataChange = (newData: Partial<typeof formData>) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...newData }
    }));
  };

  const areConsentsValid = () => {
    if (!consentTypes || !userConsents) return false;
    return consentTypes
      .filter(type => type.required)
      .every(type => 
        userConsents.some(
          consent => 
            consent.consent_type_id === type.id && 
            consent.accepted
        )
      );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const handleConfirmBooking = async () => {
    if (responsibilityAccepted) {
      setShowConfirmDialog(false);
      const bookingData = {
        tour_id: tourId,
        pickup_city: pickupCity,
        delivery_city: formData.deliveryCity,
        weight,
        item_type: selectedContentTypes.join(', '),
        recipient_name: formData.recipientName,
        recipient_address: formData.recipientAddress,
        recipient_phone: formData.recipientPhone,
        sender_name: formData.senderName,
        sender_phone: formData.senderPhone,
        special_items: selectedSpecialItems,
        content_types: selectedContentTypes,
        photos: photos.map(file => URL.createObjectURL(file)),
        terms_accepted: true,
        customs_declaration: true
      };
      await handleSubmit(bookingData);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Détails du colis</h2>
        <p className="text-sm text-gray-500">
          Remplissez les informations de votre colis
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="flex flex-col h-full">
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Prix au kilo: {pricePerKg}€</p>
            </div>

            <BookingWeightSelector 
              weight={weight}
              onWeightChange={handleWeightChange}
            />

            <BookingContentTypes
              selectedTypes={selectedContentTypes}
              onTypeToggle={handleContentTypeToggle}
              contentTypes={contentTypes}
            />

            <BookingSpecialItems
              selectedItems={selectedSpecialItems}
              onItemToggle={handleSpecialItemToggle}
              specialItems={specialItems}
              itemQuantities={itemQuantities}
              onQuantityChange={handleQuantityChange}
            />

            <div className="flex flex-wrap gap-2">
              {selectedSpecialItems.map(itemName => (
                <SpecialItemDisplay
                  key={itemName}
                  item={{ name: itemName, quantity: itemQuantities[itemName] || 1 }}
                />
              ))}
            </div>

            <BookingPhotoUpload
              photos={photos}
              onPhotoUpload={handlePhotoUpload}
            />

            <SenderInfo 
              formData={formData}
              setFormData={handleFormDataChange}
            />

            <RecipientInfo 
              formData={formData}
              setFormData={handleFormDataChange}
              destinationCountry={destinationCountry}
            />

            <BookingCommitments />
          </div>
        </ScrollArea>

        <div className="p-6 border-t mt-auto">
          <BookingTotalPrice
            weight={weight}
            pricePerKg={pricePerKg}
            selectedSpecialItems={selectedSpecialItems}
            itemQuantities={itemQuantities}
            specialItems={specialItems}
            isLoading={isLoading}
            disabled={!areConsentsValid()}
          />
        </div>
      </form>

      <BookingConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        responsibilityAccepted={responsibilityAccepted}
        onResponsibilityChange={setResponsibilityAccepted}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
}

export function BookingForm(props: BookingFormProps) {
  const { tourId, onSuccess } = props;
  return (
    <BookingFormProvider tourId={tourId} onSuccess={onSuccess}>
      <BookingFormContent {...props} />
    </BookingFormProvider>
  );
}
