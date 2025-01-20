import Navigation from "@/components/Navigation";
import { TransporteurList } from "@/components/transporteur/TransporteurList";

export default function Transporteurs() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Des transporteurs de confiance pour vos envois
          </h1>
          <div className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-100 space-y-4">
            <p>
              Chez Colimero, nous comprenons l'importance de confier vos colis à des professionnels fiables. 
              C'est pourquoi nous sélectionnons rigoureusement nos transporteurs partenaires selon des critères stricts 
              de qualité, de fiabilité et d'expérience.
            </p>
            <p>
              Chaque transporteur de notre réseau s'engage à assurer un service de qualité, avec une 
              responsabilité totale sur les colis qui leur sont confiés. De la collecte à la livraison, 
              vos biens sont entre des mains expertes.
            </p>
            <p>
              Notre processus de sélection rigoureux et notre suivi continu des performances garantissent 
              que seuls les transporteurs les plus professionnels et les plus fiables rejoignent notre plateforme.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-8">Nos transporteurs</h2>
        <TransporteurList />
      </div>
    </div>
  );
}