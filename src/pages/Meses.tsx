import { Box, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import "../assets/pages/meses.scss";

// Mock data based on the categories requested by the user
const data = [
  { name: "Nómina", value: 2500, color: "#b8e0bc" }, // pastel green
  { name: "Gastos", value: 400, color: "#f0b9b9" }, // pastel red
  { name: "Iphone", value: 150, color: "#a8cbf0" }, // pastel blue
  { name: "Ocio", value: 200, color: "#faddc0" }, // pastel orange
  { name: "Comida", value: 350, color: "#eadaf5" }, // pastel purple
  { name: "Transporte", value: 80, color: "#f5f1da" }, // pastel yellow
  { name: "Caprichos/Parafarmacia", value: 120, color: "#f5dae7" }, // pastel pink
];

export const Meses: React.FC = () => {
  // Calculamos el total de ingresos y gastos de forma simple para el resumen
  const ingresosTotal = data.find((d) => d.name === "Nómina")?.value || 0;
  const gastosTotal = data
    .filter((d) => d.name !== "Nómina")
    .reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Box className="meses-container">
      <Box component="header" className="meses-header">
        <Typography variant="h3" component="h1">
          Visiograma Mensual
        </Typography>
        <Typography variant="subtitle1" component="p">
          Análisis detallado de tus ingresos y gastos por categoría
        </Typography>
      </Box>

      <Box component="section" className="meses-summary">
        <Box className="summary-card ingresos">
          <Typography variant="overline" component="h3">
            Total Ingresos
          </Typography>
          <Typography variant="h3" component="p" className="amount positive">
            +${ingresosTotal.toFixed(2)}
          </Typography>
        </Box>

        <Box className="summary-card gastos">
          <Typography variant="overline" component="h3">
            Total Gastos
          </Typography>
          <Typography variant="h3" component="p" className="amount negative">
            -${gastosTotal.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      <Box component="section" className="charts-section">
        <Box className="chart-card">
          <Typography variant="h5" component="h2">
            Distribución por Categorías
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
                  formatter={(value: number) => `$${value.toFixed(2)}`}
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
