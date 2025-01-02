import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function TourHeader() {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-12">
      <h1 className="text-3xl font-bold">Mes tournées</h1>
      <Button onClick={() => navigate('/planifier-une-tournee')}>
        Créer une nouvelle tournée
      </Button>
    </div>
  );
}