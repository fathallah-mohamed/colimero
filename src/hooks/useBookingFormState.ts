import { useState } from "react";
import { BookingFormData } from "@/components/booking/form/schema";

export function useBookingFormState() {
  const [weight, setWeight] = useState(5);
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [specialItems, setSpecialItems] = useState<string[]>([]);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});
  const [photos, setPhotos] = useState<File[]>([]);

  const handleWeightChange = (increment: boolean) => {
    setWeight(prev => {
      const newWeight = increment ? prev + 1 : prev - 1;
      return Math.min(Math.max(newWeight, 5), 30);
    });
  };

  const handleContentTypeToggle = (type: string) => {
    setContentTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSpecialItemToggle = (item: string) => {
    setSpecialItems(prev => {
      const newItems = prev.includes(item) ? 
        prev.filter(i => i !== item) : 
        [...prev, item];
      
      if (!prev.includes(item)) {
        setItemQuantities(prevQ => ({
          ...prevQ,
          [item]: 1
        }));
      }
      
      return newItems;
    });
  };

  const handleQuantityChange = (item: string, increment: boolean) => {
    setItemQuantities(prev => ({
      ...prev,
      [item]: Math.max(1, (prev[item] || 1) + (increment ? 1 : -1))
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setPhotos(prev => [...prev, ...newFiles]);
    }
  };

  return {
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
  };
}