import { useState } from 'react';
import { LoginState } from '@/types/auth';

const initialState: LoginState = {
  isLoading: false,
  error: null,
  showVerificationDialog: false,
  showErrorDialog: false,
  showActivationDialog: false,
};

export const useLoginState = () => {
  const [state, setState] = useState<LoginState>(initialState);

  const resetState = () => {
    setState(prev => ({
      ...prev,
      error: null,
      showVerificationDialog: false,
      showErrorDialog: false,
      showActivationDialog: false,
    }));
  };

  const setLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ 
      ...prev, 
      error,
      showErrorDialog: !state.showVerificationDialog && !state.showActivationDialog
    }));
  };

  const setDialogState = (dialog: keyof Omit<LoginState, 'isLoading' | 'error'>, show: boolean) => {
    setState(prev => ({ ...prev, [dialog]: show }));
  };

  return {
    state,
    resetState,
    setLoading,
    setError,
    setDialogState,
  };
};