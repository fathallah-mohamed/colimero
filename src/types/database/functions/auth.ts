import { Json } from '../tables';

export interface AuthFunctions {
  sync_user_verification: {
    Args: {
      user_id: string;
      is_verified: boolean;
    };
    Returns: void;
  };
  create_test_user: {
    Args: {
      email: string;
      user_type: string;
      first_name: string;
      last_name: string;
      company_name?: string;
      siret?: string;
      address?: string;
    };
    Returns: string;
  };
}