import { Button } from "@/components/ui/button";
import { Package, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-400 py-24 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          Simplifiez vos expéditions entre la France et le Maghreb !
        </h1>
        <p className="text-xl mb-12 text-gray-100">
          Trouvez les meilleures tournées pour vos colis ou devenez transporteur
          <br />
          et optimisez vos trajets.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600">
            <Link to="/envoyer">
              <Package className="mr-2 h-5 w-5" />
              Envoyer un colis
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/planifier">
              <Search className="mr-2 h-5 w-5" />
              Planifier une tournée
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}