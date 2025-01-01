import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface AccountMenuProps {
  user: User;
  userType: string | null;
  onLogout: () => void;
}

export default function AccountMenu({ user, userType, onLogout }: AccountMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <UserIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer">
            Mon profil
          </Link>
        </DropdownMenuItem>
        {userType === 'carrier' && (
          <DropdownMenuItem asChild>
            <Link to="/mes-tournees" className="cursor-pointer">
              Mes tournées
            </Link>
          </DropdownMenuItem>
        )}
        {userType === 'client' && (
          <DropdownMenuItem asChild>
            <Link to="/mes-reservations" className="cursor-pointer">
              Mes réservations
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onLogout} className="text-red-600">
          <LogOut className="h-4 w-4 mr-2" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}