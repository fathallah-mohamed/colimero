import { Button } from "@/components/ui/button";
import { Package2, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-400 py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Simplifiez vos expéditions entre la France et le Maghreb !
        </h1>
        <p className="text-lg text-gray-100 mb-8">
          Trouvez les meilleures tournées pour vos colis ou devenez transporteur
          <br />
          et optimisez vos trajets.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-50 hover:scale-[1.02] transform transition-all duration-200 shadow-md"
          >
            <Link 
              to="/envoyer-un-colis" 
              className="flex items-center gap-3 px-6 py-3"
            >
              <Package2 className="h-5 w-5" />
              Je veux envoyer un colis
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-transparent text-white border-2 border-white hover:bg-white/10 hover:scale-[1.02] transform transition-all duration-200 shadow-md"
          >
            <Link 
              to="/planifier-une-tournee" 
              className="flex items-center gap-3 px-6 py-3"
            >
              <Search className="h-5 w-5" />
              Je suis transporteur
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}