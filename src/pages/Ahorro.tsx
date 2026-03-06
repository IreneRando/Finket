import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../assets/pages/ahorro.scss";
import { Box, Typography, Card, CardContent } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

export const Ahorro: React.FC = () => {
  const { t } = useTranslation();
  const [balance] = useState(0);
  const [ingresos] = useState(0);
  const [gastos] = useState(0);

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
              {t("ahorro.income")}
            </Typography>
            <Typography variant="h3" component="p" className="amount positive">
              +€{ingresos.toFixed(2)}
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
              {t("ahorro.expenses")}
            </Typography>
            <Typography variant="h3" component="p" className="amount negative">
              -€{gastos.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box component="section" className="ahorro-transactions">
        <Typography variant="h5" component="h2" fontWeight="700">
          {t("ahorro.recentTransactions")}
        </Typography>
        <Box className="transaction-placeholder">
          <Typography variant="body1">{t("ahorro.noTransactions")}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Ahorro;
