import Navigation from "@/components/Navigation";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useNavigate } from "react-router-dom";
import { useRegisterForm } from "@/components/auth/register/useRegisterForm";

export default function ClientSignup() {
  const navigate = useNavigate();
  const {
    firstName,
    lastName,
    email,
    phone,
    phone_secondary,
    address,
    password,
    confirmPassword,
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
    setPhoneSecondary,
    setAddress,
    setPassword,
    setConfirmPassword,
    handleSubmit,
    isLoading,
    areRequiredFieldsFilled
  } = useRegisterForm(() => navigate("/connexion"));

  const handleLogin = () => {
    navigate("/connexion");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-client-light/20 to-white">
      <Navigation />
      <div className="bg-gradient-client py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Créez votre compte client
          </h1>
          <p className="text-lg text-white/90 mb-8">
            Rejoignez notre communauté et commencez à expédier vos colis en toute simplicité vers le Maghreb
          </p>
        </div>
      </div>
      <div className="max-w-2xl mx-auto -mt-8 px-4 pb-12">
        <RegisterForm 
          onLogin={handleLogin}
          isLoading={isLoading}
          firstName={firstName}
          lastName={lastName}
          email={email}
          phone={phone}
          phone_secondary={phone_secondary}
          address={address}
          password={password}
          confirmPassword={confirmPassword}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setEmail={setEmail}
          setPhone={setPhone}
          setPhoneSecondary={setPhoneSecondary}
          setAddress={setAddress}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          areRequiredFieldsFilled={areRequiredFieldsFilled}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}