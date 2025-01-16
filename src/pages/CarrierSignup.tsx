import CarrierSignupForm from "@/components/auth/carrier-signup/CarrierSignupForm";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

export default function CarrierSignup() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Devenez transporteur partenaire
          </h1>
          <p className="text-lg text-gray-100 mb-8">
            Rejoignez notre réseau de transporteurs et développez votre activité
          </p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto -mt-8 px-4 pb-12">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
          <CarrierSignupForm onSuccess={() => navigate("/")} />
        </div>
      </div>
    </div>
  );
}