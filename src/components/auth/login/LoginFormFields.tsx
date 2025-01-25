import { Input } from "@/components/ui/input";
import { EmailVerificationDialog } from "@/components/auth/EmailVerificationDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormFieldsProps {
  form: UseFormReturn<LoginFormValues>;
  isLoading: boolean;
  error: string | null;
  showVerificationDialog: boolean;
  showErrorDialog: boolean;
  onVerificationDialogClose: () => void;
  onErrorDialogClose: () => void;
}

export function LoginFormFields({
  form,
  isLoading,
  error,
  showVerificationDialog,
  showErrorDialog,
  onVerificationDialogClose,
  onErrorDialogClose,
}: LoginFormFieldsProps) {
  const email = form.watch("email");

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="votre@email.com"
                disabled={isLoading}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mot de passe</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="••••••••"
                disabled={isLoading}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <EmailVerificationDialog
        isOpen={showVerificationDialog}
        onClose={onVerificationDialogClose}
        email={email}
        onResendEmail={() => {
          console.log("Resending verification email to:", email);
        }}
      />

      <Dialog open={showErrorDialog} onOpenChange={onErrorDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-50 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">
              Erreur de connexion
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              {error}
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={onErrorDialogClose} 
                className="bg-[#00B0F0] hover:bg-[#0082b3] text-white"
              >
                Fermer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}