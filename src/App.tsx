import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import ResetPassword from "@/pages/ResetPassword";
import { SomeOtherComponent } from "@/components/SomeOtherComponent"; // Example of other imports
import { AnotherComponent } from "@/components/AnotherComponent"; // Example of other imports

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/some-other-route" element={<SomeOtherComponent />} />
        <Route path="/another-route" element={<AnotherComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
