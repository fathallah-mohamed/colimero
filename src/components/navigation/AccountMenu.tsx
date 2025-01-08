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
import { UserCircle2 } from "lucide-react";

interface AccountMenuProps {
  user: any;
  userType: string | null;
  onLogout: () => void;
}

export function AccountMenu({ user, userType, onLogout }: AccountMenuProps) {
  const getMenuLabel = () => {
    switch (userType) {
      case 'admin':
        return "Administration";
      case 'carrier':
        return "Mon compte transporteur";
      default:
        return "Mon compte client";
    }
  };

  const getMenuItems = () => {
    switch (userType) {
      case 'admin':
        return (
          <>
            <DropdownMenuItem asChild>
              <Link to="/profil" className="w-full">Profil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin" className="w-full">Demandes d'inscription</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/clients" className="w-full">Clients</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/gestion" className="w-full">Administrateurs</Link>
            </DropdownMenuItem>
          </>
        );
      case 'carrier':
        return (
          <>
            <DropdownMenuItem asChild>
              <Link to="/profil" className="w-full">Profil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/mes-tournees" className="w-full">Mes tournées</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/demandes-approbation" className="w-full">Demandes d'approbation</Link>
            </DropdownMenuItem>
          </>
        );
      default:
        return (
          <>
            <DropdownMenuItem asChild>
              <Link to="/profil" className="w-full">Profil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/mes-reservations" className="w-full">Mes réservations</Link>
            </DropdownMenuItem>
          </>
        );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="border-2 border-[#00B0F0] text-[#00B0F0] hover:bg-[#00B0F0] hover:text-white transition-colors duration-200"
        >
          <UserCircle2 className="w-4 h-4 mr-1.5" />
          {getMenuLabel()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{getMenuLabel()}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {getMenuItems()}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-red-600">
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}