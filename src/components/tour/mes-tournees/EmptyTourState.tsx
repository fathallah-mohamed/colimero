import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmptyTourStateProps {
  type: "upcoming" | "completed";
}

export function EmptyTourState({ type }: EmptyTourStateProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow rounded-lg p-6 text-center">
      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {type === "upcoming" ? "Aucune tournée planifiée" : "Aucune tournée terminée"}
      </h3>
      <p className="text-gray-500 mb-4">
        {type === "upcoming" 
          ? "Vous n'avez pas encore créé de tournée. Commencez par en planifier une !"
          : "Les tournées terminées apparaîtront ici."
        }
      </p>
      {type === "upcoming" && (
        <Button onClick={() => navigate('/planifier-une-tournee')}>
          Planifier une tournée
        </Button>
      )}
    </div>
  );
}