import React from "react";
import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";

export const Viajes: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ padding: "3rem 2rem", textAlign: "center" }}>
      <Typography
        variant="h3"
        fontWeight="700"
        color="text.primary"
        gutterBottom
      >
        {t("viajes.title")}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {t("viajes.subtitle")}
      </Typography>
    </Box>
  );
};

export default Viajes;
