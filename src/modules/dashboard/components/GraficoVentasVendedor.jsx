import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
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
import { BiTrophy, BiBarChartAlt2 } from "react-icons/bi";
import { API } from "../../../utils/api";
import config from "../../../utils/getToken";

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
  const [chartData, setChartData] = useState(null);
  const [totalVentas, setTotalVentas] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const url = `${API}/dashboard/ventas-vendedor`;
        const res = await axios.get(url, config);

        // Data del backend: [{vendedor: "Mery", total_ventas: 45}, ...]
        const vendedoresAPI = res.data.ventas;

        // Calculamos el total de todo el equipo
        const total = vendedoresAPI.reduce(
          (acc, curr) => acc + parseInt(curr.total_ventas, 10),
          0,
        );
        setTotalVentas(total);

        setChartData({
          labels: vendedoresAPI.map((v) => v.vendedor),
          datasets: [
            {
              label: "Cotizaciones Cerradas",
              data: vendedoresAPI.map((v) => parseInt(v.total_ventas, 10)),
              borderRadius: 12,
              borderSkipped: false,
              barThickness: 60,
              // Generamos los gradientes dinámicamente según la posición (1ro, 2do, 3ro, etc.)
              backgroundColor: (context) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) return "rgba(14, 165, 233, 0.5)"; // Color base si no hay área

                const gradient = ctx.createLinearGradient(
                  0,
                  chartArea.bottom,
                  0,
                  chartArea.top,
                );
                const index = context.dataIndex;

                if (index === 0) {
                  // 1er Lugar (Ámbar)
                  gradient.addColorStop(0, "rgba(245, 158, 11, 0.1)");
                  gradient.addColorStop(1, "rgba(245, 158, 11, 0.9)");
                } else if (index === 1) {
                  // 2do Lugar (Esmeralda)
                  gradient.addColorStop(0, "rgba(16, 185, 129, 0.1)");
                  gradient.addColorStop(1, "rgba(16, 185, 129, 0.9)");
                } else {
                  // 3er Lugar y demás (Cian/Sky)
                  gradient.addColorStop(0, "rgba(14, 165, 233, 0.1)");
                  gradient.addColorStop(1, "rgba(14, 165, 233, 0.9)");
                }
                return gradient;
              },
              hoverBackgroundColor: (context) => {
                const index = context.dataIndex;
                if (index === 0) return "#fbbf24";
                if (index === 1) return "#34d399";
                return "#38bdf8";
              },
            },
          ],
        });
      } catch (error) {
        console.error("Error al cargar ventas de vendedores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { y: { duration: 1200, easing: "easeOutExpo" } },
    layout: { padding: { top: 20 } },
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
          label: (context) => `${context.raw} Cotizaciones`,
          title: (context) => {
            const index = context[0].dataIndex;
            const rank =
              index === 0
                ? "🏆 1er Lugar"
                : index === 1
                  ? "🥈 2do Lugar"
                  : index === 2
                    ? "🥉 3er Lugar"
                    : `#${index + 1} Lugar`;
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
        ticks: { color: "#475569", font: { weight: "600" } },
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: (context) => (context.index === 0 ? "#f59e0b" : "#cbd5e1"),
          font: { size: 13, weight: "bold" },
        },
      },
    },
  };

  return (
    <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 min-w-[550px] max-w-[550px] flex flex-col h-[450px] hover:border-slate-700/60 transition-colors duration-300">
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
              Cotizaciones cerradas en el periodo
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800/80">
          <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
            Total Equipo
          </span>
          <span className="text-sm font-black text-emerald-400 flex items-center gap-1">
            <BiBarChartAlt2 /> {totalVentas} Cotiz.
          </span>
        </div>
      </div>

      <div className="flex-1 w-full relative">
        {loading || !chartData ? (
          <div className="text-slate-400 flex h-full items-center justify-center text-sm font-semibold animate-pulse">
            Cargando ranking de asesores...
          </div>
        ) : chartData.labels.length === 0 ? (
          <div className="text-slate-500 flex h-full items-center justify-center text-sm font-semibold">
            No hay cotizaciones registradas.
          </div>
        ) : (
          <Bar ref={chartRef} data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default GraficoVentasVendedor;
