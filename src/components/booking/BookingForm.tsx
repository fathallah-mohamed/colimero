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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { BookingFormProvider } from "./context/BookingFormProvider";
import { useBookingFormContext } from "./context/BookingFormContext";

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

function BookingFormContent({ 
  pickupCity, 
  destinationCountry,
  onCancel 
}: Omit<BookingFormProps, 'tourId' | 'onSuccess'>) {
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

            <BookingPhotoUpload
              photos={photos}
              onPhotoUpload={handlePhotoUpload}
            />

            <SenderInfo 
              formData={formData}
              setFormData={(newData) => setState(prev => ({ ...prev, formData: newData }))}
            />

            <RecipientInfo 
              formData={formData}
              setFormData={(newData) => setState(prev => ({ ...prev, formData: newData }))}
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

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation de réservation</DialogTitle>
            <DialogDescription>
              Veuillez lire attentivement et accepter les conditions suivantes avant de confirmer votre réservation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="responsibility"
                  checked={responsibilityAccepted}
                  onCheckedChange={(checked) => setResponsibilityAccepted(checked as boolean)}
                />
                <Label htmlFor="responsibility" className="text-sm leading-relaxed">
                  Je reconnais que Colimero ne peut être tenu responsable du contenu de mon colis ni des éventuelles infractions liées à son transport. Toute responsabilité repose sur moi en tant qu'expéditeur.
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleConfirmBooking}
              disabled={!responsibilityAccepted}
            >
              Confirmer la réservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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