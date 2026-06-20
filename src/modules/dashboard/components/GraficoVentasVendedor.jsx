import React, { useRef, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { BiTrophy, BiMoney } from "react-icons/bi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const GraficoVentasVendedor = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({ datasets: [] });

  // Solo 3 vendedores, ordenados por nivel de ventas
  const vendedoresData = [
    { nombre: "Ana Silva", ventas: 85000 },
    { nombre: "Carlos Gómez", ventas: 62000 },
    { nombre: "Luis Perez", ventas: 38000 },
  ].sort((a, b) => b.ventas - a.ventas);

  // Calculamos el total para mostrarlo como un Insight en la cabecera
  const totalVentas = vendedoresData.reduce(
    (acc, curr) => acc + curr.ventas,
    0,
  );

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;

    // Gradientes verticales (de abajo hacia arriba)
    // 1er Lugar (Ámbar)
    const gGold = ctx.createLinearGradient(0, 400, 0, 0);
    gGold.addColorStop(0, "rgba(245, 158, 11, 0.1)");
    gGold.addColorStop(1, "rgba(245, 158, 11, 0.9)");

    // 2do Lugar (Esmeralda)
    const gEmerald = ctx.createLinearGradient(0, 400, 0, 0);
    gEmerald.addColorStop(0, "rgba(16, 185, 129, 0.1)");
    gEmerald.addColorStop(1, "rgba(16, 185, 129, 0.9)");

    // 3er Lugar (Cian/Sky)
    const gBlue = ctx.createLinearGradient(0, 400, 0, 0);
    gBlue.addColorStop(0, "rgba(14, 165, 233, 0.1)");
    gBlue.addColorStop(1, "rgba(14, 165, 233, 0.9)");

    setChartData({
      labels: vendedoresData.map((v) => v.nombre),
      datasets: [
        {
          label: "Ventas Totales",
          data: vendedoresData.map((v) => v.ventas),
          backgroundColor: [gGold, gEmerald, gBlue],
          hoverBackgroundColor: ["#fbbf24", "#34d399", "#38bdf8"], // Colores sólidos brillantes en hover
          borderRadius: 12, // Esquinas bien redondeadas estilo píldora ancha
          borderSkipped: false,
          barThickness: 70, // Barras mucho más anchas para llenar el espacio de los 3 vendedores
        },
      ],
    });
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { y: { duration: 1200, easing: "easeOutExpo" } },
    layout: {
      padding: { top: 20 }, // Da espacio para que las barras no choquen con el borde superior
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#020617",
        padding: 16,
        cornerRadius: 16,
        titleColor: "#94a3b8",
        bodyColor: "#ffffff",
        bodyFont: { size: 16, weight: "black" },
        borderColor: "rgba(255, 255, 255, 0.05)",
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: (context) => `S/ ${context.raw.toLocaleString()}`,
          title: (context) => {
            const index = context[0].dataIndex;
            const rank =
              index === 0
                ? "🏆 1er Lugar"
                : index === 1
                  ? "🥈 2do Lugar"
                  : "🥉 3er Lugar";
            return `${rank} - ${context[0].label}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255, 255, 255, 0.03)" },
        border: { display: false },
        ticks: {
          color: "#475569",
          font: { weight: "600" },
          callback: (value) => `S/ ${value / 1000}k`,
        },
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: (context) => (context.index === 0 ? "#f59e0b" : "#cbd5e1"), // Resalta el nombre del 1er lugar
          font: { size: 13, weight: "bold" },
        },
      },
    },
  };

  return (
    <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 min-w-[550px] max-w-[550px] flex flex-col h-[450px] hover:border-slate-700/60 transition-colors duration-300">
      {/* Cabecera Premium */}
      <div className="mb-6 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BiTrophy size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-wide">
              Podio de Asesores
            </h2>
            <p className="text-xs font-semibold text-slate-400">
              Ventas cerradas en el periodo
            </p>
          </div>
        </div>

        {/* Insight Total */}
        <div className="flex flex-col items-end bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800/80">
          <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
            Total Equipo
          </span>
          <span className="text-sm font-black text-emerald-400 flex items-center gap-1">
            <BiMoney /> S/ {totalVentas.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Gráfico */}
      <div className="flex-1 w-full relative">
        <Bar ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
};

export default GraficoVentasVendedor;
