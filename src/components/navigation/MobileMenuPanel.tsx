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
          "fixed inset-0 w-full md:hidden z-[999]",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div 
          className={cn(
            "absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
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