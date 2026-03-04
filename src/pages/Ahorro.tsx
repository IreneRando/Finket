import React, { useState } from "react";
import "../assets/pages/ahorro.scss";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

export const Ahorro: React.FC = () => {
  const [balance] = useState(0);
  const [ingresos] = useState(0);
  const [gastos] = useState(0);

  return (
    <Box className="ahorro-container">
      <Box component="header" className="ahorro-header">
        <Typography variant="h3" component="h1" fontWeight="800">
          Control de Ahorro
        </Typography>
        <Typography variant="subtitle1" component="p" color="text.secondary">
          Gestiona y visualiza el estado actual de tus finanzas
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
              Balance Total
            </Typography>
            <Typography variant="h3" component="p" className="amount">
              ${balance.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>

        <Card className="summary-card ingresos" elevation={0}>
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
              <TrendingUpIcon sx={{ fontSize: 18, mr: 1 }} />
              Ingresos
            </Typography>
            <Typography variant="h3" component="p" className="amount positive">
              +${ingresos.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>

        <Card className="summary-card gastos" elevation={0}>
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
              <TrendingDownIcon sx={{ fontSize: 18, mr: 1 }} />
              Gastos
            </Typography>
            <Typography variant="h3" component="p" className="amount negative">
              -${gastos.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box component="section" className="ahorro-actions">
        <Button
          variant="contained"
          className="btn-add-income"
          startIcon={<TrendingUpIcon />}
          disableRipple
        >
          Añadir Ingreso
        </Button>
        <Button
          variant="contained"
          className="btn-add-expense"
          startIcon={<TrendingDownIcon />}
          disableRipple
        >
          Añadir Gasto
        </Button>
      </Box>

      <Box component="section" className="ahorro-transactions">
        <Typography variant="h5" component="h2" fontWeight="700">
          Últimos movimientos
        </Typography>
        <Box className="transaction-placeholder">
          <Typography variant="body1">No hay movimientos recientes.</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Ahorro;
