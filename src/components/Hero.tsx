import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="relative bg-primary py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Livraison France-Maghreb simplifiée
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Service de livraison fiable et rapide entre la France et le Maghreb. Expédiez vos colis en toute sécurité.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button variant="secondary" size="lg">
              Expédier un colis
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
              Nos tarifs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}