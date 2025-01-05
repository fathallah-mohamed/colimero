import { Button } from "@/components/ui/button";
import { PlanningAdvantages } from "./PlanningAdvantages";
import { PlanningBenefits } from "./PlanningBenefits";
import { PlanningExample } from "./PlanningExample";
import { PlanningHero } from "./PlanningHero";
import { PlanningSteps } from "./PlanningSteps";

interface PlanningContentProps {
  isAuthenticated: boolean;
  onCreateTourClick: () => void;
  onAuthClick: () => void;
}

export function PlanningContent({ 
  isAuthenticated, 
  onCreateTourClick, 
  onAuthClick 
}: PlanningContentProps) {
  return (
    <>
      <PlanningHero onCreateTourClick={onCreateTourClick} />
      <PlanningAdvantages />
      <PlanningSteps />
      <PlanningExample />
      <PlanningBenefits />
      
      <div className="text-center py-16">
        <p className="text-xl text-gray-600 mb-8">
          Prêt à commencer ? Cliquez sur le bouton ci-dessous :
        </p>
        <div className="space-y-4">
          <Button
            onClick={onCreateTourClick}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg font-semibold text-lg transform transition hover:scale-105"
          >
            Créer une tournée
          </Button>
          {!isAuthenticated && (
            <Button
              onClick={onAuthClick}
              variant="outline"
              size="lg"
              className="w-full max-w-md"
            >
              Devenir transporteur
            </Button>
          )}
        </div>
        {!isAuthenticated && (
          <p className="text-sm text-gray-500 mt-4">
            Vous devez être connecté pour planifier une tournée
          </p>
        )}
      </div>
    </>
  );
}