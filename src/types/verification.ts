export interface VerificationResult {
  success: boolean;
  error?: string;
}

export interface VerificationService {
  verifyClientStatus: (email: string) => Promise<{
    isVerified: boolean;
    error?: string;
  }>;
  activateAccount: (activationCode: string, email: string) => Promise<VerificationResult>;
  resendActivationEmail: (email: string) => Promise<VerificationResult>;
}