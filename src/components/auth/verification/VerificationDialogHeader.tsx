import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail } from "lucide-react";

export function VerificationDialogHeader() {
  return (
    <DialogHeader>
      <div className="mx-auto mb-4 bg-blue-50 p-3 rounded-full">
        <Mail className="h-6 w-6 text-blue-500" />
      </div>
      <DialogTitle className="text-center text-xl">
        Activation de votre compte
      </DialogTitle>
    </DialogHeader>
  );
}