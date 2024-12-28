import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Search, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TransporteurStats } from "@/components/transporteur/TransporteurStats";
import { TransporteurList } from "@/components/transporteur/TransporteurList";

export default function Transporteurs() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 py-24">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute inset-0 opacity-10"
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            }}
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Nos Transporteurs de Confiance
          </h1>
          <p className="text-xl text-gray-100 mb-8">
            Découvrez les professionnels qui rendent vos expéditions simples et sécurisées. 
            Chaque transporteur est soigneusement sélectionné pour garantir une expérience de qualité.
          </p>
        </div>
      </div>

      {/* Global Presentation */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <p className="text-xl text-gray-700 mb-12">
            Chez Colimero, nous collaborons avec des transporteurs expérimentés qui assurent 
            vos livraisons en toute sécurité entre la France, la Tunisie, et au-delà.
          </p>
          
          <TransporteurStats />
        </div>

        {/* Carriers List */}
        <TransporteurList />

        {/* Final CTA */}
        <div className="mt-24 text-center">
          <p className="text-xl text-gray-700 mb-8">
            Besoin d'un transporteur pour vos expéditions ? 
            Explorez notre réseau et réservez en quelques clics !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Search className="mr-2 h-5 w-5" />
              Trouver un transporteur
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Link to="/planifier">
                <TrendingUp className="mr-2 h-5 w-5" />
                Devenir transporteur
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}