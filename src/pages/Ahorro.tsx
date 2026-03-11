import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../assets/pages/ahorro.scss";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { supabase } from "../supabaseClient";

interface Transaction {
  id: string | number;
  type: "income" | "expense" | string;
  amount: number | string;
  category: string;
  description?: string;
  transaction_date: string;
  created_at?: string;
}

export const Ahorro: React.FC = () => {
  const { t } = useTranslation();
  const [balance, setBalance] = useState(0);
  const [ingresos, setIngresos] = useState(0);
  const [gastos, setGastos] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      // Fetch totales
      const { data: totalsData } = await supabase
        .from("transactions")
        .select("amount, type");
      if (totalsData) {
        let inTotal = 0;
        let outTotal = 0;
        totalsData.forEach((trx: { amount: string | number; type: string }) => {
          if (trx.type === "income") inTotal += Number(trx.amount);
          if (trx.type === "expense") outTotal += Number(trx.amount);
        });
        setIngresos(inTotal);
        setGastos(outTotal);
        setBalance(inTotal - outTotal);
      }

      // Fetch últimas 5 transacciones para el resumen
      const { data: recentData } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (recentData) {
        setRecentTransactions(recentData);
      }
    };

    fetchData();
  }, []);

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
        <Typography variant="h5" component="h2" fontWeight="700" sx={{ mb: 2 }}>
          {t("ahorro.recentTransactions")}
        </Typography>
        {recentTransactions.length > 0 ? (
          <List
            sx={{
              width: "100%",
              maxWidth: 600,
              margin: "0 auto",
              bgcolor: "transparent",
              p: 0,
            }}
          >
            {recentTransactions.map((trx) => (
              <ListItem
                key={trx.id}
                sx={{
                  mb: 2,
                  backgroundColor: "white",
                  borderRadius: "16px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                  p: 2,
                }}
              >
                <ListItemIcon>
                  {trx.type === "income" ? (
                    <TrendingUpIcon
                      sx={{ color: "var(--pastel-green-text, #50a359)" }}
                    />
                  ) : (
                    <TrendingDownIcon
                      sx={{ color: "var(--pastel-red-text, #d95b5b)" }}
                    />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={t(`meses.categories.${trx.category}`, {
                    defaultValue: trx.category,
                  })}
                  secondary={trx.description || trx.transaction_date}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    color: "var(--text-dark)",
                  }}
                />
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color={
                    trx.type === "income"
                      ? "var(--pastel-green-text, #50a359)"
                      : "var(--pastel-red-text, #d95b5b)"
                  }
                >
                  {trx.type === "income" ? "+" : "-"}€
                  {Number(trx.amount).toFixed(2)}
                </Typography>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box className="transaction-placeholder">
            <Typography variant="body1">
              {t("ahorro.noTransactions")}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Ahorro;
