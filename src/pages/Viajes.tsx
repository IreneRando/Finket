import React from "react";
import { Box, Typography } from "@mui/material";

export const Viajes: React.FC = () => {
  return (
    <Box sx={{ padding: "3rem 2rem", textAlign: "center" }}>
      <Typography
        variant="h3"
        fontWeight="700"
        color="text.primary"
        gutterBottom
      >
        Control de Viajes
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Próximamente: Presupuesto y gastos de tus viajes.
      </Typography>
    </Box>
  );
};

export default Viajes;
