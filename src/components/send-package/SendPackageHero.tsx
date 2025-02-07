import React from 'react';
import { Package2, Truck, Shield } from "lucide-react";

export function SendPackageHero() {
  return (
    <div className="relative bg-gradient-to-br from-primary to-primary-light">
      {/* Hero Content */}
      <div className="relative pt-20 pb-48 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Expédiez vos colis en toute simplicité
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto font-light">
              Trouvez le transporteur idéal pour vos envois entre la France et le Maghreb. 
              Profitez d'un service fiable, sécurisé et au meilleur prix.
            </p>
          </div>
        </div>
      </div>

      {/* Cards Section - Absolutely positioned */}
      <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {/* Card 1 */}
            <div className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 w-full md:w-auto">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Package2 className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-gray-800">
                Expédition simplifiée
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 w-full md:w-auto">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-gray-800">
                Transporteurs vérifiés
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 w-full md:w-auto">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-gray-800">
                Sécurité garantie
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-16 text-gray-50 fill-current" viewBox="0 0 1440 64" preserveAspectRatio="none">
          <path d="M0,0 C480,64 960,64 1440,0 L1440,64 L0,64 Z" />
        </svg>
      </div>
    </div>
  );
}