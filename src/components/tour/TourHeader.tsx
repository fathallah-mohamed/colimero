import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, Truck } from "lucide-react";

export function TourHeader() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Truck className="h-8 w-8 text-primary" />
            Mes tournées
          </h1>
          <p className="text-gray-500">
            Gérez vos tournées et créez-en de nouvelles
          </p>
        </div>
        <Button 
          onClick={() => navigate('/transporteur/tournees/creer')}
          className="w-full md:w-auto"
          size="lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Créer une nouvelle tournée
        </Button>
      </div>
    </div>
  );
}