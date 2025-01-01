import { createContext, useContext } from 'react';
import { BookingFormState, BookingFormData } from '@/types/booking';

interface BookingFormContextType extends BookingFormState {
  setState: React.Dispatch<React.SetStateAction<BookingFormState>>;
  pricePerKg: number;
  isLoading: boolean;
  handleSubmit: (values: BookingFormData) => Promise<void>;
}

export const BookingFormContext = createContext<BookingFormContextType | undefined>(undefined);

export function useBookingFormContext() {
  const context = useContext(BookingFormContext);
  if (!context) {
    throw new Error('useBookingFormContext must be used within a BookingFormProvider');
  }
  return context;
}