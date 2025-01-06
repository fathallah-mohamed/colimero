import { Link } from "react-router-dom";
import { UserCog, Mail, Users, LogOut } from "lucide-react";

interface UserMenuItemsProps {
  userType: string | null;
}

export function UserMenuItems({ userType }: UserMenuItemsProps) {
  if (userType === "admin") {
    return (
      <div className="flex items-center space-x-4">
        <Link
          to="/profil"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <UserCog className="w-4 h-4 mr-2" />
          Profil
        </Link>
        <Link
          to="/admin"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <Users className="w-4 h-4 mr-2" />
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
          <Users className="w-4 h-4 mr-2" />
          Administrateurs
        </Link>
      </div>
    );
  }

  if (userType === "carrier") {
    return (
      <div className="flex items-center space-x-4">
        <Link
          to="/mes-tournees"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <UserCog className="w-4 h-4 mr-2" />
          Mes tournées
        </Link>
        <Link
          to="/demandes-approbation"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <Mail className="w-4 h-4 mr-2" />
          Demandes d'approbation
        </Link>
      </div>
    );
  }

  if (userType === "client") {
    return (
      <div className="flex items-center space-x-4">
        <Link
          to="/mes-reservations"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <UserCog className="w-4 h-4 mr-2" />
          Mes réservations
        </Link>
        <Link
          to="/mes-demandes-approbation"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <Mail className="w-4 h-4 mr-2" />
          Mes demandes
        </Link>
      </div>
    );
  }

  return null;
}