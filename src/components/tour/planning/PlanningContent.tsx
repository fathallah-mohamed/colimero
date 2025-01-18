import { Button } from "@/components/ui/button";
import { PlanningAdvantages } from "./PlanningAdvantages";
import { PlanningBenefits } from "./PlanningBenefits";
import { PlanningExample } from "./PlanningExample";
import { PlanningHero } from "./PlanningHero";
import { PlanningSteps } from "./PlanningSteps";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleAuthClick = () => {
    sessionStorage.setItem('returnPath', '/planifier-tournee');
    navigate('/connexion');
  };

  const handleCreateTourClick = () => {
    if (!isAuthenticated) {
      sessionStorage.setItem('returnPath', '/planifier-tournee');
      navigate('/connexion');
      return;
    }
    onCreateTourClick();
  };

  return (
    <>
      <PlanningHero onCreateTourClick={handleCreateTourClick} />
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
            onClick={handleCreateTourClick}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg font-semibold text-lg transform transition hover:scale-105"
          >
            Créer une tournée
          </Button>
          {!isAuthenticated && (
            <Button
              onClick={handleAuthClick}
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