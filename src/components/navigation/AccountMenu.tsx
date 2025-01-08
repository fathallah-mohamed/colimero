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
import { UserCircle2, ClipboardList, Truck, Bell, LogOut } from "lucide-react";

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
          className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
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

  const getUserDisplayName = () => {
    const firstName = user?.user_metadata?.first_name || '';
    const lastName = user?.user_metadata?.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Mon compte';
  };

  const getMenuItems = () => {
    const commonItems = (
      <>
        <DropdownMenuItem asChild>
          <Link to="/profil" className="flex items-center gap-2">
            <UserCircle2 className="w-4 h-4" />
            Profil
          </Link>
        </DropdownMenuItem>
      </>
    );

    switch (userType) {
      case 'carrier':
        return (
          <>
            {commonItems}
            <DropdownMenuItem asChild>
              <Link to="/mes-tournees" className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Mes tournées
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/demandes-approbation" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Demandes d'approbation
              </Link>
            </DropdownMenuItem>
          </>
        );
      case 'admin':
        return (
          <>
            {commonItems}
            <DropdownMenuItem asChild>
              <Link to="/admin" className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                Tableau de bord
              </Link>
            </DropdownMenuItem>
          </>
        );
      default:
        return (
          <>
            {commonItems}
            <DropdownMenuItem asChild>
              <Link to="/mes-reservations" className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
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
          className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <UserCircle2 className="w-4 h-4 mr-1.5" />
          {getUserDisplayName()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {getMenuItems()}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}