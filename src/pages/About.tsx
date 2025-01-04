import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            À propos de Colimero
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Colimero est une plateforme innovante qui connecte les expéditeurs aux transporteurs
            pour simplifier l'envoi de colis entre la France et le Maghreb.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Notre Mission</h2>
            <p className="text-gray-600 mb-4">
              Faciliter les échanges entre la France et le Maghreb en proposant une solution
              de transport fiable, transparente et économique.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Service client dédié</li>
              <li>Transporteurs vérifiés</li>
              <li>Prix compétitifs</li>
              <li>Suivi en temps réel</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nos Valeurs</h2>
            <p className="text-gray-600 mb-4">
              Nous nous engageons à fournir un service de qualité basé sur :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>La transparence</li>
              <li>La fiabilité</li>
              <li>L'innovation</li>
              <li>Le respect des engagements</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link to="/contact">Contactez-nous</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}