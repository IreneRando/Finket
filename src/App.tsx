import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Ahorro from "./pages/Ahorro";
import Meses from "./pages/Meses";
import Viajes from "./pages/Viajes";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { supabase } from "./supabaseClient";
import "./App.css";

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <Router>
      {session && <Navbar />}
      <Routes>
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/ahorro" replace />} />
        <Route path="/ahorro" element={session ? <Ahorro /> : <Navigate to="/login" replace />} />
        <Route path="/meses" element={session ? <Meses /> : <Navigate to="/login" replace />} />
        <Route path="/viajes" element={session ? <Viajes /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={session ? "/ahorro" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
