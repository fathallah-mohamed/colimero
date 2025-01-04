import { Check, X } from "lucide-react";

interface PasswordCriteria {
  label: string;
  test: (password: string) => boolean;
}

const criteria: PasswordCriteria[] = [
  {
    label: "Au moins 8 caractères",
    test: (password) => password.length >= 8,
  },
  {
    label: "Au moins une majuscule",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: "Au moins une minuscule",
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: "Au moins un chiffre",
    test: (password) => /[0-9]/.test(password),
  },
];

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  return (
    <div className="space-y-2 text-sm">
      {criteria.map((criterion, index) => {
        const isValid = criterion.test(password);
        return (
          <div
            key={index}
            className={`flex items-center space-x-2 ${
              isValid ? "text-green-600" : "text-red-600"
            }`}
          >
            {isValid ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
            <span>{criterion.label}</span>
          </div>
        );
      })}
    </div>
  );
}