import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (isRegister) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else {
        alert("Registro exitoso. Revisa tu email o inicia sesión si el correo no requiere confirmación.");
        setIsRegister(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else navigate("/ahorro");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", bgcolor: "var(--bg-color)" }}>
      <Paper elevation={0} sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: "24px", border: "1px solid var(--card-border)", boxShadow: "0 12px 24px var(--card-shadow)" }}>
        <Typography variant="h4" fontWeight="800" mb={1} color="var(--pastel-blue-text)">
          Finket
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" mb={4}>
          {isRegister ? "Crea una cuenta para continuar" : "Inicia sesión para continuar"}
        </Typography>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <TextField
            label="Correo Electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          {error && <Typography color="var(--pastel-red-text)" variant="body2">{error}</Typography>}
          
          <Button type="submit" variant="contained" fullWidth sx={{ py: 1.5, borderRadius: "12px", bgcolor: "var(--pastel-blue-text)", "&:hover": { bgcolor: "var(--pastel-blue-dark)" }, boxShadow: "none", fontWeight: 700 }}>
            {isRegister ? "Registrarse" : "Iniciar Sesión"}
          </Button>
        </form>

        <Box textAlign="center" mt={3}>
          <Typography variant="body2" color="text.secondary">
            {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
            <Button variant="text" onClick={() => setIsRegister(!isRegister)} sx={{ textTransform: "none", fontWeight: "600", color: "var(--pastel-blue-text)" }}>
              {isRegister ? "Inicia Sesión" : "Regístrate"}
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
