import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";
import { forwardRef } from "react";

interface MobileMenuPanelProps {
  isOpen: boolean;
  user: any;
  userType: string | null;
  handleLogout: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setShowAuthDialog: (show: boolean) => void;
}

export const MobileMenuPanel = forwardRef<HTMLDivElement, MobileMenuPanelProps>(
  ({ isOpen, user, userType, handleLogout, setIsOpen, setShowAuthDialog }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          "fixed inset-y-0 right-0 w-full max-w-sm transform transition-all duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0 z-50" : "translate-x-full -z-10"
        )}
      >
        <div className="h-full bg-white shadow-xl">
          <MobileMenu
            isOpen={isOpen}
            user={user}
            userType={userType}
            handleLogout={handleLogout}
            setIsOpen={setIsOpen}
            setShowAuthDialog={setShowAuthDialog}
          />
        </div>
      </div>
    );
  }
);

MobileMenuPanel.displayName = "MobileMenuPanel";