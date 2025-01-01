import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BookingCardWrapperProps {
  children: ReactNode;
  isEven?: boolean;
}

export function BookingCardWrapper({ children, isEven = false }: BookingCardWrapperProps) {
  return (
    <div className={cn(
      "rounded-lg shadow-sm p-6 space-y-4",
      isEven ? "bg-white" : "bg-[#F3F3F3]"
    )}>
      {children}
    </div>
  );
}