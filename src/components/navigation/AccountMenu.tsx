import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export interface AccountMenuProps {
  user: User;
  userType: string | null;
  handleLogout: () => void;
}

export default function AccountMenu({ user, userType, handleLogout }: AccountMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {user.user_metadata.first_name || user.email}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to="/profile" className="w-full cursor-pointer">
            Mon profil
          </Link>
        </DropdownMenuItem>
        {userType === 'carrier' && (
          <DropdownMenuItem asChild>
            <Link to="/mes-tournees" className="w-full cursor-pointer">
              Mes tournées
            </Link>
          </DropdownMenuItem>
        )}
        {userType === 'client' && (
          <DropdownMenuItem asChild>
            <Link to="/mes-reservations" className="w-full cursor-pointer">
              Mes réservations
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}