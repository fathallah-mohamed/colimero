import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserMenuItems } from "./UserMenuItems";

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
      <DropdownMenuContent align="end" className="w-56">
        <UserMenuItems userType={userType} />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}