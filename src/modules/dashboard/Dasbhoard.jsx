import React, { useState } from "react";
import GraficoTopCotizaciones from "./components/GraficoTopCotizaciones";
import GraficoVentasVendedor from "./components/GraficoVentasVendedor";
import GraficoPollosTendencia from "./components/GraficoPollosTendencia";
import GraficoDestinos from "./components/GraficoDestinos";
import {
  FaCalendarAlt,
  FaMapMarkedAlt,
  FaTruckLoading,
  FaArrowUp,
} from "react-icons/fa";
import { FaFileInvoiceDollar } from "react-icons/fa6";

const Dashboard = () => {
  const [mes, setMes] = useState("ALL");
  const [anio, setAnio] = useState(new Date().getFullYear().toString());

  const kpis = {
    pollosEmbarcados: "14,520",
    destinosActivos: "8",
    cotizaciones: "342",
    ventasTotal: "S/ 1,124,500",
  };

  const handleSetToday = () => {
    setAnio(new Date().getFullYear().toString());
    setMes("ALL");
  };

  const meses = [
    { value: "01", label: "Enero" },
    { value: "02", label: "Febrero" },
    { value: "03", label: "Marzo" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Mayo" },
    { value: "06", label: "Junio" },
    { value: "07", label: "Julio" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];

  const anios = ["2023", "2024", "2025", "2026"];

  return (
    <div className="w-full h-screen bg-slate-950 p-8  pt-[100px] flex flex-col overflow-auto font-sans text-slate-100 antialiased">
      {/* HEADER Y FILTROS INTEGRADOS AL MENÚ */}
      <div className="w-full flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Panel de Control Operativo
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Métricas en tiempo real e indicadores de rendimiento
          </p>
        </div>

        {/* Filtros Dark Mode */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 backdrop-blur-md p-2 rounded-2xl border border-slate-800">
          <select
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            className="text-sm font-bold text-slate-200 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 outline-none cursor-pointer hover:border-amber-500/50 transition-colors"
          >
            <option value="ALL">Todo el año</option>
            {meses.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <select
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
            className="text-sm font-bold text-slate-200 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 outline-none cursor-pointer hover:border-amber-500/50 transition-colors"
          >
            {anios.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          <button
            onClick={handleSetToday}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-xl text-sm font-black shadow-lg shadow-amber-500/10 transform transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <FaCalendarAlt />
            Today
          </button>
        </div>
      </div>

      {/* TARJETAS KPI EN FORMATO DARK */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard
          title="Pollos Embarcados"
          value={kpis.pollosEmbarcados}
          icon={FaTruckLoading}
          trend="+12.4%"
        />
        <KpiCard
          title="Destinos Activos"
          value={kpis.destinosActivos}
          icon={FaMapMarkedAlt}
          trend="Estable"
          isNeutral
        />
        <KpiCard
          title="Cotizaciones Realizadas"
          value={kpis.cotizaciones}
          icon={FaFileInvoiceDollar}
          trend="+8.2%"
        />
        <KpiCard
          title="Ventas Totales"
          value={kpis.ventasTotal}
          icon={FaFileInvoiceDollar}
          trend="+23.1%"
          isHighlight
        />
      </div>

      {/* SECCIÓN DE GRÁFICOS */}
      <div className="flex gap-6 mb-6">
        <GraficoPollosTendencia />

        <GraficoDestinos />
      </div>

      <div className="flex gap-6 pb-10">
        <GraficoVentasVendedor />
        <GraficoTopCotizaciones />
      </div>
    </div>
  );
};

// Subcomponente de Tarjeta con Glow Interno y Efectos de Iluminación
const KpiCard = ({
  title,
  value,
  icon: Icon,
  trend,
  isNeutral,
  isHighlight,
}) => (
  <div
    className={`
    group p-6 rounded-3xl border transition-all duration-300 bg-slate-900/60
    ${isHighlight ? "border-amber-500/40 shadow-lg shadow-amber-500/5" : "border-slate-800 hover:border-slate-700"}
    transform hover:-translate-y-1.5 relative overflow-hidden
  `}
  >
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        {title}
      </span>
      <div
        className={`
        w-10 h-10 rounded-xl flex items-center justify-center shadow-md
        ${isHighlight ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-amber-500 group-hover:bg-amber-500/10 transition-colors"}
      `}
      >
        <Icon size={18} />
      </div>
    </div>

    <div className="flex items-end justify-between">
      <h3 className="text-2xl font-black text-white tracking-tight">{value}</h3>
      <span
        className={`
        text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1
        ${isNeutral ? "bg-slate-800 text-slate-400" : "bg-emerald-500/10 text-emerald-400"}
      `}
      >
        {!isNeutral && <FaArrowUp size={10} />}
        {trend}
      </span>
    </div>

    {/* Efecto de línea de luz inferior en hover */}
    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
  </div>
);

export default Dashboard;
