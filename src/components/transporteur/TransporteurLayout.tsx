import { ReactNode } from "react";

interface TransporteurLayoutProps {
  children: ReactNode;
}

export function TransporteurLayout({ children }: TransporteurLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}