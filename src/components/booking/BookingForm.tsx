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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [responsibilityAccepted, setResponsibilityAccepted] = useState(false);
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
    handleSubmit: submitBooking,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (responsibilityAccepted) {
      setShowConfirmDialog(false);
      await submitBooking(e);
    }
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
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Détails du colis</h2>
        <p className="text-sm text-gray-500">
          Remplissez les informations de votre colis
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col h-full">
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
              setFormData={setFormData}
            />

            <RecipientInfo 
              formData={formData}
              setFormData={setFormData}
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
                  Je comprends et j'accepte que la plateforme agit uniquement en tant qu'intermédiaire et n'est pas responsable 
                  de la livraison, des dommages, pertes ou retards qui pourraient survenir pendant le transport. La responsabilité 
                  du transport incombe entièrement au transporteur sélectionné.
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
