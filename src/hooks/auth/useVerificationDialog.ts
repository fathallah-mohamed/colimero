import { useState } from "react";

export function useVerificationDialog() {
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const handleVerificationNeeded = () => {
    setShowVerificationDialog(true);
    setShowErrorDialog(false);
  };

  const handleVerificationSuccess = () => {
    setShowVerificationDialog(false);
    setShowErrorDialog(false);
  };

  const handleVerificationError = () => {
    setShowVerificationDialog(false);
    setShowErrorDialog(true);
  };

  return {
    showVerificationDialog,
    showErrorDialog,
    setShowVerificationDialog,
    setShowErrorDialog,
    handleVerificationNeeded,
    handleVerificationSuccess,
    handleVerificationError
  };
}