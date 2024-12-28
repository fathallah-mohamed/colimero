import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Heading({ level = 1, className, children, ...props }: HeadingProps) {
  // Use a more specific type assertion for HTML heading elements
  const Component = (`h${level}` as keyof JSX.IntrinsicElements) as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  return (
    <Component
      className={cn(
        "font-bold tracking-tight",
        {
          "text-4xl": level === 1,
          "text-3xl": level === 2,
          "text-2xl": level === 3,
          "text-xl": level === 4,
          "text-lg": level === 5,
          "text-base": level === 6,
        },
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}