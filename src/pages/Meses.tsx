import React, { useState } from "react";
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

const rawData = [
  { key: "nomina", value: 2500, color: "#b8e0bc" },
  { key: "gastos", value: 400, color: "#f0b9b9" },
  { key: "iphone", value: 150, color: "#a8cbf0" },
  { key: "ocio", value: 200, color: "#faddc0" },
  { key: "comida", value: 350, color: "#eadaf5" },
  { key: "transporte", value: 80, color: "#f5f1da" },
  { key: "caprichos", value: 120, color: "#f5dae7" },
];

export const Meses: React.FC = () => {
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Estado para Tabs
  const [selectedYearIndex, setSelectedYearIndex] = useState(0);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(
    currentMonth - 1,
  );

  // Generamos los años (ej: 2026, 2025, 2024...)
  const years = Array.from(new Array(5), (_, index) => currentYear - index);
  const months = Array.from(new Array(12), (_, index) => index + 1);

  // Estados modales
  const [openIncomeModal, setOpenIncomeModal] = useState(false);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);

  // Estado del formulario
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const data = rawData.map((item) => ({
    ...item,
    name: t(`meses.categories.${item.key}`),
  }));

  const ingresosTotal = data.find((d) => d.key === "nomina")?.value || 0;
  const gastosTotal = data
    .filter((d) => d.key !== "nomina")
    .reduce((acc, curr) => acc + curr.value, 0);

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

  const handleSave = () => {
    // Aquí iría la lógica de guardado
    handleCloseModals();
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
                <InputAdornment position="start">$</InputAdornment>
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
              <MenuItem value="nomina">{t("meses.categories.nomina")}</MenuItem>
              <MenuItem value="gastos">{t("meses.categories.gastos")}</MenuItem>
              <MenuItem value="iphone">{t("meses.categories.iphone")}</MenuItem>
              <MenuItem value="ocio">{t("meses.categories.ocio")}</MenuItem>
              <MenuItem value="comida">{t("meses.categories.comida")}</MenuItem>
              <MenuItem value="transporte">
                {t("meses.categories.transporte")}
              </MenuItem>
              <MenuItem value="caprichos">
                {t("meses.categories.caprichos")}
              </MenuItem>
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
            +${ingresosTotal.toFixed(2)}
          </Typography>
        </Box>
        <Box className="summary-card gastos">
          <Typography variant="overline" component="h3">
            {t("meses.totalExpense")}
          </Typography>
          <Typography variant="h3" component="p" className="amount negative">
            -${gastosTotal.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      <Box component="section" className="charts-section">
        <Box className="chart-card">
          <Typography variant="h5" component="h2">
            {t("meses.distribution")}
          </Typography>
          <Box sx={{ width: "100%", height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={140}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number | undefined) =>
                    `$${(value || 0).toFixed(2)}`
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Meses;
