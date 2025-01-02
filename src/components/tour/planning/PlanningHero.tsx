import { Button } from "@/components/ui/button";

interface PlanningHeroProps {
  onCreateTourClick: () => void;
}

export function PlanningHero({ onCreateTourClick }: PlanningHeroProps) {
  return (
    <div className="text-center space-y-6 py-12 mt-8">
      <h1 className="text-4xl font-bold">Planifiez une tournée en un clic !</h1>
      <Button
        onClick={onCreateTourClick}
        size="lg"
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg font-semibold text-lg transform transition hover:scale-105"
      >
        Créer une tournée
      </Button>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Optimisez vos trajets et vos revenus !</h2>
        <p className="text-gray-600 text-lg">
          Avec Colimero, planifiez vos tournées facilement et connectez-vous à un réseau d'expéditeurs fiables. 
          Gagnez du temps, réduisez vos trajets à vide, et augmentez vos bénéfices en remplissant vos véhicules dès aujourd'hui.
        </p>
      </div>
    </div>
  );
}