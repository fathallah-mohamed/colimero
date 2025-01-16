import { ResetPasswordForm } from "@/components/auth/reset-password/ResetPasswordForm";
import Navigation from "@/components/Navigation";

export default function ResetPassword() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-md mx-auto pt-32 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-8">
            Réinitialisation du mot de passe
          </h1>
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}