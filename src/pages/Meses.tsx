import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  { key: "nomina", value: 2500, color: "#b8e0bc" }, // pastel green
  { key: "gastos", value: 400, color: "#f0b9b9" }, // pastel red
  { key: "iphone", value: 150, color: "#a8cbf0" }, // pastel blue
  { key: "ocio", value: 200, color: "#faddc0" }, // pastel orange
  { key: "comida", value: 350, color: "#eadaf5" }, // pastel purple
  { key: "transporte", value: 80, color: "#f5f1da" }, // pastel yellow
  { key: "caprichos", value: 120, color: "#f5dae7" }, // pastel pink
];

export const Meses: React.FC = () => {
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState<string>(
    currentYear.toString(),
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    currentMonth.toString(),
  );

  const data = rawData.map((item) => ({
    ...item,
    name: t(`meses.categories.${item.key}`),
  }));

  // Calculamos el total de ingresos y gastos de forma simple para el resumen
  const ingresosTotal = data.find((d) => d.key === "nomina")?.value || 0;
  const gastosTotal = data
    .filter((d) => d.key !== "nomina")
    .reduce((acc, curr) => acc + curr.value, 0);

  const handleYearChange = (event: SelectChangeEvent) => {
    setSelectedYear(event.target.value as string);
  };

  const handleMonthChange = (event: SelectChangeEvent) => {
    setSelectedMonth(event.target.value as string);
  };

  const years = Array.from(new Array(5), (_, index) => currentYear - index);
  const months = Array.from(new Array(12), (_, index) => index + 1);

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

      {/* Selectores de Fecha */}
      <Box className="meses-filters">
        <FormControl variant="outlined" className="filter-select">
          <InputLabel id="year-select-label">
            {t("meses.selectYear")}
          </InputLabel>
          <Select
            labelId="year-select-label"
            id="year-select"
            value={selectedYear}
            onChange={handleYearChange}
            label={t("meses.selectYear")}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year.toString()}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" className="filter-select">
          <InputLabel id="month-select-label">
            {t("meses.selectMonth")}
          </InputLabel>
          <Select
            labelId="month-select-label"
            id="month-select"
            value={selectedMonth}
            onChange={handleMonthChange}
            label={t("meses.selectMonth")}
          >
            {months.map((month) => (
              <MenuItem key={month} value={month.toString()}>
                {t(`meses.monthNames.${month}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Botones de Añadir */}
      <Box component="section" className="meses-actions">
        <Button
          variant="contained"
          className="btn-add-income"
          startIcon={<TrendingUpIcon />}
          disableRipple
        >
          {t("meses.addIncome")}
        </Button>
        <Button
          variant="contained"
          className="btn-add-expense"
          startIcon={<TrendingDownIcon />}
          disableRipple
        >
          {t("meses.addExpense")}
        </Button>
      </Box>

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
