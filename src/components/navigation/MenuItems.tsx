import { Link } from "react-router-dom";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { 
  UserCircle2, 
  Package, 
  ClipboardList, 
  UserCog,
  Users,
  FileText
} from "lucide-react";

export default function MenuItems() {
  return (
    <div className="flex flex-col space-y-1">
      <Link
        to="/"
        className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
      >
        Accueil
      </Link>
      <Link
        to="/envoyer-colis"
        className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
      >
        Envoyer un colis
      </Link>
      <Link
        to="/transporteurs"
        className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
      >
        Transporteurs
      </Link>
      <Link
        to="/contact"
        className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
      >
        Contact
      </Link>
    </div>
  );
}