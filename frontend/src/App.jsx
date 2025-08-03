import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import RawData from "./pages/RawData";
import CalibratedData from "./pages/CalibratedData";
import Recommendation from "./pages/Recommendation";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
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
