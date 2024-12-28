import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface EmailVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (email: string) => void;
}

export function EmailVerificationDialog({
  isOpen,
  onClose,
  onVerify,
}: EmailVerificationDialogProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(email);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Vérification de l'email
          </DialogTitle>
          <p className="text-lg text-gray-600">
            Entrez votre email pour commencer.
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              className="bg-[#00B0F0] hover:bg-[#0082b3] text-white"
            >
              Vérifier
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}