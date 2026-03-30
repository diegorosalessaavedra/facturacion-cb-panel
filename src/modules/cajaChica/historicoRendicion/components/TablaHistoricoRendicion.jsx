import React, { useState } from "react";
import { numberPeru } from "../../../../assets/onInputs";
import formatDate from "../../../../hooks/FormatDate";
import { Button, Tooltip, useDisclosure } from "@nextui-org/react";
import { generarPDFRendiciones } from "../../../../utils/plantillasPdf/generarPDFRendiciones";
import SolicitarAnularRendicion from "./SolicitarAnularRendicion";
import { Trash2 } from "lucide-react";
import CargarSustentoRendicion from "./CargarSustentoRendicion";

const stickyHeader = "sticky top-0 z-20";
const stickySubHeader = "sticky top-[30px] z-20";

const headerBase =
  "flex items-center justify-center font-bold text-[9px] uppercase tracking-wider py-2 px-1 text-center border-r border-b border-slate-400";

const headerDark = `${headerBase} bg-slate-900 text-white`;

const cellBase =
  "flex items-center justify-center text-[10px] font-medium border-r border-b border-slate-300 min-h-[40px] h-full px-2 text-slate-700 bg-white text-center";

const TablaHistoricoRendicion = ({
  rendiciones = [],
  handleFindRendiciones,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenSustento,
    onOpen: onOpenSustento,
    onOpenChange: onOpenChangeSustento,
  } = useDisclosure();

  const [selectRendicion, setSelectedRendicion] = useState(null);

  const totalGeneralGastos = rendiciones.reduce(
    (acc, curr) => acc + Number(curr.total_gastos || 0),
    0,
  );

  const handleRemove = (item) => {
    setSelectedRendicion(item);
    onOpen();
  };

  const handleSustento = (item) => {
    setSelectedRendicion(item);
    onOpenSustento();
  };

  return (
    <div className="relative w-full h-full flex flex-col gap-2 overflow-hidden">
      <div className="flex-1 w-full  pb-4 overflow-auto shadow-md rounded-lg bg-white relative border border-slate-300">
        <div
          className="grid"
          style={{
            gridTemplateColumns:
              "40px 90px 220px 110px 180px 130px 80px 80px 80px 220px 90px 80px 100px 100px 100px 140px 180px 90px 100px  100px 40px",
            gridAutoRows: "max-content",
          }}
        >
          {/* ================= ENCABEZADOS ================= */}
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
            MONTO REC.
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            FECHA REC.
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            FECHA USO
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            PROVEEDOR
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>RUC</div>
          <div
            className={`col-span-3 ${headerDark} ${stickyHeader} border-b-0`}
          >
            COMPROBANTE
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            CATEGORIA
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            DETALLE
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            IMPORTE S/
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            ESTADO
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            RESULTADO
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            SUSTENTO
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>-</div>

          {/* SUB-ENCABEZADOS COMPROBANTE */}
          <div className={`${headerDark} ${stickySubHeader} left-0`}>
            FECHA EMIS.
          </div>
          <div className={`${headerDark} ${stickySubHeader}`}>TIPO</div>
          <div className={`${headerDark} ${stickySubHeader}`}>NÚMERO</div>

          {/* ================= CUERPO DE LA TABLA ================= */}
          {rendiciones.map((item, index) => {
            const detalles = item.datos_rendicion || [];
            const filasOcupadas = detalles.length > 0 ? detalles.length : 1;
            const spanStyle = { gridRow: `span ${filasOcupadas}` };

            return (
              <React.Fragment key={item.id}>
                {/* COLUMNAS AGRUPADAS (IZQUIERDA) */}
                <div
                  className={`${cellBase} font-bold text-slate-500`}
                  style={spanStyle}
                >
                  {index + 1}
                </div>
                <div
                  className={`${cellBase} font-semibold cursor-pointer`}
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
                  {item.desembolso?.rutas_desembolso || "-"}
                </div>
                <div className={`${cellBase} font-bold`} style={spanStyle}>
                  {item.monto_recibido
                    ? `S/ ${numberPeru(item.monto_recibido)}`
                    : "-"}
                </div>
                <div className={cellBase} style={spanStyle}>
                  {formatDate(item.fecha_recibida) || "-"}
                </div>

                {/* SECCIÓN DETALLE (RENDERIZADO FILA POR FILA) */}
                {detalles.length > 0 ? (
                  detalles.map((detalle, dIndex) => (
                    <React.Fragment key={detalle.id || dIndex}>
                      {/* Columnas del detalle individual (sin span) */}
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

                      {/* 🛠️ LA CLAVE: Estado y Botón de Eliminar solo en la primera fila del bloque */}
                      {dIndex === 0 && (
                        <>
                          <div
                            className={`${cellBase} font-bold text-[11px]`}
                            style={spanStyle}
                          >
                            <p
                              className={`${
                                item.estado === "ACTIVO"
                                  ? "text-green-600"
                                  : "text-red-500"
                              }`}
                            >
                              {item.estado}
                            </p>
                          </div>
                          <div
                            className={`${cellBase} font-bold text-[11px]`}
                            style={spanStyle}
                          >
                            {item.por_devolver > 0 ? (
                              <p className="text-red-600">
                                A devolver S/ {numberPeru(item.por_devolver)}
                              </p>
                            ) : item.por_reembolsar > 0 ? (
                              <p className="text-blue-600">
                                Por reembolsar S/{" "}
                                {numberPeru(item.por_reembolsar)}
                              </p>
                            ) : (
                              <p className="text-emerald-600">Completo</p>
                            )}
                          </div>
                          <div className={`${cellBase} `} style={spanStyle}>
                            <Button
                              className="bg-slate-800 text-white"
                              size="sm"
                              onPress={() => handleSustento(item)}
                            >
                              Ver Sustento
                            </Button>
                          </div>
                          <div
                            className={`${cellBase} cursor-pointer hover:bg-red-50 transition-colors group`}
                            style={spanStyle}
                            onClick={() => handleRemove(item)}
                          >
                            <Tooltip
                              content="Eliminar Rendición"
                              color="danger"
                              showArrow={true}
                              size="sm"
                            >
                              <Trash2
                                size={16}
                                className="text-slate-400 group-hover:text-red-500 transition-colors"
                              />
                            </Tooltip>
                          </div>
                        </>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <>
                    {/* Caso cuando no hay detalles (Rendición vacía) */}
                    <div className={cellBase}>-</div>
                    <div className={cellBase}>-</div>
                    <div className={cellBase}>-</div>
                    <div className={cellBase}>-</div>
                    <div className={cellBase}>-</div>
                    <div className={cellBase}>-</div>
                    <div className={cellBase}>-</div>
                    <div className={cellBase}>-</div>
                    <div
                      className={`${cellBase} font-bold text-slate-900 justify-end pr-2`}
                    >
                      S/ 0.00
                    </div>
                    {/* Se muestran el estado y el trash si no hay detalles */}
                    <div
                      className={`${cellBase} font-bold text-[11px]`}
                      style={spanStyle}
                    >
                      <p
                        className={`${
                          item.estado === "ACTIVO"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {item.estado}
                      </p>
                    </div>
                    <div
                      className={`${cellBase} font-bold text-[11px]`}
                      style={spanStyle}
                    >
                      {item.por_devolver > 0 ? (
                        <p className="text-red-600">
                          A devolver S/ {numberPeru(item.por_devolver)}
                        </p>
                      ) : item.por_reembolsar > 0 ? (
                        <p className="text-blue-600">
                          Por reembolsar S/ {numberPeru(item.por_reembolsar)}
                        </p>
                      ) : (
                        <p className="text-emerald-600">Completo</p>
                      )}
                    </div>
                    <div className={`${cellBase} `} style={spanStyle}>
                      <Button
                        className="bg-slate-800 text-white"
                        size="sm"
                        onPress={() => handleSustento(item)}
                      >
                        Ver Sustento
                      </Button>
                    </div>
                    <div
                      className={`${cellBase} cursor-pointer hover:bg-red-50 transition-colors`}
                      style={spanStyle}
                      onClick={() => handleRemove(item)}
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </div>
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* RESUMEN DE TOTALES */}
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
        key={selectRendicion?.id}
        id={selectRendicion?.id}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSuccess={handleFindRendiciones}
      />

      <CargarSustentoRendicion
        key={selectRendicion?.id}
        selectRendicion={selectRendicion}
        isOpen={isOpenSustento}
        onOpenChange={onOpenChangeSustento}
        onSuccess={handleFindRendiciones}
      />
    </div>
  );
};

export default TablaHistoricoRendicion;
