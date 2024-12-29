import Navigation from "@/components/Navigation";
import CarrierAuthDialog from "@/components/auth/CarrierAuthDialog";
import { useState } from "react";

export default function Login() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <CarrierAuthDialog 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </div>
  );
}