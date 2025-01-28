import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import MenuItems from "./MenuItems";
import { Button } from "../ui/button";
import { UserCircle2 } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  user: any;
  userType: string | null;
  handleLogout: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export default function MobileMenu({
  isOpen,
  user,
  userType,
  handleLogout,
  setIsOpen,
}: MobileMenuProps) {
  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 w-[80%] bg-white border-l shadow-lg h-[calc(100vh-65px)] top-[65px] overflow-y-auto",
        "transform transition-transform duration-300 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex flex-col space-y-4 p-4">
        <MenuItems />
        
        {!user && (
          <Link to="/connexion" className="mt-4">
            <Button
              variant="outline"
              size="lg"
              className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <UserCircle2 className="w-5 h-5 mr-2" />
              Se connecter
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}