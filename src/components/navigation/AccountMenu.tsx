import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@supabase/supabase-js";

interface AccountMenuProps {
  user: User | null;
  userType: string | null;
  onLogout: () => void;
}

export default function AccountMenu({ user, userType, onLogout }: AccountMenuProps) {
  if (!user) {
    return (
      <Button asChild variant="outline" className="ml-4">
        <Link to="/connexion">Se connecter</Link>
      </Button>
    );
  }

  const isCarrier = userType === 'carrier';
  const menuLabel = isCarrier ? "Mon compte transporteur" : "Mon compte";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Mon compte</Button>
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