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

export interface Categoria {
  id: string;
  nombre: string;
  tipo: string;
  color_hex?: string;
}

export interface Transaction {
  id: string;
  created_at?: string;
  type: "income" | "expense";
  amount: number | string;
  categoria_id: string;
  descripcion?: string | null;
  fecha: string;

  categorias?: Categoria;
}

export const Meses: React.FC = () => {
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const startYear = 2025;

  const [selectedYearIndex, setSelectedYearIndex] = useState(
    Math.max(0, currentYear - startYear),
  );
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(
    currentMonth - 1,
  );

  const years = useMemo(() => {
    const numYears = Math.max(1, currentYear - startYear + 1);
    return Array.from(new Array(numYears), (_, index) => startYear + index);
  }, [currentYear]);
  const months = useMemo(
    () => Array.from(new Array(12), (_, index) => index + 1),
    [],
  );

  const [openIncomeModal, setOpenIncomeModal] = useState(false);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);

  const [amount, setAmount] = useState("");
  const [categoria_id, setCategoria_id] = useState("");
  const [descripcion, setDescripcion] = useState("");

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
      groupedData[t.categoria_id] =
        (groupedData[t.categoria_id] || 0) + Number(t.amount);
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
    setCategoria_id("");
    setDescripcion("");
  };

  const handleCloseModals = () => {
    setOpenIncomeModal(false);
    setOpenExpenseModal(false);
    resetForm();
  };

  const handleSave = async () => {
    if (!amount || !categoria_id) return;

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
        categoria_id,
        descripcion,
        fecha: trxDate.toISOString().split("T")[0],
      },
    ]);

    if (!error) {
      setRefreshTrigger((prev) => prev + 1);
      handleCloseModals();
    } else {
      console.error("Error detallado:", error.message); // Nos dirá si es un tema de columnas
      console.error("Código de error:", error.code); // Nos dirá si es un tema de permisos (42501 es RLS)
      console.error("Detalle:", error.details); // Nos dirá si un dato no encaja
      alert(`Error: ${error.message}`);
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
        classes={{ paper: "meses-modal-paper" }}
      >
        <DialogTitle className="modal-title">
          {openIncomeModal
            ? t("meses.modal.newIncome")
            : t("meses.modal.newExpense")}
        </DialogTitle>
        <DialogContent className="modal-content">
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
              value={categoria_id}
              label={t("meses.modal.category")}
              onChange={(e: SelectChangeEvent) =>
                setCategoria_id(e.target.value)
              }
            >
              <MenuItem value="280ddae4-898c-4647-861a-cd8abcd3cbc6">
                {t("meses.categories.nomina")}
              </MenuItem>
              <MenuItem value="c554d74d-c21c-4e12-8443-7f9d59d1a278">
                {t("meses.categories.alquiler")}
              </MenuItem>
              <MenuItem value="ff756d98-6ae8-4829-b659-40b56a10a762">
                {t("meses.categories.gastos")}
              </MenuItem>
              <MenuItem value="5d17017b-323a-45f8-9d1c-c2fcb6f62a45">
                {t("meses.categories.iphone")}
              </MenuItem>
              <MenuItem value="341f94ab-6bed-415d-86dd-b257b9725ee0">
                {t("meses.categories.ahorro")}
              </MenuItem>
              <MenuItem value="28b655f6-9532-4adf-bebe-09e0622dc20c">
                {t("meses.categories.ocio")}
              </MenuItem>
              <MenuItem value="fbc0f021-2271-45bd-981a-f00068e2cc4a">
                {t("meses.categories.comida")}
              </MenuItem>
              <MenuItem value="df4a6882-1db5-42a6-8763-913b308c0307">
                {t("meses.categories.transporte")}
              </MenuItem>
              <MenuItem value="f91d83a2-315f-408e-96c2-e2db4a0837f8">
                {t("meses.categories.caprichos")}
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            label={t("meses.modal.description")}
            type="text"
            fullWidth
            variant="outlined"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </DialogContent>
        <DialogActions className="modal-actions">
          <Button onClick={handleCloseModals} className="modal-btn-cancel">
            {t("meses.modal.cancel")}
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            className={`modal-btn-save ${openIncomeModal ? "income" : "expense"}`}
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
              <Box className="empty-chart-container">
                <Typography variant="body1" className="empty-chart-text">
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
