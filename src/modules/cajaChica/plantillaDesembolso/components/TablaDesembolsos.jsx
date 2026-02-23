import React, { useState } from "react";
import formatDate from "../../../../hooks/FormatDate";
import { numberPeru } from "../../../../assets/onInputs";
import { Trash2 } from "lucide-react";
// import Loading from "../../../../hooks/Loading"; // Descomenta si lo usas
import { useDisclosure } from "@nextui-org/react";
import AnularDesembolso from "./AnularDesembolso";

// --- CONSTANTES ---
const BILLETES = [
  { key: "billete_200", label: "200.00" },
  { key: "billete_100", label: "100.00" },
  { key: "billete_50", label: "50.00" },
  { key: "billete_20", label: "20.00" },
  { key: "billete_10", label: "10.00" },
];
const MONEDAS = [
  { key: "moneda_5", label: "5.00" },
  { key: "moneda_2", label: "2.00" },
  { key: "moneda_1", label: "1.00" },
  { key: "moneda_05", label: "0.50" },
  { key: "moneda_02", label: "0.20" },
  { key: "moneda_01", label: "0.10" },
];

const TablaDesembolsos = ({ desembolsos = [] }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // 🟢 1. Nuevo estado para almacenar el ID seleccionado
  const [selectedId, setSelectedId] = useState(null);

  const stickyHeader = "sticky top-0 z-20";
  const headerBase =
    "flex items-center justify-center font-bold text-[10px] uppercase tracking-wider py-2 px-1 text-center border-r border-b border-slate-400";

  // 🟢 Ajustes visuales: Colores más armónicos
  const headerDark = `${headerBase} bg-slate-900 text-white`;
  const headerAmber = `${headerBase} bg-amber-400 text-black`;
  const headerPurple = `${headerBase} bg-purple-900 text-white`;

  const cellBase =
    "flex items-center justify-center text-[11px] py-2 px-1 border-r border-b border-slate-200 min-h-[40px]";
  const cellData = `${cellBase} bg-slate-50 text-slate-700 font-medium hover:bg-slate-100 transition-colors`;
  const cellTotal = `${cellBase} bg-slate-100 text-slate-900 font-bold`;

  // 🟢 2. Actualizamos la función para guardar el ID y abrir el modal
  const handleRemove = (id) => {
    setSelectedId(id);
    onOpen();
  };

  return (
    <>
      <div className="w-full h-full overflow-auto shadow-md rounded-lg bg-slate-50 relative">
        <div
          className="grid min-w-[1500px]"
          style={{
            gridTemplateColumns:
              "40px 1fr 90px 90px 90px 90px 1fr 140px 90px repeat(11, 70px) 100px 40px",
            gridAutoRows: "max-content",
          }}
        >
          {/* === FILA 1: CABECERAS PRINCIPALES === */}
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>N°</div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            DESEMBOLSO A
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            FECHA DESEMBOLSO
          </div>
          <div className={`row-span-2 ${headerAmber} ${stickyHeader}`}>
            FECHA RENDIDA
          </div>
          <div className={`row-span-2 ${headerAmber} ${stickyHeader}`}>
            DEMORA DÍAS
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            IMPORTE
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            CONCEPTO
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            RUTAS
          </div>
          <div className={`${headerPurple} ${stickyHeader}`}>
            BILLETERA DIGITAL
          </div>
          <div className={`col-span-5 ${headerDark} ${stickyHeader}`}>
            BILLETES
          </div>
          <div className={`col-span-6 ${headerDark} ${stickyHeader}`}>
            MONEDAS
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            ESTADO
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}></div>

          <div className={`${headerPurple} top-[47px] sticky z-20`}>YAPE</div>

          {BILLETES.map((b) => (
            <div
              key={`h-${b.key}`}
              className="bg-slate-800 text-white text-[10px] text-nowrap font-bold flex items-center justify-center border-r border-slate-400 top-[47px] sticky z-20"
            >
              <span>S/ {b.label}</span>
            </div>
          ))}
          {MONEDAS.map((m) => (
            <div
              key={`h-${m.key}`}
              className="bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center border-r border-slate-400 top-[47px] sticky z-20"
            >
              <span>S/ {m.label}</span>
            </div>
          ))}

          {/* === CUERPO DE LA TABLA === */}
          {desembolsos.length > 0 ? (
            desembolsos.map((item, index) => (
              <React.Fragment key={index}>
                <div className={cellData}>{index + 1}</div>
                <div
                  className={`${cellData} justify-start px-3 text-nowrap text-[10px]`}
                >
                  {item?.trabajador?.nombre_trabajador || "N/A"}
                </div>
                <div className={cellData}>
                  {formatDate(item.fecha_desembolso) || "--/--/--"}
                </div>
                <div className={cellData}>
                  {formatDate(item?.fecha_rendida) || "--/--/--"}
                </div>
                <div className={cellData}>
                  {item.demora_dias ? `${item.demora_dias} días` : "-"}
                </div>
                <div className={`${cellTotal} text-blue-700`}>
                  S/ {numberPeru(item.importe_desembolso || 0)}
                </div>
                <div className={`${cellData} text-[10px] text-nowrap`}>
                  {item.motivo_desembolso || "APERTURA"}
                </div>
                <div className={`${cellData} text-[10px] text-nowrap`}>
                  {item.rutas_desembolso || "-"}
                </div>
                {/* Data Yape */}
                <div
                  className={`${cellData} bg-purple-50 text-purple-700 font-bold`}
                >
                  {item?.egresos?.yape
                    ? `S/ ${numberPeru(item.egresos.yape)}`
                    : "-"}
                </div>
                {/* Billetes */}
                <div className={cellData}>{item.egresos?.billete_200 || 0}</div>
                <div className={cellData}>{item.egresos?.billete_100 || 0}</div>
                <div className={cellData}>{item.egresos?.billete_50 || 0}</div>
                <div className={cellData}>{item.egresos?.billete_20 || 0}</div>
                <div className={cellData}>{item.egresos?.billete_10 || 0}</div>
                {/* Monedas */}
                <div className={cellData}>{item.egresos?.moneda_5 || 0}</div>
                <div className={cellData}>{item.egresos?.moneda_2 || 0}</div>
                <div className={cellData}>{item.egresos?.moneda_1 || 0}</div>
                <div className={cellData}>{item.egresos?.moneda_05 || 0}</div>
                <div className={cellData}>{item.egresos?.moneda_02 || 0}</div>
                <div className={cellData}>{item.egresos?.moneda_01 || 0}</div>
                {/* Estado */}
                <div className={`${cellData}`}>
                  <p
                    className={`text-[10px] font-bold ${
                      item.estado_desembolso === "RENDIDO"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {item.estado_desembolso}
                  </p>
                </div>
                <div className={`${cellBase} bg-slate-50`}>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all p-1.5"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </React.Fragment>
            ))
          ) : (
            <div className="col-span-full py-10 text-center bg-slate-50 text-slate-400 font-medium italic">
              No hay registros de desembolsos para mostrar.
            </div>
          )}
        </div>
      </div>

      {/* 🟢 3. El modal se renderiza en la raíz del componente, fuera del grid */}
      <AnularDesembolso
        key={selectedId}
        id={selectedId}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </>
  );
};

export default TablaDesembolsos;
