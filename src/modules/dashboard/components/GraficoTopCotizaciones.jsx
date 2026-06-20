import React from "react";
import { FaTrophy, FaStar } from "react-icons/fa";

const GraficoTopCotizaciones = () => {
  // Datos Ficticios (Top 20)
  const mockData = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    nombre: `Cliente Corporativo ${i + 1}`,
    cotizaciones: Math.floor(Math.random() * 100) + 10,
  })).sort((a, b) => b.cotizaciones - a.cotizaciones);

  // Calculamos el valor máximo para que la barra de progreso sea relativa al 1er lugar
  const maxCotizaciones = Math.max(...mockData.map((d) => d.cotizaciones));
  const totalTop3 = mockData
    .slice(0, 3)
    .reduce((acc, curr) => acc + curr.cotizaciones, 0);

  // Función para obtener las iniciales del cliente para su "Avatar"
  const getInitials = (name) => {
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 w-full flex flex-col h-[450px] hover:border-slate-700/60 transition-colors duration-300">
      {/* Cabecera Enriquecida */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner">
            <FaTrophy size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wide">
              Ranking de Clientes
            </h2>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Top 20 por volumen de cotizaciones
            </p>
          </div>
        </div>

        {/* Mini-Insight del Top 3 */}
        <div className="flex items-center gap-2 bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800">
          <FaStar className="text-amber-500" size={14} />
          <div className="text-xs text-slate-300">
            Top 3 acumula:{" "}
            <span className="font-bold text-white">{totalTop3}</span>
          </div>
        </div>
      </div>

      {/* Lista Customizada (Reemplaza a Chart.js) */}
      <div className="flex-1 w-full overflow-y-auto pr-2 space-y-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
        {mockData.map((cliente, index) => {
          const rank = index + 1;
          const isTop3 = rank <= 3;
          const porcentaje = (cliente.cotizaciones / maxCotizaciones) * 100;

          // Lógica de estilos para Oro, Plata, Bronce y Resto
          let rankStyle = "bg-slate-800 text-slate-400 border border-slate-700";
          let barColor = "bg-emerald-500/80 group-hover:bg-emerald-400"; // Color por defecto

          if (rank === 1) {
            rankStyle =
              "bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 border-none font-black";
            barColor = "bg-gradient-to-r from-amber-500 to-amber-400";
          } else if (rank === 2) {
            rankStyle =
              "bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900 shadow-md border-none font-black";
            barColor = "bg-slate-400";
          } else if (rank === 3) {
            rankStyle =
              "bg-gradient-to-br from-amber-700 to-amber-600 text-white shadow-md border-none font-black";
            barColor = "bg-amber-600";
          }

          return (
            <div
              key={cliente.id}
              className="group flex items-center justify-between p-2 px-3 rounded-2xl hover:bg-slate-800/40 border border-transparent hover:border-slate-700/50 transition-all duration-300"
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Badge de Ranking */}
                <div
                  className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-xl text-xs ${rankStyle}`}
                >
                  {rank}
                </div>

                {/* Nombre y Barra de Progreso Inline */}
                <div className="flex-1 flex flex-col justify-center">
                  <span
                    className={`text-sm font-bold ${isTop3 ? "text-white" : "text-slate-300"} group-hover:text-amber-400 transition-colors truncate`}
                  >
                    {cliente.nombre}
                  </span>

                  {/* Barra Inline Customizada */}
                  <div className="w-full h-1.5 bg-slate-800/80 rounded-full mt-2 overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Valores Numéricos */}
              <div className="flex flex-col items-end justify-center ml-4 shrink-0 min-w-[60px]">
                <span className="text-lg font-black text-white leading-none">
                  {cliente.cotizaciones}
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest mt-1">
                  Cotiz.
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GraficoTopCotizaciones;
