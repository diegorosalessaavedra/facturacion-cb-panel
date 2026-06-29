import React, { useRef, useEffect, useState } from "react";
import axios from "axios"; // Añadido: no olvides importar axios
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { API } from "../../../utils/api";
import config from "../../../utils/getToken";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

const GraficoPollosTendencia = () => {
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Inicializamos el state con la estructura básica vacía
  const [chartData, setChartData] = useState({
    labels: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ],
    datasets: [],
  });

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const url = `${API}/dashboard/pollos-mensuales`;
        const res = await axios.get(url, config);

        // Extraemos el arreglo que enviamos desde el backend
        const datosDelBackend = res.data.pollosEmbarcadosMensual;

        setChartData((prevData) => ({
          ...prevData,
          datasets: [
            {
              label: "Pollos Embarcados",
              data: datosDelBackend, // Inyectamos la data real aquí
              borderColor: "#f59e0b",
              borderWidth: 3.5,
              pointBackgroundColor: "#0f172a",
              pointBorderColor: "#f59e0b",
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 7,
              pointHoverBackgroundColor: "#34d399", // Ajustado a valor HEX para emerald-400
              fill: true,
              tension: 0.38,
              // Generamos el gradiente dinámicamente usando el contexto de Chart.js
              backgroundColor: (context) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;

                // Si el gráfico aún no tiene dimensiones, retornamos un color base
                if (!chartArea) return "rgba(245, 158, 11, 0.1)";

                const gradient = ctx.createLinearGradient(
                  0,
                  0,
                  0,
                  chartArea.bottom,
                );
                gradient.addColorStop(0, "rgba(245, 158, 11, 0.25)");
                gradient.addColorStop(1, "rgba(245, 158, 11, 0.0)");
                return gradient;
              },
            },
          ],
        }));
      } catch (error) {
        console.error("Error al cargar los datos del gráfico:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#94a3b8",
        bodyColor: "#fff",
        borderColor: "rgba(245, 158, 11, 0.3)",
        borderWidth: 1,
        padding: 14,
        cornerRadius: 12,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b", font: { weight: "650" } },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.04)" },
        beginAtZero: true,
        ticks: { color: "#64748b" },
        border: { display: false },
      },
    },
  };

  return (
    <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 w-full h-[420px] flex flex-col group hover:border-slate-700/60 transition-colors duration-300">
      <div className="mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-lg font-black text-white">
            Flujo de Distribución
          </h2>
          <p className="text-xs font-semibold text-slate-400">
            Desempeño mensual de pollos embarcados
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold">
          Métrica Óptima
        </span>
      </div>
      <div className="flex-1 w-full relative">
        {/* Mostramos un texto mientras carga, y el gráfico cuando ya tenemos la data */}
        {loading ? (
          <div className="text-slate-400 flex h-full items-center justify-center text-sm font-semibold animate-pulse">
            Cargando flujo de distribución...
          </div>
        ) : (
          <Line ref={chartRef} data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default GraficoPollosTendencia;
