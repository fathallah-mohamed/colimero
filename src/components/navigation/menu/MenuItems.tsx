import { Link } from "react-router-dom";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { 
  UserCircle2, 
  Package, 
  ClipboardList, 
  UserCog,
  Users
} from "lucide-react";

export function getMenuItems(userType: string | null) {
  if (userType === 'admin') {
    return (
      <>
        <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
          <Link to="/profile">
            <UserCircle2 className="w-4 h-4" />
            <span>Profil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
          <Link to="/admin/dashboard">
            <ClipboardList className="w-4 h-4" />
            <span>Demandes d'inscription</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
          <Link to="/admin/clients">
            <Users className="w-4 h-4" />
            <span>Clients</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
          <Link to="/admin/gestion">
            <UserCog className="w-4 h-4" />
            <span>Administrateurs</span>
          </Link>
        </DropdownMenuItem>
      </>
    );
  }

  if (userType === 'carrier') {
    return (
      <>
        <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
          <Link to="/profile">
            <UserCircle2 className="w-4 h-4" />
            <span>Profil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
          <Link to="/mes-tournees">
            <Package className="w-4 h-4" />
            <span>Mes tournées</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
          <Link to="/demandes-approbation">
            <ClipboardList className="w-4 h-4" />
            <span>Demandes d'approbation</span>
          </Link>
        </DropdownMenuItem>
      </>
    );
  }

  if (userType === 'client') {
    return (
      <>
        <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
          <Link to="/profile">
            <UserCircle2 className="w-4 h-4" />
            <span>Profil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
          <Link to="/mes-reservations">
            <Package className="w-4 h-4" />
            <span>Mes réservations</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
          <Link to="/mes-demandes-approbation">
            <ClipboardList className="w-4 h-4" />
            <span>Mes demandes</span>
          </Link>
        </DropdownMenuItem>
      </>
    );
  }

  return null;
}