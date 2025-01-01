import { createContext, useContext } from 'react';
import { BookingFormState } from '@/types/booking';

interface BookingFormContextType extends BookingFormState {
  setState: React.Dispatch<React.SetStateAction<BookingFormState>>;
  pricePerKg: number;
  isLoading: boolean;
}

export const BookingFormContext = createContext<BookingFormContextType | undefined>(undefined);

export function useBookingFormContext() {
  const context = useContext(BookingFormContext);
  if (!context) {
    throw new Error('useBookingFormContext must be used within a BookingFormProvider');
  }
  return context;
}