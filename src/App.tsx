import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import AppRoutes from "./AppRoutes";
import { useTemporaryPasswordCheck } from "./hooks/auth/useTemporaryPasswordCheck";
import { ChangeTemporaryPasswordDialog } from "./components/auth/carrier-auth/ChangeTemporaryPasswordDialog";
import "./App.css";

function App() {
  const { needsPasswordChange, isLoading } = useTemporaryPasswordCheck();

  // Prevent rendering the app content while checking password status
  if (isLoading) {
    return null;
  }

  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
      <ChangeTemporaryPasswordDialog
        isOpen={needsPasswordChange}
        onClose={() => {}} // Empty function as we don't want to allow closing without changing password
      />
    </BrowserRouter>
  );
}

export default App;