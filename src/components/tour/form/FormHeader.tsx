import { Truck } from "lucide-react";

export function FormHeader() {
  return (
    <div className="space-y-4 text-center mb-8">
      <div className="flex justify-center">
        <div className="bg-primary/10 p-3 rounded-full">
          <Truck className="w-8 h-8 text-primary" />
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-bold">Créer une nouvelle tournée</h1>
        <p className="text-gray-500 mt-2">
          Planifiez votre trajet et connectez-vous à notre réseau d'expéditeurs
        </p>
      </div>
    </div>
  );
}