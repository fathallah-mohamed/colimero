interface FormFieldProps {
  children: React.ReactNode;
}

export function FormField({ children }: FormFieldProps) {
  return <div className="space-y-2">{children}</div>;
}