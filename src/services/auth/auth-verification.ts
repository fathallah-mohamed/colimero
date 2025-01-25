import { User } from "@supabase/supabase-js";

export interface ValidationResponse {
  success: boolean;
  error?: string;
}

export const authVerificationService = {
  validateUserType(user: User, requiredType?: 'client' | 'carrier'): ValidationResponse {
    if (!requiredType) return { success: true };

    const userType = user.user_metadata?.user_type;
    console.log("Validating user type:", userType, "Required:", requiredType);
    
    if (userType !== requiredType) {
      return {
        success: false,
        error: `Ce compte n'est pas un compte ${requiredType === 'client' ? 'client' : 'transporteur'}`
      };
    }

    return { success: true };
  }
};