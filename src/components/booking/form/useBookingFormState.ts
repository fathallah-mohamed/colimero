import { useState } from "react";

export function useBookingFormState() {
  const [weight, setWeight] = useState(5);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});
  const [photos, setPhotos] = useState<File[]>([]);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  return {
    weight,
    selectedTypes,
    selectedItems,
    itemQuantities,
    photos,
    showErrorDialog,
    showConfirmDialog,
    trackingNumber,
    errorMessage,
    setShowErrorDialog,
    setShowConfirmDialog,
    setTrackingNumber,
    setErrorMessage,
    handleWeightChange,
    handleTypeToggle,
    handleItemToggle,
    handleQuantityChange,
    handlePhotoUpload
  };
}