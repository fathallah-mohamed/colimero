import { useState } from "react";
import { useNavigation } from "@/components/navigation/useNavigation";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth/AuthDialog";
import AccountMenu from "@/components/AccountMenu";
import MobileMenu from "@/components/MobileMenu";
import { LogIn } from "lucide-react";

export default function Navigation() {
  const {
    isOpen,
    setIsOpen,
    user,
    userType,
    handleLogout,
    menuItems,
  } = useNavigation();

  const [showAuthDialog, setShowAuthDialog] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-lg font-bold">Logo</h1>
          </div>

          <div className="flex items-center">
            {user ? (
              <AccountMenu user={user} userType={userType} onLogout={handleLogout} />
            ) : (
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setShowAuthDialog(true)}
              >
                <LogIn className="h-5 w-5 mr-2" />
                Se connecter
              </Button>
            )}
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        menuItems={menuItems}
        user={user}
        userType={userType}
        onLogout={handleLogout}
      />

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />
    </nav>
  );
}