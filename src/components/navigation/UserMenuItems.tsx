import { Link } from "react-router-dom";
import { UserCog } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface UserMenuItemsProps {
  userType: string | null;
}

export function UserMenuItems({ userType }: UserMenuItemsProps) {
  return (
    <>
      {userType === "admin" && (
        <>
          <DropdownMenuItem asChild>
            <Link to="/admin" className="flex items-center">
              <UserCog className="w-4 h-4 mr-2" />
              Administrateurs
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </>
      )}
      <DropdownMenuItem asChild>
        <Link to="/profile">Mon profil</Link>
      </DropdownMenuItem>
    </>
  );
}