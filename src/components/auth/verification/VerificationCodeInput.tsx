import { Input } from "@/components/ui/input";

interface VerificationCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}

export function VerificationCodeInput({ value, onChange, isLoading }: VerificationCodeInputProps) {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Code d'activation"
      className="text-center text-lg tracking-widest"
      maxLength={6}
      required
      disabled={isLoading}
    />
  );
}