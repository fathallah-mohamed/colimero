import React from 'react';
import { Package2, Truck, Clock, Shield } from "lucide-react";

export function SendPackageFeatures() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-50 rounded-lg p-6 hover:bg-blue-100 transition-colors">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="bg-white p-4 rounded-full">
            <Package2 className="h-8 w-8 text-[#0FA0CE]" />
          </div>
          <div>
            <span className="font-medium block mb-2">Expédition Facile</span>
            <p className="text-sm text-gray-600">Processus simplifié de bout en bout</p>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-6 hover:bg-blue-100 transition-colors">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="bg-white p-4 rounded-full">
            <Truck className="h-8 w-8 text-[#0FA0CE]" />
          </div>
          <div>
            <span className="font-medium block mb-2">Transporteurs Vérifiés</span>
            <p className="text-sm text-gray-600">Partenaires de confiance</p>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-6 hover:bg-blue-100 transition-colors">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="bg-white p-4 rounded-full">
            <Clock className="h-8 w-8 text-[#0FA0CE]" />
          </div>
          <div>
            <span className="font-medium block mb-2">Suivi en Temps Réel</span>
            <p className="text-sm text-gray-600">Localisez vos colis</p>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-6 hover:bg-blue-100 transition-colors">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="bg-white p-4 rounded-full">
            <Shield className="h-8 w-8 text-[#0FA0CE]" />
          </div>
          <div>
            <span className="font-medium block mb-2">Sécurité Garantie</span>
            <p className="text-sm text-gray-600">Protection maximale</p>
          </div>
        </div>
      </div>
    </div>
  );
}