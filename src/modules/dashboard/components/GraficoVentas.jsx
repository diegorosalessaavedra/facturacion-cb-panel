import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale, // Importar LogarithmicScale
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Registramos los módulos necesarios para Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale, // Registrar LogarithmicScale
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const GraficoTendenciasVentas = ({ ventas }) => {
  const [dataVentas, setDataVentas] = useState([
    { mes: 0, totalVenta: 0, cantidadComprobantes: 0 },
  ]);

  useEffect(() => {
    if (Array.isArray(ventas) && ventas.length > 0) {
      setDataVentas([
        { mes: 0, totalVenta: 0, cantidadComprobantes: 0 },
        ...ventas,
      ]);
    }
  }, [ventas]);

  if (!Array.isArray(dataVentas) || dataVentas.length === 0) {
    return <p>No hay datos de ventas para mostrar.</p>;
  }

  // Nombres de los meses
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Extraer los datos necesarios
  const labels = dataVentas.map(
    (venta) => (venta.mes === 0 ? "Inicial" : meses[venta.mes - 1]) // Usar el arreglo de meses
  );
  const totalVentas = dataVentas.map((venta) => parseFloat(venta.totalVenta));
  const cantidadComprobantes = dataVentas.map(
    (venta) => venta.cantidadComprobantes
  );

  // Datos del gráfico
  const data = {
    labels,
    datasets: [
      {
        label: "Ventas Mensuales",
        data: totalVentas,
        borderColor: "#FF6384",
        backgroundColor: "#FF6384",
        pointBackgroundColor: totalVentas.map((venta, index, arr) =>
          index === 0 ? "gray" : venta > arr[index - 1] ? "#FF6384" : "#FF6384"
        ),
        pointBorderColor: "black",
        pointBorderWidth: 1,
        tension: 0.4,
      },
      {
        label: "Comprobantes Mensuales",
        data: cantidadComprobantes,
        borderColor: "#36A2EB", // Color de la línea para comprobantes
        backgroundColor: "#36A2EB", // Fondo de la línea para comprobantes
        pointBackgroundColor: cantidadComprobantes.map(
          (comprobante, index, arr) =>
            index === 0
              ? "gray"
              : comprobante > arr[index - 1]
              ? "#36A2EB"
              : "#36A2EB"
        ),
        pointBorderColor: "black",
        pointBorderWidth: 1,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: `Tendencias de Ventas y Comprobantes ${new Date().getFullYear()}`,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            if (context.datasetIndex === 0) {
              // Tooltip para ventas
              return `Ventas:  S/.${context.raw}`;
            } else {
              // Tooltip para comprobantes
              return `Comprobantes: ${context.raw}`;
            }
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        display: true,
      },
      y: {
        display: true,
        type: "logarithmic", // Escala logarítmica
        beginAtZero: true, // Asegúrate de que empiece desde 1, ya que no puedes tener log(0)
      },
    },
    animation: {
      onComplete: (animation) => {
        const { ctx } = animation.chart;
        const metasetsVentas = animation.chart._metasets[0]; // Datos de ventas
        const metasetsComprobantes = animation.chart._metasets[1]; // Datos de comprobantes

        const pointsVentas = metasetsVentas.data;
        const pointsComprobantes = metasetsComprobantes.data;

        ctx.save();

        // Dibujar las flechas de ventas
        pointsVentas.forEach((point, index) => {
          if (index > 0) {
            const prevPoint = pointsVentas[index - 1];
            const isUpward = point.y < prevPoint.y;

            // Dibujar flechas para las ventas
            ctx.beginPath();
            ctx.moveTo(prevPoint.x, prevPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.strokeStyle = isUpward ? "#FF6384" : "#FF6384";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Agregar la punta de la flecha
            ctx.beginPath();
            if (isUpward) {
              ctx.moveTo(point.x, point.y);
              ctx.lineTo(point.x - 5, point.y + 5);
              ctx.lineTo(point.x + 5, point.y + 5);
            } else {
              ctx.moveTo(point.x, point.y);
              ctx.lineTo(point.x - 5, point.y - 5);
              ctx.lineTo(point.x + 5, point.y - 5);
            }
            ctx.closePath();
            ctx.fillStyle = isUpward ? "#FF6384" : "#FF6384";
            ctx.fill();
          }
        });

        // Dibujar las flechas para los comprobantes
        pointsComprobantes.forEach((point, index) => {
          if (index > 0) {
            const prevPoint = pointsComprobantes[index - 1];
            const isUpward = point.y < prevPoint.y;

            // Dibujar flechas para los comprobantes
            ctx.beginPath();
            ctx.moveTo(prevPoint.x, prevPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.strokeStyle = isUpward ? "#36A2EB" : "#36A2EB"; // Color diferente para los comprobantes
            ctx.lineWidth = 2;
            ctx.stroke();

            // Agregar la punta de la flecha
            ctx.beginPath();
            if (isUpward) {
              ctx.moveTo(point.x, point.y);
              ctx.lineTo(point.x - 5, point.y + 5);
              ctx.lineTo(point.x + 5, point.y + 5);
            } else {
              ctx.moveTo(point.x, point.y);
              ctx.lineTo(point.x - 5, point.y - 5);
              ctx.lineTo(point.x + 5, point.y - 5);
            }
            ctx.closePath();
            ctx.fillStyle = isUpward ? "#36A2EB" : "#36A2EB"; // Flecha para los comprobantes
            ctx.fill();
          }
        });

        ctx.restore();
      },
    },
  };

  return (
    <div className="w-full">
      <Line className="w-full" data={data} options={options} />
    </div>
  );
};

export default GraficoTendenciasVentas;
