import { useState } from "react";

export function useBookingFormState() {
  const [weight, setWeight] = useState(5);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});
  const [photos, setPhotos] = useState<File[]>([]); // Using standard File type
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formValues, setFormValues] = useState<any>(null);
  const [responsibilityAccepted, setResponsibilityAccepted] = useState(false);

  const handleWeightChange = (increment: boolean) => {
    setWeight((prev) => {
      if (increment && prev < 30) return prev + 1;
      if (!increment && prev > 5) return prev - 1;
      return prev;
    });
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleItemToggle = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleQuantityChange = (itemName: string, increment: boolean) => {
    setItemQuantities((prev) => ({
      ...prev,
      [itemName]: Math.max(1, (prev[itemName] || 1) + (increment ? 1 : -1)),
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos((prev) => [...prev, ...newPhotos]);
    }
  };

  return {
    weight,
    selectedTypes,
    selectedItems,
    itemQuantities,
    photos,
    showConfirmDialog,
    showErrorDialog,
    errorMessage,
    formValues,
    responsibilityAccepted,
    setWeight,
    setSelectedTypes,
    setSelectedItems,
    setItemQuantities,
    setPhotos,
    setShowConfirmDialog,
    setShowErrorDialog,
    setErrorMessage,
    setFormValues,
    setResponsibilityAccepted,
    handleWeightChange,
    handleTypeToggle,
    handleItemToggle,
    handleQuantityChange,
    handlePhotoUpload,
  };
}