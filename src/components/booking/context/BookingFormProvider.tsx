import { ReactNode, useState, useEffect } from 'react';
import { BookingFormContext } from './BookingFormContext';
import { BookingFormState, BookingFormData } from '@/types/booking';
import { useBookingForm } from '@/hooks/useBookingForm';
import { supabase } from '@/integrations/supabase/client';

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
    sender_name: '',
    sender_phone: '',
    recipient_name: '',
    recipient_phone: '',
    recipient_address: '',
    delivery_city: '',
  },
};

export function BookingFormProvider({ children, tourId, onSuccess }: BookingFormProviderProps) {
  const [state, setState] = useState<BookingFormState>(initialState);
  const [pricePerKg] = useState(10);
  const { createBooking, isLoading } = useBookingForm(tourId, onSuccess);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: clientData } = await supabase
          .from('clients')
          .select('first_name, last_name, phone')
          .eq('id', user.id)
          .maybeSingle();

        if (clientData) {
          setState(prev => ({
            ...prev,
            formData: {
              ...prev.formData,
              sender_name: `${clientData.first_name} ${clientData.last_name}`.trim(),
              sender_phone: clientData.phone || '',
            }
          }));
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (values: BookingFormData) => {
    try {
      await createBooking(values);
      onSuccess();
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
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