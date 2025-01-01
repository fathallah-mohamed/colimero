import { ReactNode, useState } from 'react';
import { BookingFormContext } from './BookingFormContext';
import { BookingFormState, BookingFormData } from '@/types/booking';
import { useBookingForm } from '@/hooks/useBookingForm';

interface BookingFormProviderProps {
  children: ReactNode;
  tourId: number;
  onSuccess: () => void;
}

const initialState: BookingFormState = {
  weight: 5,
  selectedContentTypes: [],
  selectedSpecialItems: [],
  itemQuantities: {},
  photos: [],
  formData: {
    senderName: '',
    senderPhone: '',
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    deliveryCity: '',
  },
};

export function BookingFormProvider({ children, tourId, onSuccess }: BookingFormProviderProps) {
  const [state, setState] = useState<BookingFormState>(initialState);
  const [pricePerKg] = useState(10);
  const { createBooking, isLoading } = useBookingForm(tourId, onSuccess);

  const handleSubmit = async (values: BookingFormData) => {
    await createBooking(values);
  };

  return (
    <BookingFormContext.Provider 
      value={{
        ...state,
        setState,
        pricePerKg,
        isLoading,
        handleSubmit,
      }}
    >
      {children}
    </BookingFormContext.Provider>
  );
}