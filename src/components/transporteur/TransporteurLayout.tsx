import { ReactNode } from "react";

interface TransporteurLayoutProps {
  children: ReactNode;
}

export function TransporteurLayout({ children }: TransporteurLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {children}
        </div>
      </div>
    </div>
  );
}