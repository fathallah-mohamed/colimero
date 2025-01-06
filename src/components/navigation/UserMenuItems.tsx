import { Link } from "react-router-dom";
import { UserCog, Package, CalendarDays, ClipboardCheck } from "lucide-react";

interface UserMenuItemsProps {
  userType: string | null;
}

export function UserMenuItems({ userType }: UserMenuItemsProps) {
  if (userType === "admin") {
    return (
      <div className="flex items-center space-x-4">
        <Link
          to="/admin/dashboard"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <UserCog className="w-4 h-4 mr-2" />
          Dashboard
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
          <CalendarDays className="w-4 h-4 mr-2" />
          Mes tournées
        </Link>
        <Link
          to="/demandes-approbation"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <ClipboardCheck className="w-4 h-4 mr-2" />
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
          <Package className="w-4 h-4 mr-2" />
          Mes réservations
        </Link>
        <Link
          to="/mes-demandes-approbation"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <ClipboardCheck className="w-4 h-4 mr-2" />
          Mes demandes
        </Link>
      </div>
    );
  }

  return null;
}