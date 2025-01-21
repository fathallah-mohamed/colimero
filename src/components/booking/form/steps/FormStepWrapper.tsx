import { ReactNode } from "react";

interface FormStepWrapperProps {
  children: ReactNode;
  title: string;
}

export function FormStepWrapper({ children, title }: FormStepWrapperProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {children}
    </div>
  );
}