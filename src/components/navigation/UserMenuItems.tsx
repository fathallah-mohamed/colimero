import { Link } from "react-router-dom";
import { User, FileText, Users, UserCircle2 } from "lucide-react";

interface UserMenuItemsProps {
  userType: string | null;
}

export function UserMenuItems({ userType }: UserMenuItemsProps) {
  if (userType === "admin") {
    return (
      <div className="flex flex-col space-y-1">
        <Link
          to="/profile"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <UserCircle2 className="w-4 h-4 mr-2" />
          Profil
        </Link>
        <Link
          to="/admin/dashboard"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <FileText className="w-4 h-4 mr-2" />
          Demandes d'inscription
        </Link>
        <Link
          to="/admin/clients"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <Users className="w-4 h-4 mr-2" />
          Clients
        </Link>
        <Link
          to="/admin/gestion"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <User className="w-4 h-4 mr-2" />
          Administrateurs
        </Link>
      </div>
    );
  }

  if (userType === "carrier") {
    return (
      <div className="flex flex-col space-y-1">
        <Link
          to="/profile"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <UserCircle2 className="w-4 h-4 mr-2" />
          Profil
        </Link>
        <Link
          to="/mes-tournees"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <FileText className="w-4 h-4 mr-2" />
          Mes tournées
        </Link>
        <Link
          to="/demandes-approbation"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <FileText className="w-4 h-4 mr-2" />
          Demandes d'approbation
        </Link>
      </div>
    );
  }

  if (userType === "client") {
    return (
      <div className="flex flex-col space-y-1">
        <Link
          to="/profile"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <UserCircle2 className="w-4 h-4 mr-2" />
          Profil
        </Link>
        <Link
          to="/mes-reservations"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <FileText className="w-4 h-4 mr-2" />
          Mes réservations
        </Link>
        <Link
          to="/mes-demandes-approbation"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <FileText className="w-4 h-4 mr-2" />
          Mes demandes
        </Link>
      </div>
    );
  }

  return null;
}