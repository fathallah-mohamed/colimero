import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CurrentTours() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Un aperçu de nos tournées actuelles
        </h2>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">France vers Tunisie</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-blue-600 font-medium">15 Mars 2024</span>
                  <p className="text-sm text-gray-600">Transport Express</p>
                </div>
                <span className="text-gray-600">5€/kg</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500"
                    style={{ width: `${((1000 - 600) / 1000) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">600kg / 1000kg</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Tunisie vers France</h3>
            <div className="text-center text-gray-500 py-8">
              Prochainement disponible
            </div>
          </div>
        </div>
        <div className="text-center">
          <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700">
            <Link to="/nos-transporteurs">Voir toutes les tournées</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}