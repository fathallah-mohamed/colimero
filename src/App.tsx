import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Profile from "@/pages/Profile";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/profil" element={<Profile />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;