import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import RawData from "./pages/RawData";
import CalibratedData from "./pages/CalibratedData";
import Recommendation from "./pages/Recommendation";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Header />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/raw-data" element={<RawData />} />
            <Route path="/calibrated-data" element={<CalibratedData />} />
            <Route path="/recommendation" element={<Recommendation />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
