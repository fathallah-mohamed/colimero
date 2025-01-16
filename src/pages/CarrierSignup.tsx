import CarrierSignupForm from "@/components/auth/carrier-signup/CarrierSignupForm";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

export default function CarrierSignup() {
  const navigate = useNavigate();
  
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 pt-24">
        <CarrierSignupForm onSuccess={() => navigate("/")} />
      </div>
    </>
  );
}