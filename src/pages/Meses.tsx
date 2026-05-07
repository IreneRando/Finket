import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../supabaseClient";
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

const initialRawData = [
  { key: "nomina", value: 0, color: "#10b981", categoryId: 1 },
  { key: "iphone", value: 0, color: "#6366f1", categoryId: 2 },
  { key: "comida", value: 0, color: "#0ea5e9", categoryId: 3 },
  { key: "ocio", value: 0, color: "#f59e0b", categoryId: 4 },
  { key: "transporte", value: 0, color: "#8b5cf6", categoryId: 5 },
  { key: "caprichos", value: 0, color: "#ec4899", categoryId: 6 },
  { key: "gastos", value: 0, color: "#f43f5e", categoryId: 7 },
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

  // Generamos los años (desde el año actual bajando hasta 2026)
  const startYear = 2026;
  const numYears = Math.max(1, currentYear - startYear + 1);
  const years = Array.from(new Array(numYears), (_, index) => currentYear - index);
  const months = Array.from(new Array(12), (_, index) => index + 1);

  // Estados modales
  const [openIncomeModal, setOpenIncomeModal] = useState(false);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);

  // Estado del formulario
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [banco, setBanco] = useState("Sabadell");
  const [description, setDescription] = useState("");

  const [chartData, setChartData] = useState(initialRawData);

  const fetchMovimientos = async () => {
    const year = years[selectedYearIndex];
    const month = months[selectedMonthIndex];
    const start = `${year}-${String(month).padStart(2, "0")}-01`;
    const end = `${year}-${String(month).padStart(2, "0")}-31`;

    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
      .from('movimientos')
      .select('monto, categoria_id')
      .gte('fecha', start)
      .lte('fecha', end);

    if (user) {
      query = query.eq('usuario_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching movimientos:", error);
      return;
    }

    const newData = initialRawData.map(item => ({ ...item, value: 0 }));
    if (data) {
      data.forEach(mov => {
        const item = newData.find(d => d.categoryId === mov.categoria_id);
        if (item) {
          item.value += parseFloat(mov.monto);
        }
      });
    }
    setChartData(newData);
  };

  useEffect(() => {
    fetchMovimientos();
  }, [selectedYearIndex, selectedMonthIndex]);

  const data = chartData.map((item) => ({
    ...item,
    name: t(`meses.categories.${item.key}`),
  }));

  const totalNominas = data.find((d) => d.key === "nomina")?.value || 0;
  const gastosTotal = data
    .filter((d) => d.key !== "nomina")
    .reduce((acc, curr) => acc + curr.value, 0);
  
  const ingresosTotal = totalNominas - gastosTotal;

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
    setBanco("Sabadell");
    setDescription("");
  };

  const handleCloseModals = () => {
    setOpenIncomeModal(false);
    setOpenExpenseModal(false);
    resetForm();
  };

  const handleSave = async () => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0 && category) {
      const categoryObj = initialRawData.find((c) => c.key === category);
      if (categoryObj) {
        const year = years[selectedYearIndex];
        const month = months[selectedMonthIndex];
        const dateObj = new Date();
        const isCurrentMonth =
          dateObj.getFullYear() === year && dateObj.getMonth() + 1 === month;
        const fechaInsert = isCurrentMonth
          ? dateObj.toISOString().split("T")[0]
          : `${year}-${String(month).padStart(2, "0")}-01`;

        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase.from("movimientos").insert({
          monto: numericAmount,
          descripcion: description,
          categoria_id: categoryObj.categoryId,
          fecha: fechaInsert,
          banco: banco,
          usuario_id: user?.id || null
        });

        if (!error) {
          fetchMovimientos();
        } else {
          console.error("Error saving movimiento:", error);
          alert("Error al guardar: " + error.message);
        }
      }
    }
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
          onClick={() => {
            setCategory("nomina");
            setOpenIncomeModal(true);
          }}
          disableRipple
        >
          {t("meses.addIncome")}
        </Button>
        <Button
          variant="contained"
          className="btn-add-expense"
          startIcon={<TrendingDownIcon />}
          onClick={() => {
            setCategory("");
            setOpenExpenseModal(true);
          }}
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
              {openIncomeModal && (
                <MenuItem value="nomina">{t("meses.categories.nomina")}</MenuItem>
              )}
              {openExpenseModal && [
                <MenuItem key="gastos" value="gastos">{t("meses.categories.gastos")}</MenuItem>,
                <MenuItem key="iphone" value="iphone">{t("meses.categories.iphone")}</MenuItem>,
                <MenuItem key="ocio" value="ocio">{t("meses.categories.ocio")}</MenuItem>,
                <MenuItem key="comida" value="comida">{t("meses.categories.comida")}</MenuItem>,
                <MenuItem key="transporte" value="transporte">
                  {t("meses.categories.transporte")}
                </MenuItem>,
                <MenuItem key="caprichos" value="caprichos">
                  {t("meses.categories.caprichos")}
                </MenuItem>,
              ]}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Banco</InputLabel>
            <Select
              value={banco}
              label="Banco"
              onChange={(e: SelectChangeEvent) => setBanco(e.target.value as string)}
            >
              <MenuItem value="Sabadell">Sabadell</MenuItem>
              <MenuItem value="BBVA">BBVA</MenuItem>
              <MenuItem value="BBVA Caja">BBVA Caja</MenuItem>
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
            {ingresosTotal.toFixed(2)}€
          </Typography>
        </Box>
        <Box className="summary-card gastos">
          <Typography variant="overline" component="h3">
            {t("meses.totalExpense")}
          </Typography>
          <Typography variant="h3" component="p" className="amount negative">
            {gastosTotal.toFixed(2)}€
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Meses;
