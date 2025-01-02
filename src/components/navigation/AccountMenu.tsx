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
import { UserCircle2 } from "lucide-react";

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
          className="border-2 border-[#00B0F0] text-[#00B0F0] hover:bg-[#00B0F0] hover:text-white transition-colors duration-200"
          onClick={() => setShowAuthDialog(true)}
        >
          <UserCircle2 className="w-4 h-4 mr-1.5" />
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
          className="border-2 border-[#00B0F0] text-[#00B0F0] hover:bg-[#00B0F0] hover:text-white transition-colors duration-200"
        >
          <UserCircle2 className="w-4 h-4 mr-1.5" />
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