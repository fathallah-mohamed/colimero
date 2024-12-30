import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox"; // Add this import
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

const destinationCities = {
  TN: [
    { name: "Tunis", location: "15 Avenue Habib Bourguiba, Tunis", hours: "9h00 - 18h00" },
    { name: "Sfax", location: "Route de l'Aéroport Km 0.5, Sfax", hours: "8h00 - 17h00" },
    { name: "Sousse", location: "Avenue 14 Janvier, Sousse", hours: "9h00 - 17h00" }
  ],
  MA: [
    { name: "Casablanca", location: "Boulevard Mohammed V, Casablanca", hours: "9h00 - 18h00" },
    { name: "Rabat", location: "Avenue Mohammed V, Rabat", hours: "8h00 - 17h00" },
    { name: "Marrakech", location: "Avenue Mohammed VI, Marrakech", hours: "9h00 - 17h00" }
  ],
  DZ: [
    { name: "Alger", location: "Rue Didouche Mourad, Alger", hours: "9h00 - 18h00" },
    { name: "Oran", location: "Boulevard de l'ALN, Oran", hours: "8h00 - 17h00" },
    { name: "Constantine", location: "Avenue de l'Indépendance, Constantine", hours: "9h00 - 17h00" }
  ]
};

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [weight, setWeight] = useState(5);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [selectedSpecialItems, setSelectedSpecialItems] = useState<string[]>([]);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});
  const [photos, setPhotos] = useState<File[]>([]);
  const [pricePerKg, setPricePerKg] = useState<number>(0);
  const [customsDeclaration, setCustomsDeclaration] = useState(false);
  const [formData, setFormData] = useState({
    senderName: "",
    senderPhone: "",
    recipientName: "",
    recipientPhone: "",
    recipientAddress: "",
    deliveryCity: ""
  });

  useEffect(() => {
    const fetchCarrierPrice = async () => {
      try {
        const { data: tourData, error: tourError } = await supabase
          .from('tours')
          .select('carrier_id')
          .eq('id', tourId)
          .single();

        if (tourError) throw tourError;

        const { data: capacityData, error: capacityError } = await supabase
          .from('carrier_capacities')
          .select('price_per_kg')
          .eq('carrier_id', tourData.carrier_id)
          .single();

        if (capacityError) throw capacityError;

        setPricePerKg(capacityData.price_per_kg);
      } catch (error) {
        console.error('Error fetching carrier price:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer le prix du transporteur",
        });
      }
    };

    fetchCarrierPrice();
  }, [tourId, toast]);

  // Nouveau useEffect pour récupérer les informations du client
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('first_name, last_name, phone')
          .eq('id', user.id)
          .single();

        if (clientError) throw clientError;

        if (clientData) {
          const fullName = `${clientData.first_name || ''} ${clientData.last_name || ''}`.trim();
          setFormData(prev => ({
            ...prev,
            senderName: fullName,
            senderPhone: clientData.phone || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

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

  const calculateTotalPrice = () => {
    const weightPrice = weight * pricePerKg;
    const specialItemsPrice = selectedSpecialItems.reduce((total, item) => {
      const itemPrice = specialItems.find(i => i.name === item)?.price || 0;
      const quantity = itemQuantities[item] || 1;
      return total + (itemPrice * quantity);
    }, 0);

    return weightPrice + specialItemsPrice;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customsDeclaration) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez accepter la déclaration douanière",
      });
      return;
    }

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

      const specialItemsWithQuantities = selectedSpecialItems.map(item => ({
        name: item,
        quantity: itemQuantities[item] || 1
      }));

      const bookingData: BookingFormData = {
        tour_id: tourId,
        user_id: user.id,
        pickup_city: pickupCity,
        weight: weight,
        content_types: selectedContentTypes,
        special_items: specialItemsWithQuantities,
        photos: uploadedPhotos,
        sender_name: formData.senderName,
        sender_phone: formData.senderPhone,
        recipient_name: formData.recipientName,
        recipient_phone: formData.recipientPhone,
        recipient_address: formData.recipientAddress,
        delivery_city: formData.deliveryCity,
        status: "pending",
        tracking_number: `COL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        item_type: selectedContentTypes[0] || "general",
        customs_declaration: customsDeclaration
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

          <div className="space-y-4">
            <h3 className="font-medium">Informations de l'expéditeur</h3>
            <div>
              <Label>Nom et prénom</Label>
              <Input
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                required
                readOnly
                className="bg-gray-50"
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
                  readOnly
                  className="flex-1 bg-gray-50"
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
                <Select defaultValue="TN">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Pays" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TN">Tunisie (+216)</SelectItem>
                    <SelectItem value="MA">Maroc (+212)</SelectItem>
                    <SelectItem value="DZ">Algérie (+213)</SelectItem>
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
              <Label>Ville de livraison</Label>
              <Select 
                value={formData.deliveryCity}
                onValueChange={(value) => setFormData({ ...formData, deliveryCity: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez une ville de livraison" />
                </SelectTrigger>
                <SelectContent>
                  {destinationCities[destinationCountry as keyof typeof destinationCities]?.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      <div className="space-y-1">
                        <div className="font-medium">{city.name}</div>
                        <div className="text-sm text-gray-500">{city.location}</div>
                        <div className="text-sm text-gray-500">Horaires : {city.hours}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Adresse complète</Label>
              <Textarea
                placeholder="Adresse complète du destinataire"
                value={formData.recipientAddress}
                onChange={(e) => setFormData({ ...formData, recipientAddress: e.target.value })}
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="customs-declaration"
            checked={customsDeclaration}
            onCheckedChange={(checked) => setCustomsDeclaration(checked as boolean)}
            className="mt-1"
          />
          <Label
            htmlFor="customs-declaration"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Je déclare que le contenu de mon colis ne contient aucun objet interdit par la loi ou les règlements douaniers.
          </Label>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-400 hover:bg-blue-500"
        disabled={isLoading || !customsDeclaration}
      >
        Confirmer la réservation ({calculateTotalPrice().toFixed(2)}€)
      </Button>
    </form>
  );
}
