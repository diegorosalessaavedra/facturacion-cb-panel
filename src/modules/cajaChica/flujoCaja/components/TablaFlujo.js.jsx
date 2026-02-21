import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { onInputNumber } from "../../../../assets/onInputs";

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || amount === "") return "-";
  return new Intl.NumberFormat("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const MONTHS_NAMES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Oct",
  "Nov",
  "Dic",
];
const borderColor = "border-slate-200";
const cellBase = `border-r border-b ${borderColor} px-2 flex items-center text-[11px] py-2 transition-colors duration-200`;
const stickyLeft = `sticky left-0 z-10 border-r-2 ${borderColor} bg-white/95 backdrop-blur-sm shadow-[4px_0_10px_-4px_rgba(0,0,0,0.08)]`;
const headerDark = `bg-slate-900 text-white font-bold tracking-wider`;

const TablaFlujo = ({
  tableData,
  totalesEmpresa,
  saldosIniciales,
  saldosFinales,
  flujosNetos,
  totalesAnuales,
  saldoInicialEnero,
  setSaldoInicialEnero,
  dataFiltros,
}) => {
  const [expandedIds, setExpandedIds] = useState([]);

  // Lógica de columnas dinámicas basada en filtros APLICADOS
  const indicesAMostrar =
    dataFiltros?.mes === "TODOS"
      ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      : [parseInt(dataFiltros?.mes, 10)];

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const MoneyCell = ({
    val,
    bgClass = "bg-white",
    isBold = false,
    highlightNegative = false,
  }) => {
    const isDark =
      bgClass.includes("slate-900") || bgClass.includes("slate-800");
    const isNegative = highlightNegative && val < 0;
    return (
      <div
        className={`${cellBase} ${bgClass} ${isBold ? "font-bold" : "font-medium"} justify-between`}
      >
        <span
          className={`${isDark ? "text-slate-300" : "text-slate-300"} text-[9px]`}
        >
          S/
        </span>
        <span
          className={`${isDark ? "text-white" : "text-slate-700"} ${isNegative ? "text-red-600" : ""}`}
        >
          {formatCurrency(val)}
        </span>
      </div>
    );
  };

  const renderRow = (
    id,
    label,
    values,
    bgClass,
    labelClass,
    isExpandable = false,
    customTotal = undefined,
    icon = null,
  ) => {
    const total =
      customTotal !== undefined
        ? Number(customTotal)
        : values.reduce((a, b) => a + Number(b), 0);
    const isExpanded = expandedIds.includes(id);

    return (
      <React.Fragment key={id}>
        <div
          className={`${cellBase} ${stickyLeft} ${bgClass} justify-start gap-3 group ${isExpandable ? "cursor-pointer hover:bg-slate-100/50" : ""}`}
          onClick={() => isExpandable && toggleExpand(id)}
        >
          <div className="w-4 flex-shrink-0 flex items-center justify-center">
            {isExpandable ? (
              <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
                <ChevronRight
                  size={14}
                  className={
                    bgClass.includes("slate-900")
                      ? "text-white"
                      : "text-slate-400"
                  }
                />
              </motion.div>
            ) : (
              icon
            )}
          </div>
          <span
            className={`${labelClass} truncate leading-tight uppercase transition-colors group-hover:text-blue-600`}
          >
            {label}
          </span>
        </div>

        {indicesAMostrar.map((idx) => (
          <MoneyCell
            key={idx}
            val={values[idx]}
            bgClass={bgClass}
            isBold={bgClass.includes("slate")}
          />
        ))}

        <MoneyCell
          val={customTotal === null ? null : total}
          bgClass={`${bgClass} border-l-2 border-l-slate-300 bg-white`}
          isBold={true}
        />
      </React.Fragment>
    );
  };

  return (
    <div className="w-full h-full overflow-auto custom-scrollbar shadow-scroll-indicator rounded-xl p-4">
      <div
        className={`grid border-t border-l ${borderColor} w-fit bg-slate-100 gap-[1px]`}
        style={{
          gridTemplateColumns: `250px repeat(${indicesAMostrar.length}, 90px) 120px`,
          gridAutoRows: "minmax(40px, auto)",
        }}
      >
        {/* Encabezados */}
        <div
          className={`${cellBase} ${stickyLeft} ${headerDark} sticky top-0 z-30`}
        ></div>
        {indicesAMostrar.map((idx) => (
          <div
            key={idx}
            className={`${cellBase} ${headerDark} sticky top-0 z-20 justify-center uppercase text-[10px]`}
          >
            {`${MONTHS_NAMES[idx]} - ${String(dataFiltros?.year).slice(-2)}`}
          </div>
        ))}
        <div
          className={`${cellBase} ${headerDark} sticky top-0 z-20 justify-center border-l-2 border-l-slate-700`}
        >
          TOTAL ANUAL
        </div>

        {/* Saldo Inicial */}
        <div className={`${cellBase} ${stickyLeft} bg-slate-800 font-bold`}>
          <Wallet size={14} className="mr-3 text-slate-900" /> SALDO INICIAL
        </div>
        {indicesAMostrar.map((idx) =>
          idx === 0 ? (
            <div
              key={idx}
              className={`${cellBase} bg-slate-800 justify-between`}
            >
              <span className="text-slate-300 text-[9px]">S/</span>
              <input
                type="text"
                value={saldoInicialEnero === 0 ? "" : saldoInicialEnero}
                onChange={(e) =>
                  setSaldoInicialEnero(Number(e.target.value) || 0)
                }
                className="w-full bg-slate-700 text-right outline-none text-white font-bold rounded px-2 py-0.5 focus:ring-1 focus:ring-blue-400"
                placeholder="0.00"
                onInput={onInputNumber}
              />
            </div>
          ) : (
            <MoneyCell
              key={idx}
              val={saldosIniciales[idx]}
              bgClass="bg-slate-800"
              isBold={true}
            />
          ),
        )}
        <MoneyCell
          val={null}
          bgClass="bg-slate-800 border-l-2 border-l-slate-700"
          isBold={true}
        />

        <div className="col-span-full h-2 bg-white"></div>

        {/* Ingresos */}
        {renderRow(
          "tot-ing",
          "INGRESOS TOTALES",
          totalesEmpresa.ingresos,
          "bg-emerald-50/50",
          "text-emerald-700 font-bold",
          false,
          totalesAnuales.ingresos,
          <TrendingUp size={14} className="text-emerald-500" />,
        )}
        {renderRow(
          "cat-rep",
          "Por Reposición",
          totalesEmpresa.ingresos,
          "bg-white",
          "font-semibold text-slate-900",
          true,
        )}
        {expandedIds.includes("cat-rep") &&
          tableData.ingresos.map((trab) =>
            renderRow(
              trab.id,
              trab.name,
              trab.values,
              "bg-white",
              "pl-6 text-slate-900text-[10px]",
              false,
            ),
          )}

        <div className="col-span-full h-2 bg-white"></div>

        {/* Egresos */}
        {renderRow(
          "tot-egr",
          "EGRESOS TOTALES",
          totalesEmpresa.egresos,
          "bg-red-50/50",
          "text-red-700 font-bold",
          false,
          totalesAnuales.egresos,
          <TrendingDown size={14} className="text-red-500" />,
        )}
        {tableData.egresosGrouped.map((conceptoGroup) => {
          const rowTotals =
            conceptoGroup.items.length > 0
              ? conceptoGroup.items.reduce(
                  (acc, curr) => acc.map((n, i) => n + curr.values[i]),
                  Array(12).fill(0),
                )
              : Array(12).fill(0);
          return (
            <React.Fragment key={conceptoGroup.id}>
              {renderRow(
                conceptoGroup.id,
                conceptoGroup.categoria,
                rowTotals,
                "bg-white",
                "font-semibold text-slate-600",
                conceptoGroup.items.length > 0,
              )}
              {expandedIds.includes(conceptoGroup.id) &&
                conceptoGroup.items.map((trab) => (
                  <React.Fragment key={trab.id}>
                    {renderRow(
                      trab.id,
                      trab.name,
                      trab.values,
                      "bg-white",
                      "pl-6 text-slate-500 italic",
                      true,
                    )}
                    {expandedIds.includes(trab.id) &&
                      trab.subItems.map((sub) =>
                        renderRow(
                          sub.id,
                          sub.label,
                          sub.values,
                          "bg-white text-[10px]",
                          "pl-10 text-slate-900 font-normal",
                          false,
                        ),
                      )}
                  </React.Fragment>
                ))}
            </React.Fragment>
          );
        })}

        <div className="col-span-full h-4 bg-white"></div>

        {/* Totales Finales */}
        {renderRow(
          "flujo-neto",
          "Flujo Neto Mensual",
          flujosNetos,
          "bg-white",
          "text-slate-900 font-bold",
          false,
          totalesAnuales.flujoNeto,
        )}
        {renderRow(
          "tot-final",
          "SALDO FINAL ACUMULADO",
          saldosFinales,
          headerDark,
          "text-amber-600 font-bold",
          false,
          saldosFinales[11],
        )}
      </div>
    </div>
  );
};

export default TablaFlujo;
