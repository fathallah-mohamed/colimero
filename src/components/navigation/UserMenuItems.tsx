import { Link } from "react-router-dom";
import { FileText, Package2, Truck, User } from "lucide-react";

interface UserMenuItemsProps {
  userType: string | null;
  onClose?: () => void;
}

export default function UserMenuItems({ userType, onClose }: UserMenuItemsProps) {
  const handleClick = () => {
    if (onClose) {
      onClose();
    }
  };

  if (userType === 'carrier') {
    return (
      <>
        <Link
          to="/profile"
          onClick={handleClick}
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <User className="w-4 h-4 mr-2" />
          Mon profil
        </Link>
        <Link
          to="/mes-tournees"
          onClick={handleClick}
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <Truck className="w-4 h-4 mr-2" />
          Mes tournées
        </Link>
        <Link
          to="/demandes-approbation"
          onClick={handleClick}
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <FileText className="w-4 h-4 mr-2" />
          Demandes d'approbation
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        to="/profile"
        onClick={handleClick}
        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        <User className="w-4 h-4 mr-2" />
        Mon profil
      </Link>
      <Link
        to="/mes-reservations"
        onClick={handleClick}
        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        <Package2 className="w-4 h-4 mr-2" />
        Mes réservations
      </Link>
      <Link
        to="/mes-demandes"
        onClick={handleClick}
        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        <FileText className="w-4 h-4 mr-2" />
        Mes demandes
      </Link>
    </>
  );
}