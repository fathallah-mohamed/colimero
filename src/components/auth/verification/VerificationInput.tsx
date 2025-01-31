import { Input } from "@/components/ui/input";

interface VerificationInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function VerificationInput({ value, onChange }: VerificationInputProps) {
  return (
    <div className="space-y-2">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        placeholder="Code d'activation"
        className="text-center text-lg tracking-widest"
        maxLength={6}
      />
    </div>
  );
}