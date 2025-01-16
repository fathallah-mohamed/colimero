import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AuthDialog({ open, onOpenChange, onSuccess }: AuthDialogProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-6">
          <LoginForm onSuccess={onSuccess} />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              navigate("/inscription");
            }}
          >
            Créer un compte client
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}