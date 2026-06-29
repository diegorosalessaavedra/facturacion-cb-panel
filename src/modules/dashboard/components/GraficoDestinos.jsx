import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";
import { API } from "../../../utils/api";
import config from "../../../utils/getToken";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const GraficoDestinos = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Paleta de colores expandida a 10 para coincidir con el límite del backend
  const bgColors = [
    "rgba(245, 158, 11, 0.7)", // Amber
    "rgba(16, 185, 129, 0.7)", // Emerald
    "rgba(14, 165, 233, 0.7)", // Sky blue
    "rgba(139, 92, 246, 0.7)", // Violet
    "rgba(244, 63, 94, 0.7)", // Rose
    "rgba(20, 184, 166, 0.7)", // Teal
    "rgba(99, 102, 241, 0.7)", // Indigo
    "rgba(249, 115, 22, 0.7)", // Orange
    "rgba(236, 72, 153, 0.7)", // Pink (Añadido)
    "rgba(148, 163, 184, 0.5)", // Slate 400
  ];

  const hoverColors = [
    "#f59e0b",
    "#10b981",
    "#0ea5e9",
    "#8b5cf6",
    "#f43f5e",
    "#14b8a6",
    "#6366f1",
    "#f97316",
    "#ec4899",
    "#94a3b8",
  ];

  useEffect(() => {
    const fetchDestinos = async () => {
      try {
        // Asegúrate de que esta ruta coincida con la que creaste en dashboard.routes.js
        const url = `${API}/dashboard/destinos-principales`;
        const res = await axios.get(url, config);

        // El backend devuelve: [{ destino: "LIMA", cantidad: "35" }, ...]
        const destinosAPI = res.data.destinos;

        // Separamos los nombres y las cantidades en dos arreglos
        const labels = destinosAPI.map((item) => item.destino);
        // La base de datos puede devolver la cantidad como string, la pasamos a número
        const dataValues = destinosAPI.map((item) =>
          parseInt(item.cantidad, 10),
        );

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Destinos",
              data: dataValues,
              // Asignamos colores dinámicamente según cuántos resultados lleguen
              backgroundColor: bgColors.slice(0, dataValues.length),
              borderColor: "#020617",
              borderWidth: 3,
              hoverBackgroundColor: hoverColors.slice(0, dataValues.length),
            },
          ],
        });
      } catch (error) {
        console.error("Error al cargar los destinos principales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#cbd5e1",
          usePointStyle: true,
          padding: 14,
          font: {
            size: 12,
            weight: "600",
          },
        },
      },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#94a3b8",
        bodyColor: "#fff",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        callbacks: {
          label: (context) => {
            // Calcula el porcentaje automáticamente en base al total de los 10 primeros
            const valor = context.raw;
            const totalArreglo = context.dataset.data.reduce(
              (a, b) => a + b,
              0,
            );
            const porcentaje = ((valor / totalArreglo) * 100).toFixed(1);

            return ` ${context.label}: ${valor} envíos (${porcentaje}%)`;
          },
        },
      },
    },
    scales: {
      r: {
        ticks: { display: false },
        grid: { color: "rgba(255, 255, 255, 0.05)" },
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
            Top 10 volumen de embarques
          </p>
        </div>
      </div>

      <div className="flex-1 w-full relative pb-4 flex items-center justify-center">
        {loading || !chartData ? (
          <div className="text-slate-400 text-sm font-semibold animate-pulse">
            Cargando destinos...
          </div>
        ) : chartData.labels.length === 0 ? (
          <div className="text-slate-500 text-sm font-semibold">
            No hay datos registrados aún.
          </div>
        ) : (
          <PolarArea data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default GraficoDestinos;
