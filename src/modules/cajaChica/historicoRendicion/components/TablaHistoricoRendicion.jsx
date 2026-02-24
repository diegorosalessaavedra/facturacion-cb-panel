import React, { useState } from "react";
import { numberPeru } from "../../../../assets/onInputs";
import formatDate from "../../../../hooks/FormatDate";
import { Tooltip, useDisclosure } from "@nextui-org/react";
import { generarPDFRendiciones } from "../../../../utils/plantillasPdf/generarPDFRendiciones";
import SolicitarAnularRendicion from "./SolicitarAnularRendicion";
import { Trash2 } from "lucide-react";

const stickyHeader = "sticky top-0 z-20";
const stickySubHeader = "sticky top-[30px] z-20";

const headerBase =
  "flex items-center justify-center font-bold text-[9px] uppercase tracking-wider py-2 px-1 text-center border-r border-b border-slate-400";

const headerDark = `${headerBase} bg-slate-900 text-white`;

// Añadimos h-full para que cuando haya "rowspan", la celda ocupe toda la altura y quede centrada
const cellBase =
  "flex items-center justify-center text-[10px] font-medium border-r border-b border-slate-300 min-h-[40px] h-full px-2 text-slate-700 bg-white text-center";

const TablaHistoricoRendicion = ({ rendiciones = [] }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedId, setSelectedId] = useState(null);

  const totalGeneralGastos = rendiciones.reduce(
    (acc, curr) => acc + Number(curr.total_gastos || 0),
    0,
  );

  const handleRemove = (id) => {
    setSelectedId(id);
    onOpen();
  };

  return (
    <div className="relative w-full h-full flex flex-col gap-2">
      <div className="flex-1 w-full overflow-auto shadow-md rounded-lg bg-white relative border border-slate-300">
        <div
          className="grid"
          style={{
            gridTemplateColumns:
              "40px 90px 220px 110px 180px 130px 80px 80px 80px 220px 90px 80px 100px 100px 140px 180px 90px 100px 40px",
            gridAutoRows: "max-content",
          }}
        >
          {/* ================= ENCABEZADOS SUPERIORES ================= */}
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>N°</div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            CORRELATIVO
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            TRABAJADOR
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>ÁREA</div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            CONCEPTO
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            RUTAS
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            MONTO <br /> RECIBIDO
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            FECHA <br /> RECIBIDA
          </div>

          {/* Empiezan los detalles específicos del comprobante */}
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            FECHA DE USO <br /> DE DINERO
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            RAZÓN SOCIAL DEL PROVEEDOR
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            RUC <br /> PROVEEDOR
          </div>

          <div
            className={`col-span-3 ${headerDark} ${stickyHeader} border-b-0`}
          >
            COMPROBANTE
          </div>

          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            CATEGORIA DEL GASTO
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            DETALLE DEL GASTO
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            IMPORTE S/
          </div>

          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            ESTADO
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}></div>
          {/* ================= SUB-ENCABEZADOS COMPROBANTE ================= */}
          <div className={`${headerDark} ${stickySubHeader}`}>
            FECHA DE <br /> EMISIÓN
          </div>
          <div className={`${headerDark} ${stickySubHeader}`}>
            TIPO <br /> COMPROB.
          </div>
          <div className={`${headerDark} ${stickySubHeader}`}>
            NÚMERO <br /> COMP.
          </div>

          {/* ================= CUERPO DE LA TABLA ================= */}
          {rendiciones.map((item, index) => {
            // Calculamos cuántos comprobantes tiene para hacer el efecto de celdas combinadas (Excel)
            const detalles = item.datos_rendicion || [];
            const filasOcupadas = detalles.length > 0 ? detalles.length : 1;
            const spanStyle = { gridRow: `span ${filasOcupadas}` };

            return (
              <React.Fragment key={item.id}>
                {/* 1. SECCIÓN AGRUPADA (A la izquierda) */}
                <div
                  className={`${cellBase} font-bold text-slate-500`}
                  style={spanStyle}
                >
                  {index + 1}
                </div>
                <div
                  className={`${cellBase} font-semibold cursor-pointer `}
                  style={spanStyle}
                  onClick={() => generarPDFRendiciones(item)}
                >
                  <Tooltip content="Generar pdf" showArrow={true} size="sm">
                    <p className="text-red-600">
                      {item.correlativo_rendicion || "-"}
                    </p>
                  </Tooltip>
                </div>
                <div
                  className={`${cellBase} justify-start font-medium`}
                  style={spanStyle}
                >
                  {item.trabajador?.nombre_trabajador || "-"}
                </div>
                <div className={cellBase} style={spanStyle}>
                  {item.area_rendicion || "-"}
                </div>
                <div
                  className={`${cellBase} justify-start text-[9px]`}
                  style={spanStyle}
                >
                  {item.concepto_rendicion || "-"}
                </div>
                <div
                  className={`${cellBase} justify-start text-[9px]`}
                  style={spanStyle}
                >
                  {item.desembolso.rutas_desembolso || "-"}
                </div>
                <div className={`${cellBase} font-bold`} style={spanStyle}>
                  {item.monto_recibido
                    ? `S/ ${numberPeru(item.monto_recibido)}`
                    : "-"}
                </div>
                <div className={cellBase} style={spanStyle}>
                  {formatDate(item.fecha_recibida) || "-"}
                </div>

                {/* 2. SECCIÓN DETALLE (A la derecha, se renderizan fila por fila) */}
                {detalles.length > 0 ? (
                  detalles.map((detalle, dIndex) => (
                    <React.Fragment key={detalle.id || dIndex}>
                      <div className={cellBase}>
                        {formatDate(detalle.fecha_uso) || "-"}
                      </div>
                      <div
                        className={`${cellBase} justify-start uppercase text-[9px]`}
                      >
                        {detalle.razon_social || "-"}
                      </div>
                      <div className={cellBase}>{detalle.ruc || "-"}</div>
                      <div className={cellBase}>
                        {formatDate(detalle.fecha_emision) || "-"}
                      </div>
                      <div className={`${cellBase} text-[9px]`}>
                        {detalle.tipo_comprobante || "-"}
                      </div>
                      <div className={cellBase}>
                        {detalle.numero_comprobante || "-"}
                      </div>
                      <div className={`${cellBase} text-[9px]`}>
                        {detalle.categoria || "-"}
                      </div>
                      <div className={`${cellBase} justify-start text-[9px]`}>
                        {detalle.detalle || "-"}
                      </div>
                      <div
                        className={`${cellBase} font-bold text-slate-900 justify-end pr-2`}
                      >
                        S/ {numberPeru(detalle.importe || 0)}
                      </div>
                      <div className={`${cellBase} font-bold text-[11px]`}>
                        {detalle.estado}
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
                  /* Fallback por si una rendición no tiene comprobantes guardados */
                  <>
                    <div className={cellBase}>-</div>
                    <div className={cellBase}>-</div>
                    <div className={cellBase}>-</div>
                    <div className={cellBase}>-</div>
                    <div className={cellBase}>-</div>
                    <div className={cellBase}>-</div>
                    <div className={cellBase}>-</div>
                    <div className={cellBase}>-</div>
                    <div className={cellBase}>S/ 0.00</div>
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ================= RESUMEN DE TOTALES ================= */}
      <div className="flex gap-6 justify-end items-center rounded-lg p-4 bg-slate-50 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-600 uppercase text-xs">
            Total General Gastos:
          </span>
          <div className="bg-white border-b-2 border-slate-900 px-4 py-1 rounded font-black text-slate-900 text-sm shadow-sm">
            S/ {numberPeru(totalGeneralGastos)}
          </div>
        </div>
      </div>
      <SolicitarAnularRendicion
        key={selectedId}
        id={selectedId}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};

export default TablaHistoricoRendicion;
