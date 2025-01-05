import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Tours from "./pages/Tours";
import Reserver from "./pages/Reserver";
import { BookingForm } from "@/components/booking/BookingForm"; // Ensure this import is included if needed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/reserver/:tourId" element={<Reserver />} />
      </Routes>
    </Router>
  );
}

export default App;
