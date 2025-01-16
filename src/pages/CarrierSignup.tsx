import CarrierSignupForm from "@/components/auth/carrier-signup/CarrierSignupForm";
import { useNavigate } from "react-router-dom";

export default function CarrierSignup() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <CarrierSignupForm onSuccess={() => navigate("/")} />
    </div>
  );
}