import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, children, className }: FormSectionProps) {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm border p-6",
      "transform transition-all duration-200 hover:shadow-md",
      className
    )}>
      <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}