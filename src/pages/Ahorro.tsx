import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../supabaseClient";
import "../assets/pages/ahorro.scss";
import { Box, Typography, Card, CardContent } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SavingsIcon from "@mui/icons-material/Savings";
import SecurityIcon from "@mui/icons-material/Security";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

export const Ahorro: React.FC = () => {
  const { t } = useTranslation();
  const [balance, setBalance] = useState(0);
  const [caja, setCaja] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Calculate Balance and Caja from all movimientos
      let movsQuery = supabase
        .from("movimientos")
        .select("monto, banco, categorias!inner(tipo)");
      
      if (user) {
        movsQuery = movsQuery.eq("usuario_id", user.id);
      }

      const { data: movs, error: movsError } = await movsQuery;

      if (movsError) {
        console.error("Error fetching balance:", movsError);
        alert("Error cargando ahorro: " + movsError.message);
      }

      if (movs && !movsError) {
        let calcBalance = 0;
        let calcCaja = 0;
        movs.forEach((m: any) => {
          const isIngreso = m.categorias.tipo === "ingreso";
          const amount = parseFloat(m.monto);

          if (isIngreso) calcBalance += amount;
          else calcBalance -= amount;

          if (m.banco === "BBVA Caja") {
            if (isIngreso) calcCaja += amount;
            else calcCaja -= amount;
          }
        });
        setBalance(calcBalance);
        setCaja(calcCaja);
      }
    };
    fetchData();
  }, []);

  const sobrante = balance - caja;
  const fondoEmergencia = sobrante > 0 ? sobrante * 0.75 : 0;
  const viajes = sobrante > 0 ? sobrante * 0.25 : 0;

  return (
    <Box className="ahorro-container">
      <Box component="header" className="ahorro-header">
        <Typography variant="h3" component="h1" fontWeight="800">
          {t("ahorro.title")}
        </Typography>
        <Typography variant="subtitle1" component="p" color="text.secondary">
          {t("ahorro.subtitle")}
        </Typography>
      </Box>

      <Box component="section" className="ahorro-summary">
        <Card className="summary-card balance" elevation={0}>
          <CardContent sx={{ pb: "16px !important", p: 0 }}>
            <Typography
              variant="overline"
              component="h3"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AccountBalanceWalletIcon sx={{ fontSize: 18, mr: 1 }} />
              {t("ahorro.totalBalance")}
            </Typography>
            <Typography variant="h3" component="p" className="amount">
              €{balance.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>

        <Card className="summary-card caja" elevation={0}>
          <CardContent sx={{ pb: "16px !important", p: 0 }}>
            <Typography
              variant="overline"
              component="h3"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SavingsIcon sx={{ fontSize: 18, mr: 1 }} />
              {t("ahorro.caja")}
            </Typography>
            <Typography variant="h3" component="p" className="amount">
              €{caja.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>

        <Card className="summary-card fondo-emergencia" elevation={0}>
          <CardContent sx={{ pb: "16px !important", p: 0 }}>
            <Typography
              variant="overline"
              component="h3"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SecurityIcon sx={{ fontSize: 18, mr: 1 }} />
              {t("ahorro.emergencyFund")}
            </Typography>
            <Typography variant="h3" component="p" className="amount">
              €{fondoEmergencia.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>

        <Card className="summary-card viajes" elevation={0}>
          <CardContent sx={{ pb: "16px !important", p: 0 }}>
            <Typography
              variant="overline"
              component="h3"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FlightTakeoffIcon sx={{ fontSize: 18, mr: 1 }} />
              {t("ahorro.trips")}
            </Typography>
            <Typography variant="h3" component="p" className="amount">
              €{viajes.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Ahorro;
