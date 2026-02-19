import React from "react";
import formatDate from "../../../../hooks/FormatDate";
import { numberPeru } from "../../../../assets/onInputs";

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
  const stickyHeader = "sticky top-0 z-20";

  const headerBase =
    "flex items-center justify-center font-bold text-[10px] uppercase tracking-wider py-2 px-1 text-center border-r border-b border-slate-400";
  const headerDark = `${headerBase} bg-slate-900 text-white`;
  const headerAmber = `${headerBase} bg-amber-400 text-black`;
  const headerPurple = `${headerBase} bg-purple-900 text-white`;

  const cellBase =
    "flex items-center justify-center text-[11px] py-2 px-1 border-r border-b border-slate-300 min-h-[40px]";
  const cellData = `${cellBase} bg-white text-slate-700 font-medium`;
  const cellTotal = `${cellBase} bg-slate-50 text-slate-900 font-bold`;

  return (
    // CAMBIO 1: h-fit a h-full para respetar el tamaño del padre
    <div className="w-full h-full overflow-auto shadow-md rounded-lg bg-white relative">
      <div
        className="grid min-w-[1500px]" // Min-w asegura que haya scroll horizontal si es necesario
        style={{
          gridTemplateColumns:
            "40px 1fr 90px 90px 90px 90px 1fr 90px repeat(11, 70px) 100px",
          gridAutoRows: "max-content", // Asegura que las filas no se estiren de más
        }}
      >
        {/* === FILA 1: CABECERAS PRINCIPALES === */}
        {/* Nota: Usamos sticky top-0 para fijarlos */}
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
        <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>MOTIVO</div>

        <div className={`${headerPurple} ${stickyHeader}`}>
          BILLETERA DIGITAL
        </div>
        <div className={`col-span-5 ${headerDark} ${stickyHeader}`}>
          BILLETES
        </div>
        <div className={`col-span-6 ${headerDark} ${stickyHeader}`}>
          MONEDAS
        </div>

        <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>ESTADO</div>

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
              {/* Data Yape */}
              <div className={`${cellData} bg-purple-50 text-purple-700`}>
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
              <div className={`${cellData} `}>
                <p
                  className={`text-[10px] font-bold   ${item.estado_desembolso === "RENDIDO" ? "text-green-500" : "text-red-500"}`}
                >
                  {item.estado_desembolso}
                </p>
              </div>
            </React.Fragment>
          ))
        ) : (
          <div className="col-span-full py-10 text-center bg-white text-slate-400 font-medium italic">
            No hay registros de aperturas para mostrar.
          </div>
        )}
      </div>
    </div>
  );
};

export default TablaDesembolsos;
