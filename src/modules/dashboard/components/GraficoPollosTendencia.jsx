import React, { useRef, useEffect, useState } from "react";
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
  const [chartData, setChartData] = useState({ datasets: [] });

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(245, 158, 11, 0.25)"); // Ámbar neón arriba
    gradient.addColorStop(1, "rgba(245, 158, 11, 0.0)"); // Se desvanece por completo abajo

    setChartData({
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
      datasets: [
        {
          label: "Pollos Embarcados",
          data: [
            1400, 1900, 1650, 2600, 2100, 3200, 2800, 3400, 3100, 4200, 3900,
            4800,
          ],
          borderColor: "#f59e0b", // Línea Ámbar pura
          backgroundColor: gradient,
          borderWidth: 3.5,
          pointBackgroundColor: "#0f172a",
          pointBorderColor: "#f59e0b",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: "#emerald-400",
          fill: true,
          tension: 0.38,
        },
      ],
    });
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b", // slate-800
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
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
};

export default GraficoPollosTendencia;
