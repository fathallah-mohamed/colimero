import { Button as ShadcnButton } from "./button";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
}

const ButtonCustom = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <ShadcnButton
        ref={ref}
        className={cn(
          // Base styles
          "font-medium transition-colors",
          // Variant styles
          variant === 'default' && "bg-[#00B0F0] hover:bg-[#0082b3] text-white",
          variant === 'outline' && "border-2 border-[#00B0F0] text-[#00B0F0] hover:bg-[#00B0F0] hover:text-white",
          // Size styles
          size === 'lg' && "px-8 py-3 text-lg",
          className
        )}
        variant={variant}
        size={size}
        {...props}
      >
        {children}
      </ShadcnButton>
    );
  }
);
ButtonCustom.displayName = "ButtonCustom";

export { ButtonCustom };