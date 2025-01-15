import { useState } from "react";

interface ModalDialogState {
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
}

export function useModalDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogState, setDialogState] = useState<ModalDialogState>({
    title: "",
    description: "",
    variant: "default"
  });

  const showDialog = ({ title, description, variant = "default" }: ModalDialogState) => {
    setDialogState({ title, description, variant });
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    dialogState,
    showDialog,
    closeDialog
  };
}