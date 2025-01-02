import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Info, Users, Building, Globe } from "lucide-react";

export default function APropos() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-8">
            <Info className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">À propos de Colimero</h1>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              Colimero est votre partenaire de confiance pour l'envoi de colis entre la France et le Maghreb.
              Notre mission est de simplifier et sécuriser vos envois internationaux.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 my-12">
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Notre Équipe</h3>
                <p className="text-gray-600">Une équipe expérimentée dédiée à votre satisfaction</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
                <Building className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Notre Histoire</h3>
                <p className="text-gray-600">Plus de 10 ans d'expérience dans le transport international</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
                <Globe className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Notre Réseau</h3>
                <p className="text-gray-600">Un réseau étendu couvrant la France et le Maghreb</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Nos Valeurs</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Fiabilité et ponctualité dans nos services</li>
              <li>Transparence dans nos prix et nos processus</li>
              <li>Sécurité maximale pour vos colis</li>
              <li>Service client réactif et professionnel</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}