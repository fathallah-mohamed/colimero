import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, children, className }: FormSectionProps) {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm border p-4 md:p-6",
      "transform transition-all duration-200 hover:shadow-md",
      className
    )}>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}