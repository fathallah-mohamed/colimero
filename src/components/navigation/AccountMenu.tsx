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
import { UserCircle2, ClipboardList, Users2, Truck, Bell } from "lucide-react";

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
              <Link to="/profil" className="flex items-center">
                <UserCircle2 className="w-4 h-4 mr-2" />
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin" className="flex items-center">
                <Users2 className="w-4 h-4 mr-2" />
                Demandes d'inscription
              </Link>
            </DropdownMenuItem>
          </>
        );
      case 'carrier':
        return (
          <>
            <DropdownMenuItem asChild>
              <Link to="/profil" className="flex items-center">
                <UserCircle2 className="w-4 h-4 mr-2" />
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/mes-tournees" className="flex items-center">
                <Truck className="w-4 h-4 mr-2" />
                Mes tournées
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/demandes-approbation" className="flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Demandes d'approbation
              </Link>
            </DropdownMenuItem>
          </>
        );
      default:
        return (
          <>
            <DropdownMenuItem asChild>
              <Link to="/profil" className="flex items-center">
                <UserCircle2 className="w-4 h-4 mr-2" />
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/mes-reservations" className="flex items-center">
                <ClipboardList className="w-4 h-4 mr-2" />
                Mes réservations
              </Link>
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