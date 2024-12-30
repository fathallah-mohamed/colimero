import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookingWeightSelector } from "./BookingWeightSelector";
import { BookingContentTypes } from "./BookingContentTypes";
import { BookingSpecialItems } from "./BookingSpecialItems";
import { BookingPhotoUpload } from "./BookingPhotoUpload";
import type { BookingFormData } from "@/types/booking";

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
  onSuccess: () => void;
  onCancel: () => void;
}

export function BookingForm({ tourId, pickupCity, onSuccess, onCancel }: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [weight, setWeight] = useState(5);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [selectedSpecialItems, setSelectedSpecialItems] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    senderName: "",
    senderPhone: "",
    recipientName: "",
    recipientPhone: "",
    recipientAddress: "",
  });

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
    setSelectedSpecialItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhotos(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const calculateTotalPrice = () => {
    const specialItemsTotal = selectedSpecialItems.reduce((total, item) => {
      const itemPrice = specialItems.find(i => i.name === item)?.price || 0;
      return total + itemPrice;
    }, 0);
    return specialItemsTotal;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const uploadedPhotos = [];
      for (const photo of photos) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('bookings')
          .upload(`${user.id}/${fileName}`, photo);
        
        if (!uploadError) {
          uploadedPhotos.push(fileName);
        }
      }

      const bookingData: BookingFormData = {
        tour_id: tourId,
        user_id: user.id,
        pickup_city: pickupCity,
        weight: weight,
        content_types: selectedContentTypes,
        special_items: selectedSpecialItems,
        photos: uploadedPhotos,
        sender_name: formData.senderName,
        sender_phone: formData.senderPhone,
        recipient_name: formData.recipientName,
        recipient_phone: formData.recipientPhone,
        recipient_address: formData.recipientAddress,
        status: "pending",
        tracking_number: `COL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        item_type: selectedContentTypes[0] || "general"
      };

      const { error } = await supabase.from("bookings").insert(bookingData);

      if (error) throw error;

      toast({
        title: "Réservation effectuée",
        description: "Votre réservation a été enregistrée avec succès",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center">Détails du colis</h2>
        <p className="text-sm text-gray-500 text-center">Remplissez les informations de votre colis</p>

        <div className="space-y-4">
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
          />

          <BookingPhotoUpload
            photos={photos}
            onPhotoUpload={handlePhotoUpload}
          />

          <div className="space-y-4">
            <h3 className="font-medium">Informations de l'expéditeur</h3>
            <div>
              <Label>Nom et prénom</Label>
              <Input
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Votre numéro de téléphone</Label>
              <div className="flex gap-2">
                <Select defaultValue="FR">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Pays" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FR">France (+33)</SelectItem>
                    <SelectItem value="TN">Tunisie (+216)</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="tel"
                  value={formData.senderPhone}
                  onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })}
                  required
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Informations du destinataire</h3>
            <div>
              <Label>Nom et prénom</Label>
              <Input
                placeholder="Entrez le nom et prénom du destinataire"
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Numéro de téléphone du destinataire</Label>
              <div className="flex gap-2">
                <Select defaultValue="FR">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Pays" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FR">France (+33)</SelectItem>
                    <SelectItem value="TN">Tunisie (+216)</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="tel"
                  placeholder="Numéro de téléphone"
                  value={formData.recipientPhone}
                  onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                  required
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label>Adresse de réception</Label>
              <Textarea
                placeholder="Adresse complète du destinataire"
                value={formData.recipientAddress}
                onChange={(e) => setFormData({ ...formData, recipientAddress: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Point de récupération du colis</Label>
              <Select value={pickupCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez un point de récupération" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={pickupCity}>{pickupCity}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-400 hover:bg-blue-500"
        disabled={isLoading}
      >
        Confirmer la réservation ({calculateTotalPrice()}.00€)
      </Button>
    </form>
  );
}