import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";
import AppRoutes from "@/AppRoutes";
import Navigation from "@/components/Navigation";
import { useState } from "react";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

function App() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen pt-16">
          <Navigation 
            showAuthDialog={showAuthDialog} 
            setShowAuthDialog={setShowAuthDialog} 
          />
          <AppRoutes />
        </div>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;