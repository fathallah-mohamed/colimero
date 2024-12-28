import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  gradient?: boolean;
}

export function Heading({
  level = 1,
  children,
  className,
  gradient,
  ...props
}: HeadingProps) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Component
      className={cn(
        "font-bold tracking-tight",
        gradient && "bg-gradient-to-r from-[#2563EB] to-[#00B0F0] bg-clip-text text-transparent",
        level === 1 && "text-4xl md:text-5xl lg:text-6xl",
        level === 2 && "text-3xl md:text-4xl",
        level === 3 && "text-2xl md:text-3xl",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}