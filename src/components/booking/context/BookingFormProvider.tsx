import { ReactNode } from 'react';
import { BookingFormContext } from './BookingFormContext';
import { useBookingForm } from '@/hooks/useBookingForm';

interface BookingFormProviderProps {
  children: ReactNode;
  tourId: number;
  onSuccess: () => void;
}

export function BookingFormProvider({ children, tourId, onSuccess }: BookingFormProviderProps) {
  const bookingForm = useBookingForm(tourId, onSuccess);

  return (
    <BookingFormContext.Provider value={bookingForm}>
      {children}
    </BookingFormContext.Provider>
  );
}