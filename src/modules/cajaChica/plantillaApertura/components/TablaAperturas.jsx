import React, { useState } from "react";
import formatDate from "../../../../hooks/FormatDate";
import { numberPeru } from "../../../../assets/onInputs";
import { Trash2 } from "lucide-react";
import { API } from "../../../../utils/api";
import axios from "axios";
import config from "../../../../utils/getToken";
import { handleAxiosError } from "../../../../utils/handleAxiosError";
import { toast } from "sonner";
import Loading from "../../../../hooks/Loading";
import AnularApertura from "./AnularApertura";
import { useDisclosure } from "@nextui-org/react";

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

const TablaAperturas = ({ aperturas = [] }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedId, setSelectedId] = useState(null);

  const stickyHeader = "sticky top-0 z-20";
  const headerBase =
    "flex items-center justify-center font-bold text-[10px] uppercase tracking-wider py-2 px-1 text-center  border-r border-b border-slate-400";
  const headerDark = `${headerBase} bg-slate-900 text-white`;
  const headerPurple = `${headerBase} bg-purple-900 text-white`;

  const cellBase =
    "flex items-center justify-center text-[11px] py-2 px-1 border-r border-b border-slate-300 min-h-[40px]";
  const cellData = `${cellBase} bg-white text-slate-700 font-medium`;
  const cellTotal = `${cellBase} bg-slate-50 text-slate-900 font-bold`;

  const handleRemove = (id) => {
    setSelectedId(id);
    onOpen();
  };

  return (
    <div className="w-full h-full overflow-auto shadow-md rounded-lg bg-white relative">
      {loading && <Loading />}

      <div
        className="grid"
        style={{
          gridTemplateColumns:
            "40px 1fr 90px 90px 100px 90px repeat(11, 70px) 100px 40px",
          gridAutoRows: "max-content", // Asegura que las filas no se estiren de más
        }}
      >
        {/* === FILA 1: CABECERAS PRINCIPALES === */}
        <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>N°</div>
        <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
          DISPONE CAJA
        </div>
        <div className={`row-span-2 ${headerDark}  ${stickyHeader}`}>
          FECHA QUE DISPONE
        </div>
        <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
          IMPORTE
        </div>
        <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>MOTIVO</div>

        <div className={`${headerPurple}  ${stickyHeader}`}>
          BILLETERA DIGITAL
        </div>
        <div className={`col-span-5 ${headerDark} ${stickyHeader}`}>
          BILLETES
        </div>
        <div className={`col-span-6 ${headerDark} ${stickyHeader}`}>
          MONEDAS
        </div>

        <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>ESTADO</div>
        <div className={`row-span-2 ${headerDark} ${stickyHeader}`}></div>

        {/* === FILA 2: SUB-CABECERAS === */}
        <div
          className={`${headerPurple} bg-purple-800 top-[47px] sticky z-20 `}
        >
          YAPE
        </div>
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
        {aperturas.length > 0 ? (
          aperturas.map((item, index) => (
            <React.Fragment key={index}>
              <div className={cellData}>{index + 1}</div>
              <div
                className={`${cellData} justify-start px-3  text-nowrap text-[10px]`}
              >
                {item.trabajador?.nombre_trabajador || "N/A"}
              </div>
              <div className={cellData}>
                {formatDate(item.fecha_dispone) || "--/--/--"}
              </div>
              <div className={`${cellTotal} text-blue-700`}>
                S/ {numberPeru(item.importe_apertura || 0)}
              </div>
              <div className={`${cellData} text-[10px]`}>
                {item.motivo_apertura || "APERTURA"}
              </div>
              {/* Data Yape */}
              <div className={`${cellData} bg-purple-50 text-purple-700`}>
                {item.ingresos?.yape > 0
                  ? `S/ ${numberPeru(item.ingresos?.yape) || 0}`
                  : "-"}
              </div>

              <div className={cellData}>{item.ingresos?.billete_200 || 0}</div>
              <div className={cellData}>{item.ingresos?.billete_100 || 0}</div>
              <div className={cellData}>{item.ingresos?.billete_50 || 0}</div>
              <div className={cellData}>{item.ingresos?.billete_20 || 0}</div>
              <div className={cellData}>{item.ingresos?.billete_10 || 0}</div>
              <div className={cellData}>{item.ingresos?.moneda_5 || 0}</div>
              <div className={cellData}>{item.ingresos?.moneda_2 || 0}</div>
              <div className={cellData}>{item.ingresos?.moneda_1 || 0}</div>
              <div className={cellData}>{item.ingresos?.moneda_05 || 0}</div>
              <div className={cellData}>{item.ingresos?.moneda_02 || 0}</div>
              <div className={cellData}>{item.ingresos?.moneda_01 || 0}</div>

              {/* Estado */}
              <div className={`${cellData} font-bold text-[11px]`}>
                {item.estado_apertura}
              </div>

              <div className={`${cellBase} bg-white`}>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-400 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </React.Fragment>
          ))
        ) : (
          <div className="col-span-full py-10 text-center bg-white text-slate-400 font-medium italic">
            No hay registros de aperturas para mostrar.
          </div>
        )}
      </div>
      <AnularApertura
        key={selectedId}
        id={selectedId}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};

export default TablaAperturas;
