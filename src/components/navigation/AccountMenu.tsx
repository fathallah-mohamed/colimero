import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import AuthDialog from "../auth/AuthDialog";
import { cn } from "@/lib/utils";

interface AccountMenuProps {
  user: User | null;
  userType: string | null;
  onLogout: () => void;
}

export function AccountMenu({ user, userType, onLogout }: AccountMenuProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  if (!user) {
    return (
      <>
        <Button 
          variant="outline"
          size="sm"
          className={cn(
            "font-medium border-gray-200 transition-all duration-300",
            "hover:bg-primary hover:text-white hover:border-transparent",
            "hover:shadow-md hover:shadow-primary/20",
            "active:scale-[0.98]"
          )}
          onClick={() => setShowAuthDialog(true)}
        >
          Se connecter
        </Button>

        <AuthDialog 
          isOpen={showAuthDialog} 
          onClose={() => setShowAuthDialog(false)} 
        />
      </>
    );
  }

  const isCarrier = userType === 'carrier';
  const menuLabel = isCarrier ? "Mon compte transporteur" : "Mon compte";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={cn(
            "font-medium border-gray-200 transition-all duration-300",
            "hover:bg-primary hover:text-white hover:border-transparent",
            "hover:shadow-md hover:shadow-primary/20",
            "active:scale-[0.98]"
          )}
        >
          Mon compte
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profil">Profil</Link>
        </DropdownMenuItem>
        {isCarrier ? (
          <>
            <DropdownMenuItem asChild>
              <Link to="/mes-tournees">Mes tournées</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/demandes-approbation">Demandes d'approbation</Link>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link to="/mes-reservations">Mes réservations</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/demandes-approbation">Mes demandes d'approbation</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}