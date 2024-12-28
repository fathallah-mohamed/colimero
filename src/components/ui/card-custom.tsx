import { Card as ShadcnCard } from "./card";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface CustomCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
}

const CardCustom = forwardRef<HTMLDivElement, CustomCardProps>(
  ({ className, gradient, ...props }, ref) => {
    return (
      <ShadcnCard
        ref={ref}
        className={cn(
          "rounded-xl shadow-lg",
          gradient && "bg-gradient-to-r from-[#2563EB] to-[#00B0F0] text-white",
          className
        )}
        {...props}
      />
    );
  }
);
CardCustom.displayName = "CardCustom";

export { CardCustom };