import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const GraficoTotal = ({ cotizaciones, compras, ventas }) => {
  // Configuración de datos para el gráfico
  const data = {
    labels: ["Cotizaciones", "Compras", "Ventas"],
    datasets: [
      {
        label: "Totales",
        data: [
          cotizaciones?.totalCotizaciones,
          compras?.totalComprobantes,
          ventas?.totalComprobantes,
        ], // Valores totales
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"], // Colores para las secciones
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"], // Colores al pasar el mouse
      },
    ],
  };

  // Opciones del gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Ubicación de la leyenda
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}`, // Mostrar etiquetas personalizadas
        },
      },
    },
  };

  return (
    <div className=" w-[25%] min-w-[330px] flex flex-col gap-2 bg-white p-4 rounded-lg shadow-lg  shadow-zinc-300 justify-center items-center">
      <h3 className="text-xs">Totales </h3>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default GraficoTotal;
