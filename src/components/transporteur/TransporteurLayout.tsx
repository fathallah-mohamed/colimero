import { ReactNode } from "react";

export function TransporteurLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}

export default TransporteurLayout;