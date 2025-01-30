import { useSearchParams } from "react-router-dom";
import { ActivationForm } from "@/components/auth/activation/ActivationForm";
import { ActivationStatus } from "@/components/auth/activation/ActivationStatus";
import { useState } from "react";
import { useVerificationEmail } from "@/hooks/auth/useVerificationEmail";

export default function Activation() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const { isResending, sendVerificationEmail } = useVerificationEmail();

  if (!email) {
    return (
      <ActivationStatus 
        status="error"
        email={null}
      />
    );
  }

  const handleResendEmail = async () => {
    if (email) {
      await sendVerificationEmail(email);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Activation de votre compte</h2>
            <p className="text-gray-600 mt-2">
              Veuillez entrer le code d'activation reçu par email
            </p>
          </div>

          <ActivationForm 
            email={email}
            onSuccess={() => setStatus('success')}
          />

          <div className="mt-4 text-center text-sm text-gray-500">
            <p>
              Si vous n'avez pas reçu le code, vous pouvez{' '}
              <button
                onClick={handleResendEmail}
                className="text-primary hover:underline"
                disabled={isResending}
              >
                demander un nouveau code
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}