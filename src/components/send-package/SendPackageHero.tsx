import React from 'react';
import { Package2, Truck, Shield } from "lucide-react";

export function SendPackageHero() {
  return (
    <div className="bg-gradient-to-br from-primary to-primary-light pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Expédiez vos colis en toute simplicité
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Trouvez le transporteur idéal pour vos envois entre la France et le Maghreb. 
            Profitez d'un service fiable, sécurisé et au meilleur prix.
          </p>
        </div>

        {/* Cards section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mb-24">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Package2 className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <span className="font-semibold text-lg block text-gray-900">
                  Expédition Facile
                </span>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Processus d'envoi simplifié de bout en bout pour une expérience fluide
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <span className="font-semibold text-lg block text-gray-900">
                  Transporteurs Vérifiés
                </span>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Un réseau de partenaires de confiance sélectionnés avec soin
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <span className="font-semibold text-lg block text-gray-900">
                  Sécurité Garantie
                </span>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Protection maximale et suivi en temps réel de vos colis
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}