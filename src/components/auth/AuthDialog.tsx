import { LoginFormContainer } from "./login/LoginFormContainer";
import { CustomDialog } from "../ui/custom-dialog";
import { UserType } from "@/types/auth";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onRegisterClick?: () => void;
  onCarrierRegisterClick?: () => void;
  requiredUserType?: UserType;
}

export default function AuthDialog({
  isOpen,
  onClose,
  onSuccess,
  onRegisterClick,
  onCarrierRegisterClick,
  requiredUserType,
}: AuthDialogProps) {
  return (
    <CustomDialog 
      open={isOpen} 
      onClose={onClose}
      title="Connexion"
      className="sm:max-w-[500px]"
    >
      <div className="p-6">
        <LoginFormContainer
          onRegister={onRegisterClick}
          onCarrierRegister={onCarrierRegisterClick}
          onSuccess={onSuccess}
          requiredUserType={requiredUserType}
        />
      </div>
    </CustomDialog>
  );
}