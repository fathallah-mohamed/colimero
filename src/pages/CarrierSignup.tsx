import CarrierSignupForm from "@/components/auth/carrier-signup/CarrierSignupForm";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

export default function CarrierSignup() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/20 to-white">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 pb-12 pt-8">
        <div className="bg-[#8B5CF6] p-8 rounded-lg shadow-lg text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Rejoignez notre réseau de transporteurs !
          </h1>
          <p className="text-lg text-white/90">
            Inscrivez-vous dès aujourd'hui pour accéder à des tournées optimisées et développer votre activité. 
            Remplissez les informations ci-dessous, et notre équipe examinera votre demande rapidement.
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
          <CarrierSignupForm onSuccess={() => navigate("/")} />
        </div>
      </div>
    </div>
  );
}