import React, { useEffect, useState } from "react";
import config from "../../../utils/getToken";
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

// Registrar módulos necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GraficoClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [totalClientes, setTotalClientes] = useState(0);

  useEffect(() => {
    const url = `${import.meta.env.VITE_URL_API}/clientes/grafico-compras`;

    axios.get(url, config).then((res) => {
      const clientesData = res.data.clientes;
      setClientes(clientesData);
    });
  }, []);

  useEffect(() => {
    const url = `${import.meta.env.VITE_URL_API}/clientes/registrados-por-mes`;

    axios.get(url, config).then((res) => {
      const clientesPorMes = res.data.clientesPorMes.reduce((acc, cliente) => {
        const fechaRegistro = new Date(cliente.createdAt);
        const yearActual = new Date().getFullYear();

        if (fechaRegistro.getFullYear() === yearActual) {
          const mes = fechaRegistro.toLocaleString("default", {
            month: "long",
            year: "numeric",
          });

          if (!acc[mes]) {
            acc[mes] = 0;
          }
          acc[mes]++;
        }
        return acc;
      }, {});

      // Convierte el objeto agrupado a los formatos necesarios para el gráfico
      const labels = Object.keys(clientesPorMes);
      const values = Object.values(clientesPorMes);

      // Genera colores llamativos usando HSL
      const colors = values.map(
        (_, index) => `hsl(${(index * 360) / values.length}, 85%, 60%)`
      );

      const borderColors = values.map(
        (_, index) => `hsl(${(index * 360) / values.length}, 85%, 40%)`
      );

      // Calcula el total de clientes registrados en el año actual
      const total = values.reduce((sum, value) => sum + value, 0);
      setTotalClientes(total);

      setChartData({
        labels,
        datasets: [
          {
            label: "Clientes Registrados por Mes",
            data: values,
            backgroundColor: colors, // Colores de las barras
            borderColor: borderColors, // Bordes más oscuros
            borderWidth: 2, // Bordes más gruesos
            barThickness: 15, // Grosor de las barras
            hoverBackgroundColor: colors.map((color) =>
              color.replace("60%", "70%")
            ), // Colores más brillantes al pasar el mouse
          },
        ],
      });
    });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
        },
      },
    },
  };

  return (
    <div
      className=" min-h-[300px]  w-[75%]
     flex  gap-2 bg-white p-4 rounded-lg shadow-lg  shadow-zinc-300"
    >
      <div className=" max-w-[300px] flex flex-col gap-5 pt-4">
        <h2 className="text-xs text-blue-600 font-bold">
          Clientes con más cotizaciones realizadas
        </h2>
        <ul className="min-w-[300px] w-full max-h-[300px] h-full overflow-auto">
          {clientes.map((cliente, index) => (
            <li key={index} className=" text-[9px] font-semibold">
              {index + 1}. {cliente.nombreApellidos || cliente.nombreComercial}{" "}
              -{" "}
              <span className="text-blue-600 text-[10px]">
                {cliente.cotizaciones_count}
              </span>{" "}
              COTIZACIONES
            </li>
          ))}
        </ul>
      </div>
      {chartData ? (
        <div
          className="w-full
         min-w-[450px] h-auto"
        >
          <div className="text-xs font-bold pt-2">
            Total de clientes registrados este año:{" "}
            <span className="text-red-600">{totalClientes}</span>
          </div>
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
};

export default GraficoClientes;
