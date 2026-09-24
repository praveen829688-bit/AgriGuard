import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/dashboard/Dashboard";
import DiseaseDetection from "./pages/detection/DiseaseDetection";
import DetectionHistory from "./pages/history/DetectionHistory";
import DiseaseIntelligence from "./pages/disease/DiseaseIntelligence";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/detection"
          element={<DiseaseDetection />}
        />

        <Route
          path="/history"
          element={<DetectionHistory />}
        />

        <Route
          path="/disease"
          element={<DiseaseIntelligence />}
        />

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
