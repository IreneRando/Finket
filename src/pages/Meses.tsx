import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import "../assets/pages/meses.scss";
import { supabase } from "../supabaseClient";

const categoryColors: Record<string, string> = {
  nomina: "#b8e0bc",
  gastos: "#f0b9b9",
  iphone: "#a8cbf0",
  ocio: "#faddc0",
  comida: "#eadaf5",
  transporte: "#f5f1da",
  caprichos: "#f5dae7",
};

export interface Transaction {
  id: string;
  created_at?: string;
  type: "income" | "expense";
  amount: number | string;
  category: string;
  description?: string | null;
  transaction_date: string;
}

export const Meses: React.FC = () => {
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYearIndex, setSelectedYearIndex] = useState(0);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(
    currentMonth - 1,
  );

  const years = useMemo(
    () => Array.from(new Array(5), (_, index) => currentYear - index),
    [currentYear],
  );
  const months = useMemo(
    () => Array.from(new Array(12), (_, index) => index + 1),
    [],
  );

  const [openIncomeModal, setOpenIncomeModal] = useState(false);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let ignore = false;

    const fetchTransactions = async () => {
      const year = years[selectedYearIndex];
      const month = months[selectedMonthIndex];

      // Formato YYYY-MM-DD para buscar todos en el mes correspondiente
      const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${month.toString().padStart(2, "0")}-${lastDay}`;

      const { data, error } = await supabase
        .from("transacciones")
        .select("*")
        .gte("transaction_date", startDate)
        .lte("transaction_date", endDate);

      if (!ignore && data && !error) {
        setTransactions(data);
      }
    };

    fetchTransactions();

    return () => {
      ignore = true;
    };
  }, [selectedYearIndex, selectedMonthIndex, refreshTrigger, years, months]);

  const ingresosTotal = transactions
    .filter((d) => d.type === "income")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const gastosTotal = transactions
    .filter((d) => d.type === "expense")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  // Datos agrupados para el PieChart usando transacciones reales
  const groupedData: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "expense" || t.type === "income") // Puedes agrupar solo gastos si lo prefieres
    .forEach((t) => {
      groupedData[t.category] =
        (groupedData[t.category] || 0) + Number(t.amount);
    });

  const chartData = Object.keys(groupedData).map((key) => ({
    key,
    name: t(`meses.categories.${key}`, { defaultValue: key }),
    value: groupedData[key],
    color: categoryColors[key] || "#cccccc",
  }));

  const handleYearTabChange = (
    event: React.SyntheticEvent,
    newValue: number,
  ) => {
    setSelectedYearIndex(newValue);
  };

  const handleMonthTabChange = (
    event: React.SyntheticEvent,
    newValue: number,
  ) => {
    setSelectedMonthIndex(newValue);
  };

  const resetForm = () => {
    setAmount("");
    setCategory("");
    setDescription("");
  };

  const handleCloseModals = () => {
    setOpenIncomeModal(false);
    setOpenExpenseModal(false);
    resetForm();
  };

  const handleSave = async () => {
    if (!amount || !category) return;

    const type = openIncomeModal ? "income" : "expense";
    const year = years[selectedYearIndex];
    const month = months[selectedMonthIndex];

    let trxDate = new Date();
    if (year !== currentYear || month !== currentMonth) {
      // Si el año o el mes seleccionado no es el actual, fechamos a mitad de mes.
      trxDate = new Date(year, month - 1, 15);
    }

    const { error } = await supabase.from("transacciones").insert([
      {
        type,
        amount: parseFloat(amount),
        category,
        description,
        transaction_date: trxDate.toISOString().split("T")[0],
      },
    ]);

    if (!error) {
      setRefreshTrigger((prev) => prev + 1);
      handleCloseModals();
    } else {
      console.error(error);
      alert("Uh oh! Había un error al guardar");
    }
  };

  return (
    <Box className="meses-container">
      <Box component="header" className="meses-header">
        <Typography variant="h3" component="h1">
          {t("meses.title")}
        </Typography>
        <Typography variant="subtitle1" component="p">
          {t("meses.subtitle")}
        </Typography>
      </Box>

      {/* Selector de Pestañas (Año y Mes) */}
      <Box className="meses-tabs-container">
        <Tabs
          value={selectedYearIndex}
          onChange={handleYearTabChange}
          variant="scrollable"
          scrollButtons="auto"
          className="year-tabs"
        >
          {years.map((year, index) => (
            <Tab key={index} label={year} />
          ))}
        </Tabs>

        <Tabs
          value={selectedMonthIndex}
          onChange={handleMonthTabChange}
          variant="scrollable"
          scrollButtons="auto"
          className="month-tabs"
        >
          {months.map((month, index) => (
            <Tab key={index} label={t(`meses.monthNames.${month}`)} />
          ))}
        </Tabs>
      </Box>

      <Box component="section" className="meses-actions">
        <Button
          variant="contained"
          className="btn-add-income"
          startIcon={<TrendingUpIcon />}
          onClick={() => setOpenIncomeModal(true)}
          disableRipple
        >
          {t("meses.addIncome")}
        </Button>
        <Button
          variant="contained"
          className="btn-add-expense"
          startIcon={<TrendingDownIcon />}
          onClick={() => setOpenExpenseModal(true)}
          disableRipple
        >
          {t("meses.addExpense")}
        </Button>
      </Box>

      {/* Modales */}
      <Dialog
        open={openIncomeModal || openExpenseModal}
        onClose={handleCloseModals}
        PaperProps={{ sx: { borderRadius: "24px", padding: "1rem" } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontFamily: "Outfit" }}>
          {openIncomeModal
            ? t("meses.modal.newIncome")
            : t("meses.modal.newExpense")}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            mt: 1,
          }}
        >
          <TextField
            autoFocus
            label={t("meses.modal.amount")}
            type="number"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">€</InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth>
            <InputLabel>{t("meses.modal.category")}</InputLabel>
            <Select
              value={category}
              label={t("meses.modal.category")}
              onChange={(e: SelectChangeEvent) =>
                setCategory(e.target.value as string)
              }
            >
              {openIncomeModal ? (
                <MenuItem value="nomina">
                  {t("meses.categories.nomina")}
                </MenuItem>
              ) : (
                <>
                  <MenuItem value="gastos">
                    {t("meses.categories.gastos")}
                  </MenuItem>
                  <MenuItem value="iphone">
                    {t("meses.categories.iphone")}
                  </MenuItem>
                  <MenuItem value="ocio">{t("meses.categories.ocio")}</MenuItem>
                  <MenuItem value="comida">
                    {t("meses.categories.comida")}
                  </MenuItem>
                  <MenuItem value="transporte">
                    {t("meses.categories.transporte")}
                  </MenuItem>
                  <MenuItem value="caprichos">
                    {t("meses.categories.caprichos")}
                  </MenuItem>
                </>
              )}
            </Select>
          </FormControl>
          <TextField
            label={t("meses.modal.description")}
            type="text"
            fullWidth
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ padding: "0 24px 16px" }}>
          <Button
            onClick={handleCloseModals}
            sx={{ color: "var(--text-muted)" }}
          >
            {t("meses.modal.cancel")}
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: openIncomeModal
                ? "var(--pastel-green-text)"
                : "var(--pastel-red-text)",
              borderRadius: "12px",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: openIncomeModal
                  ? "var(--pastel-green-dark)"
                  : "var(--pastel-red-dark)",
                boxShadow: "none",
              },
            }}
          >
            {t("meses.modal.save")}
          </Button>
        </DialogActions>
      </Dialog>

      <Box component="section" className="meses-summary">
        <Box className="summary-card ingresos">
          <Typography variant="overline" component="h3">
            {t("meses.totalIncome")}
          </Typography>
          <Typography variant="h3" component="p" className="amount positive">
            +€{ingresosTotal.toFixed(2)}
          </Typography>
        </Box>
        <Box className="summary-card gastos">
          <Typography variant="overline" component="h3">
            {t("meses.totalExpense")}
          </Typography>
          <Typography variant="h3" component="p" className="amount negative">
            -€{gastosTotal.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      <Box component="section" className="charts-section">
        <Box className="chart-card">
          <Typography variant="h5" component="h2">
            {t("meses.distribution")}
          </Typography>
          <Box sx={{ width: "100%", height: 400 }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={140}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number | undefined) =>
                      `€${(value || 0).toFixed(2)}`
                    }
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontFamily: "inherit", paddingTop: "20px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "var(--text-muted)",
                }}
              >
                <Typography variant="body1">
                  No hay datos en este periodo.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Meses;
