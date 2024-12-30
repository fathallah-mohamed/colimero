import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Minus, Plus, Upload } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookingFormProps {
  tourId: number;
  pickupCity: string;
  onSuccess: () => void;
  onCancel: () => void;
}

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
      return Math.min(Math.max(newWeight, 5), 30); // Min 5kg, Max 30kg
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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      // Upload photos if any
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

      const { error } = await supabase.from("bookings").insert({
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
      });

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
          <div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Capacité restante : 195 kg</span>
              <span>Total : {weight} kg</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full mt-2">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(weight / 195) * 100}%` }} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Poids (kg) - minimum 5 kg, maximum 30 kg</Label>
            <div className="flex items-center justify-between">
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={() => handleWeightChange(false)}
                disabled={weight <= 5}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-medium">{weight}</span>
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={() => handleWeightChange(true)}
                disabled={weight >= 30}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Contenu (choix multiples)</Label>
            <div className="grid grid-cols-3 gap-2">
              {contentTypes.map((type) => (
                <div
                  key={type}
                  className={`p-2 border rounded-lg cursor-pointer text-center ${
                    selectedContentTypes.includes(type)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-200"
                  }`}
                  onClick={() => handleContentTypeToggle(type)}
                >
                  <span className="text-sm">{type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Objets spéciaux (choix multiples)</Label>
            <div className="grid grid-cols-3 gap-4">
              {specialItems.map((item) => (
                <div
                  key={item.name}
                  className={`p-4 border rounded-lg cursor-pointer text-center ${
                    selectedSpecialItems.includes(item.name)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-200"
                  }`}
                  onClick={() => handleSpecialItemToggle(item.name)}
                >
                  <span className="text-sm block mb-1">{item.name}</span>
                  <span className="text-sm font-medium">{item.price}€</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Photos et Vidéos</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-6 w-6 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Ajouter des médias</span>
              </label>
            </div>
            {photos.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Upload ${index + 1}`}
                      className="h-16 w-16 object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

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