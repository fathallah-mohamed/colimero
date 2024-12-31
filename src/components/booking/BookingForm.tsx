import { Button } from "@/components/ui/button";
import { BookingWeightSelector } from "./BookingWeightSelector";
import { BookingContentTypes } from "./BookingContentTypes";
import { BookingSpecialItems } from "./BookingSpecialItems";
import { BookingPhotoUpload } from "./BookingPhotoUpload";
import { SenderInfo } from "./form/SenderInfo";
import { RecipientInfo } from "./form/RecipientInfo";
import { BookingCommitments } from "./form/BookingCommitments";
import { BookingTotalPrice } from "./form/BookingTotalPrice";
import { useBookingForm } from "@/hooks/useBookingForm";
import { useConsents } from "@/hooks/useConsents";
import { ScrollArea } from "@/components/ui/scroll-area";

const contentTypes = [
  "Vêtements",
  "Chaussures",
  "Produits alimentaires",
  "Electronique",
  "Livres",
  "Jouets",
  "Cosmétiques",
  "Médicaments",
  "Documents",
  "Accessoires"
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

export function BookingForm({ 
  tourId, 
  pickupCity, 
  destinationCountry,
  onSuccess, 
  onCancel 
}: BookingFormProps) {
  const { consentTypes, userConsents } = useConsents();
  const {
    isLoading,
    weight,
    setWeight,
    selectedContentTypes,
    setSelectedContentTypes,
    selectedSpecialItems,
    setSelectedSpecialItems,
    itemQuantities,
    setItemQuantities,
    photos,
    setPhotos,
    pricePerKg,
    formData,
    setFormData,
    hasExistingBooking,
    handleSubmit,
  } = useBookingForm(tourId, onSuccess);

  const handleWeightChange = (increment: boolean) => {
    setWeight(prev => {
      const newWeight = increment ? prev + 1 : prev - 1;
      return Math.min(Math.max(newWeight, 5), 30);
    });
  };

  const handleContentTypeToggle = (type: string) => {
    setSelectedContentTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSpecialItemToggle = (item: string) => {
    setSelectedSpecialItems(prev => {
      const newItems = prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item];
      
      if (!prev.includes(item)) {
        setItemQuantities(prev => ({
          ...prev,
          [item]: 1
        }));
      }
      
      return newItems;
    });
  };

  const handleQuantityChange = (itemName: string, increment: boolean) => {
    setItemQuantities(prev => ({
      ...prev,
      [itemName]: Math.max(1, (prev[itemName] || 1) + (increment ? 1 : -1))
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhotos(prev => [...prev, ...Array.from(e.target.files!)]);
    }
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

  if (hasExistingBooking) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-red-600 font-medium">
          Vous avez déjà une réservation pour cette tournée
        </p>
        <Button onClick={onCancel} variant="outline">
          Retour
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <ScrollArea className="h-[80vh] pr-4">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Détails du colis</h2>
            <p className="text-sm text-gray-500 text-center">
              Remplissez les informations de votre colis
            </p>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
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

              <BookingPhotoUpload
                photos={photos}
                onPhotoUpload={handlePhotoUpload}
              />

              <SenderInfo 
                formData={formData}
                setFormData={setFormData}
              />

              <RecipientInfo 
                formData={formData}
                setFormData={setFormData}
                destinationCountry={destinationCountry}
              />

              <BookingCommitments />
            </div>
          </div>

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
      </ScrollArea>
    </form>
  );
}
