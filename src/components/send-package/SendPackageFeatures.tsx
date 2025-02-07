import React from 'react';
import { Package2, Truck, Shield } from "lucide-react";

export function SendPackageFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 px-4 max-w-7xl mx-auto">
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <Package2 className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-2">
            <span className="font-semibold text-lg block text-gray-900">Expédition Facile</span>
            <p className="text-gray-600 text-sm leading-relaxed">
              Processus d'envoi simplifié de bout en bout pour une expérience fluide
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-2">
            <span className="font-semibold text-lg block text-gray-900">Transporteurs Vérifiés</span>
            <p className="text-gray-600 text-sm leading-relaxed">
              Un réseau de partenaires de confiance sélectionnés avec soin
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-2">
            <span className="font-semibold text-lg block text-gray-900">Sécurité Garantie</span>
            <p className="text-gray-600 text-sm leading-relaxed">
              Protection maximale et suivi en temps réel de vos colis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}