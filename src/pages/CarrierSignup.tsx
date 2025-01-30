import CarrierSignupForm from "@/components/auth/carrier-signup/CarrierSignupForm";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function CarrierSignup() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Développez votre activité de transport
          </h1>
          <p className="text-lg text-gray-600">
            Rejoignez notre réseau de transporteurs professionnels
          </p>
        </motion.div>

        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8"
        >
          <CarrierSignupForm onSuccess={() => navigate("/")} />
        </motion.div>
      </div>
    </div>
  );
}