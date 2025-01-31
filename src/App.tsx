import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import AppRoutes from "./AppRoutes";
import { useTemporaryPasswordCheck } from "./hooks/auth/useTemporaryPasswordCheck";
import { ChangeTemporaryPasswordDialog } from "./components/auth/carrier-auth/ChangeTemporaryPasswordDialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";

// Create a client
const queryClient = new QueryClient();

function App() {
  const { needsPasswordChange, isLoading } = useTemporaryPasswordCheck();

  // Prevent rendering the app content while checking password status
  if (isLoading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster />
        <ChangeTemporaryPasswordDialog
          isOpen={needsPasswordChange}
          onClose={() => {}} // Empty function as we don't want to allow closing without changing password
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;