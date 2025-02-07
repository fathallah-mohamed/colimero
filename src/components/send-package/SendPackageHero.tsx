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
      <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-primary/10 to-primary-light/20 p-4 rounded-xl mb-6">
                  <Package2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Expédition Facile
                </h3>
                <p className="text-gray-600">
                  Processus d'envoi simplifié de bout en bout pour une expérience fluide
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-primary/10 to-primary-light/20 p-4 rounded-xl mb-6">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Transporteurs Vérifiés
                </h3>
                <p className="text-gray-600">
                  Un réseau de partenaires de confiance sélectionnés avec soin
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-primary/10 to-primary-light/20 p-4 rounded-xl mb-6">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Sécurité Garantie
                </h3>
                <p className="text-gray-600">
                  Protection maximale et suivi en temps réel de vos colis
                </p>
              </div>
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