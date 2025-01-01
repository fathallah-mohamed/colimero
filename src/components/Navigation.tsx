import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MenuItems } from "./navigation/MenuItems.tsx";
import AuthDialog from "@/components/auth/AuthDialog";
import { LogIn } from "lucide-react";

export default function Navigation() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const menuItems = [
    { name: "Planifier une tournée", href: "/planifier-une-tournee", highlight: true },
    { name: "Envoyer un colis", href: "/envoyer-un-colis", highlight: true },
    { name: "Transporteurs", href: "/nos-transporteurs" },
    { name: "Actualités", href: "/actualites" },
    { name: "À propos", href: "/a-propos" },
    { name: "Contact", href: "/nous-contacter" },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-lg font-bold">Logo</h1>
            <div className="hidden md:flex space-x-8">
              <MenuItems items={menuItems} />
            </div>
          </div>

          <div className="flex items-center">
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-gray-900"
              onClick={() => setShowAuthDialog(true)}
            >
              <LogIn className="h-5 w-5 mr-2" />
              Se connecter
            </Button>
          </div>
        </div>
      </div>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />
    </nav>
  );
}