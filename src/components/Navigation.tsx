import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Accueil", href: "/" },
    { name: "Planifier une tournée", href: "/planifier", highlight: true },
    { name: "Envoyer un colis", href: "/envoyer", highlight: true },
    { name: "Transporteurs", href: "/transporteurs" },
    { name: "Blog", href: "/blog" },
    { name: "À propos", href: "/a-propos" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-[#00B0F0]">
            Colimero
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-base ${
                  item.highlight
                    ? "text-[#00B0F0] font-medium"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button asChild variant="outline" className="ml-4">
              <Link to="/login">Se connecter</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden absolute top-16 inset-x-0 bg-white shadow-lg z-50`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                item.highlight
                  ? "text-[#00B0F0]"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="mt-4 px-3">
            <Button asChild variant="outline" className="w-full">
              <Link to="/login">Se connecter</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}