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

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: clientData } = await supabase
          .from('clients')
          .select('first_name, last_name, phone')
          .eq('id', user.id)
          .single();

        if (clientData) {
          setState(prev => ({
            ...prev,
            formData: {
              ...prev.formData,
              senderName: `${clientData.first_name} ${clientData.last_name}`.trim(),
              senderPhone: clientData.phone || '',
            }
          }));
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (values: BookingFormData) => {
    const result = await createBooking(values);
    if (result.success) {
      // Update tour remaining capacity
      const { error: updateError } = await supabase
        .from('tours')
        .update({
          remaining_capacity: supabase.sql`remaining_capacity - ${values.weight}`
        })
        .eq('id', tourId);

      if (updateError) {
        console.error('Error updating tour capacity:', updateError);
      }
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