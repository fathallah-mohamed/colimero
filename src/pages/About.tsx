import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">À propos de nous</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-4">
            Nous sommes une plateforme de mise en relation entre transporteurs et expéditeurs,
            spécialisée dans les liaisons entre la France et le Maghreb.
          </p>
          <p className="text-lg mb-4">
            Notre mission est de simplifier et sécuriser le transport de colis en offrant
            une solution complète et transparente.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}