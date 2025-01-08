export interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  company_name?: string;
  siret?: string;
  phone_secondary?: string;
  avatar_url?: string;
  coverage_area?: string[];
  created_at?: string;
  carrier_services?: Array<{
    service_type: string;
    icon: string;
  }>;
  carrier_capacities?: {
    total_capacity: number;
    price_per_kg: number;
  };
  id_document?: string | null;
}

// Alias ProfileData to Profile for backward compatibility
export type ProfileData = Profile;

export interface EditServicesDialogProps {
  carrier_id: string;
  onClose: () => void;
}

export interface ServicesSectionProps {
  profile: Profile;
  onUpdate?: () => void;
}

export interface ProfileHeaderProps {
  title: string;
  description: string;
  onEdit: () => void;
}