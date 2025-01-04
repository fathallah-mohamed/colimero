import { Link } from "react-router-dom";
import { useNavigation } from "./useNavigation";

export default function MenuItems() {
  const { userType } = useNavigation();

  return (
    <div className="hidden md:flex items-center space-x-4">
      <Link
        to="/transporteurs"
        className="text-gray-700 hover:text-gray-900 transition-colors"
      >
        Transporteurs
      </Link>
      <Link
        to="/tours"
        className="text-gray-700 hover:text-gray-900 transition-colors"
      >
        Tournées
      </Link>
      {userType === 'client' && (
        <>
          <Link
            to="/mes-reservations"
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            Mes réservations
          </Link>
          <Link
            to="/mes-demandes-approbation"
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            Mes demandes d'approbation
          </Link>
        </>
      )}
    </div>
  );
}