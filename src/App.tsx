import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Ahorro from "./pages/Ahorro";
import Meses from "./pages/Meses";
import Viajes from "./pages/Viajes";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/ahorro" element={<Ahorro />} />
        <Route path="/meses" element={<Meses />} />
        <Route path="/viajes" element={<Viajes />} />
        <Route path="*" element={<Navigate to="/ahorro" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
