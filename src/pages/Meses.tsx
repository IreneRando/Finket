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
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IconButton } from "@mui/material";
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
  { key: "nomina", value: 0, color: "#10b981", categoryId: 1, type: 'ingreso' },
  { key: "iphone", value: 0, color: "#6366f1", categoryId: 2, type: 'gasto' },
  { key: "comida", value: 0, color: "#0ea5e9", categoryId: 3, type: 'gasto' },
  { key: "ocio", value: 0, color: "#f59e0b", categoryId: 4, type: 'gasto' },
  { key: "transporte", value: 0, color: "#1201aaff", categoryId: 5, type: 'gasto' },
  { key: "caprichos", value: 0, color: "#ec4899", categoryId: 6, type: 'gasto' },
  { key: "gastos", value: 0, color: "#f43f5e", categoryId: 7, type: 'gasto' },
];

interface Transaction {
  id: string;
  monto: string | number;
  descripcion: string | null;
  fecha: string;
  categoria_id: number;
  banco: string;
  categorias: {
    nombre: string;
    tipo: string;
  };
}

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
  const years = React.useMemo(() => {
    const startYear = 2026;
    const numYears = Math.max(1, currentYear - startYear + 1);
    return Array.from(new Array(numYears), (_, index) => currentYear - index);
  }, [currentYear]);

  const months = React.useMemo(() => Array.from(new Array(12), (_, index) => index + 1), []);

  // Estados modales
  const [openIncomeModal, setOpenIncomeModal] = useState(false);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);

  // Estado del formulario
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [banco, setBanco] = useState("Sabadell");
  const [description, setDescription] = useState("");

  const [chartData, setChartData] = useState(initialRawData);
  const [monthTransactions, setMonthTransactions] = useState<Transaction[]>([]);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const year = years[selectedYearIndex];
      const month = months[selectedMonthIndex];
      const lastDay = new Date(year, month, 0).getDate();
      const start = `${year}-${String(month).padStart(2, "0")}-01`;
      const end = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('movimientos')
        .select('monto, categoria_id')
        .gte('fecha', start)
        .lte('fecha', end)
        .eq('usuario_id', user?.id || '');

      if (!error) {
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
      }

      // Fetch detailed transactions for the month
      const { data: detailed, error: detailedError } = await supabase
        .from("movimientos")
        .select("id, monto, descripcion, fecha, categoria_id, banco, categorias!inner(nombre, tipo)")
        .gte('fecha', start)
        .lte('fecha', end)
        .eq("usuario_id", user?.id || '')
        .order("fecha", { ascending: false })
        .order("creado_at", { ascending: false });

      if (detailed && !detailedError) {
        setMonthTransactions(detailed as unknown as Transaction[]);
      }
    };

    fetchData();
  }, [selectedYearIndex, selectedMonthIndex, years, months]);

  const fetchMovimientos = async () => {
    // This is now used for manual refreshes after mutations
    const year = years[selectedYearIndex];
    const month = months[selectedMonthIndex];
    const lastDay = new Date(year, month, 0).getDate();
    const start = `${year}-${String(month).padStart(2, "0")}-01`;
    const end = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('movimientos')
      .select('monto, categoria_id')
      .gte('fecha', start)
      .lte('fecha', end)
      .eq('usuario_id', user?.id || '');

    if (!error) {
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
    }

    const { data: detailed, error: detailedError } = await supabase
      .from("movimientos")
      .select("id, monto, descripcion, fecha, categoria_id, banco, categorias!inner(nombre, tipo)")
      .gte('fecha', start)
      .lte('fecha', end)
      .eq("usuario_id", user?.id || '')
      .order("fecha", { ascending: false })
      .order("creado_at", { ascending: false });

    if (detailed && !detailedError) {
      setMonthTransactions(detailed as unknown as Transaction[]);
    }
  };

  const data = chartData.map((item) => ({
    ...item,
    name: t(`meses.categories.${item.key}`),
  }));

  const totalNominas = data.find((d) => d.key === "nomina")?.value || 0;
  const gastosTotal = data
    .filter((d) => d.key !== "nomina")
    .reduce((acc, curr) => acc + curr.value, 0);
  
  const ingresosTotal = totalNominas;

  const handleYearTabChange = (
    _event: React.SyntheticEvent,
    newValue: number,
  ) => {
    setSelectedYearIndex(newValue);
  };

  const handleMonthTabChange = (
    _event: React.SyntheticEvent,
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
    setEditingTransactionId(null);
    resetForm();
  };

  const handleEdit = (tx: Transaction) => {
    setEditingTransactionId(tx.id);
    setAmount(tx.monto.toString());
    setDescription(tx.descripcion || "");
    setBanco(tx.banco || "Sabadell");
    
    // Find category key from categoryId
    const cat = initialRawData.find(c => c.categoryId === tx.categoria_id);
    setCategory(cat ? cat.key : "");

    if (cat?.key === "nomina") {
      setOpenIncomeModal(true);
    } else {
      setOpenExpenseModal(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t("meses.modal.confirmDelete"))) {
      const { error } = await supabase.from("movimientos").delete().eq("id", id);
      if (!error) {
        fetchMovimientos();
      } else {
        alert("Error al eliminar: " + error.message);
      }
    }
  };

  const handleSave = async () => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0 && category) {
      const categoryObj = initialRawData.find((c) => c.key === category);
      if (categoryObj) {
        const { data: { user } } = await supabase.auth.getUser();

        const transactionData = {
          monto: numericAmount,
          descripcion: description,
          categoria_id: categoryObj.categoryId,
          banco: banco,
          usuario_id: user?.id || null
        };

        let error;
        if (editingTransactionId) {
          // UPDATE
          const { error: updateError } = await supabase
            .from("movimientos")
            .update(transactionData)
            .eq("id", editingTransactionId);
          error = updateError;
        } else {
          // INSERT
          const year = years[selectedYearIndex];
          const month = months[selectedMonthIndex];
          const dateObj = new Date();
          const isCurrentMonth =
            dateObj.getFullYear() === year && dateObj.getMonth() + 1 === month;
          const fechaInsert = isCurrentMonth
            ? dateObj.toISOString().split("T")[0]
            : `${year}-${String(month).padStart(2, "0")}-01`;

          const { error: insertError } = await supabase
            .from("movimientos")
            .insert({ ...transactionData, fecha: fechaInsert });
          error = insertError;
        }

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
          {editingTransactionId 
            ? t("meses.modal.editTransaction")
            : (openIncomeModal ? t("meses.modal.newIncome") : t("meses.modal.newExpense"))
          }
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
              {initialRawData
                .filter(cat => (openIncomeModal ? cat.type === 'ingreso' : cat.type === 'gasto'))
                .map(cat => (
                  <MenuItem key={cat.key} value={cat.key}>
                    {t(`meses.categories.${cat.key}`)}
                  </MenuItem>
                ))
              }
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

      <Box className="meses-content-grid">
        <Box className="chart-card">
          <Typography variant="h5" component="h2">
            {t("meses.distribution")}
          </Typography>
          <Box sx={{ width: "100%", height: 400, display: "flex", alignItems: "center" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="35%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
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
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconType="circle"
                  wrapperStyle={{ 
                    paddingLeft: "10px",
                    fontFamily: "inherit",
                    fontSize: "13px",
                    width: "160px",
                    lineHeight: "1.5rem"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Seccion de Movimientos del Mes */}
        <Box component="section" className="meses-transactions">
          <Typography variant="h5" component="h2" fontWeight="700">
            {t("meses.recentTransactions")}
          </Typography>
          <Box className="transaction-list" sx={{ mt: 2, display: "flex", flexDirection: "column", gap: "1rem" }}>
            {monthTransactions.length > 0 ? (
              monthTransactions.map((tx) => (
                <Box key={tx.id} className="transaction-item" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, backgroundColor: "var(--card-bg)", borderRadius: "16px", border: "1px solid var(--card-border)" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box className="action-buttons">
                      <IconButton size="small" onClick={() => handleEdit(tx)} sx={{ color: "var(--pastel-blue-text)" }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(tx.id)} sx={{ color: "var(--pastel-red-text)" }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="600">{tx.descripcion || tx.categorias.nombre}</Typography>
                      <Typography variant="body2" color="text.secondary">{tx.fecha}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="h6" fontWeight="700" sx={{ color: tx.categorias.tipo === "ingreso" ? "var(--pastel-green-text)" : "var(--pastel-red-text)" }}>
                      {tx.categorias.tipo === "ingreso" ? "+" : "-"}€{parseFloat(String(tx.monto)).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Box className="transaction-placeholder">
                <Typography variant="body1">{t("meses.noTransactions")}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Meses;
