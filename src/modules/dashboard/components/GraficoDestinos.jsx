import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const GraficoDestinos = () => {
  const data = {
    // 9 destinos (8 ciudades + "Otros")
    labels: [
      "Lima",
      "Arequipa",
      "Trujillo",
      "Piura",
      "Cusco",
      "Chiclayo",
      "Juliaca",
      "Huancayo",
      "Otros",
    ],
    datasets: [
      {
        label: "Destinos",
        // Datos ajustados para que sumen 100%
        data: [32, 18, 12, 10, 8, 6, 5, 5, 4],
        backgroundColor: [
          "rgba(245, 158, 11, 0.7)", // Amber
          "rgba(16, 185, 129, 0.7)", // Emerald
          "rgba(14, 165, 233, 0.7)", // Sky blue
          "rgba(139, 92, 246, 0.7)", // Violet
          "rgba(244, 63, 94, 0.7)", // Rose
          "rgba(20, 184, 166, 0.7)", // Teal
          "rgba(99, 102, 241, 0.7)", // Indigo
          "rgba(249, 115, 22, 0.7)", // Orange
          "rgba(148, 163, 184, 0.5)", // Slate 400 (Otros)
        ],
        borderColor: "#020617", // Fondo del dashboard (slate-950) para separar piezas
        borderWidth: 3,
        hoverBackgroundColor: [
          "#f59e0b",
          "#10b981",
          "#0ea5e9",
          "#8b5cf6",
          "#f43f5e",
          "#14b8a6",
          "#6366f1",
          "#f97316",
          "#94a3b8",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#cbd5e1", // slate-300
          usePointStyle: true,
          padding: 14, // Reducido de 20 a 14 para que entren los 9 items cómodamente
          font: {
            size: 12,
            weight: "600",
          },
        },
      },
      tooltip: {
        backgroundColor: "#0f172a", // slate-900
        titleColor: "#94a3b8",
        bodyColor: "#fff",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        callbacks: {
          label: (context) => ` ${context.label}: ${context.raw}%`,
        },
      },
    },
    scales: {
      r: {
        ticks: { display: false }, // Oculta los números del radar para un look más limpio
        grid: { color: "rgba(255, 255, 255, 0.05)" }, // Líneas del radar sutiles
        angleLines: { color: "rgba(255, 255, 255, 0.05)" },
      },
    },
  };

  return (
    <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 min-w-[560px] max-w-[560px] h-[420px] flex flex-col group hover:border-slate-700/60 transition-colors duration-300">
      <div className="mb-2 flex justify-between items-start">
        <div>
          <h2 className="text-lg font-black text-white">
            Destinos Principales
          </h2>
          <p className="text-xs font-semibold text-slate-400">
            Distribución porcentual de embarques
          </p>
        </div>
      </div>

      <div className="flex-1 w-full relative pb-4 flex items-center justify-center">
        <PolarArea data={data} options={options} />
      </div>
    </div>
  );
};

export default GraficoDestinos;
