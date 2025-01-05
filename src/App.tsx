import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Tours from "./pages/Tours";
import Reserver from "./pages/Reserver";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/reserver/:tourId" element={<Reserver />} />
      </Routes>
    </Router>
  );
}

export default App;
