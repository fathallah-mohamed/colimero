export interface CommitmentType {
  id: string;
  label: string;
  description: string;
}

export interface CarrierCommitment {
  accepted: boolean;
  commitment_type: CommitmentType;
}