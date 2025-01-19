import { useState } from "react";

export function useBookingFormState() {
  const [weight, setWeight] = useState(5);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});
  const [photos, setPhotos] = useState<string[]>([]);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formValues, setFormValues] = useState<any>(null);

  const handleWeightChange = (newWeight: number) => {
    setWeight(newWeight);
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleItemToggle = (item: string) => {
    setSelectedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
    if (!itemQuantities[item]) {
      setItemQuantities(prev => ({ ...prev, [item]: 1 }));
    }
  };

  const handleQuantityChange = (item: string, quantity: number) => {
    setItemQuantities(prev => ({ ...prev, [item]: quantity }));
  };

  const handlePhotoUpload = (photoUrl: string) => {
    setPhotos(prev => [...prev, photoUrl]);
  };

  return {
    weight,
    selectedTypes,
    selectedItems,
    itemQuantities,
    photos,
    showErrorDialog,
    errorMessage,
    formValues,
    handleWeightChange,
    handleTypeToggle,
    handleItemToggle,
    handleQuantityChange,
    handlePhotoUpload,
    setShowErrorDialog,
    setFormValues,
    setErrorMessage,
  };
}