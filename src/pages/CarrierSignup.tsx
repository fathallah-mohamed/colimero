import CarrierSignupForm from "@/components/auth/carrier-signup/CarrierSignupForm";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

export default function CarrierSignup() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/20 to-white">
      <Navigation />
      <div className="bg-gradient-to-r from-primary to-primary-light py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Devenez transporteur partenaire
          </h1>
          <p className="text-lg text-white/90 mb-8">
            Rejoignez notre réseau de transporteurs et développez votre activité en accédant à des tournées optimisées
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