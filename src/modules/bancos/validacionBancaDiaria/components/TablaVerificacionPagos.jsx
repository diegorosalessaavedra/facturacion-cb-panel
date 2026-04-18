import React, { useState } from "react";
import { Spinner, Button, useDisclosure, Tooltip } from "@nextui-org/react";
import { Eye } from "lucide-react";
import formatDate from "../../../../hooks/FormatDate";
import { formatNumber } from "../../../../assets/formats";
import ModalVerPago from "./ModalVerPago";
import { MdHistory } from "react-icons/md";
import ModalVerHistorialValidacionPago from "./ModalVerHistorialValidacionPago";
import { RiResetLeftFill } from "react-icons/ri";
import { IoTimeSharp } from "react-icons/io5";
import ModalReiniciarPago from "./ModalReiniciarPago";

const TablaVerificacionPagos = ({
  cotizaciones,
  loading,
  handleFindCotizaciones,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectModal, setSelectModal] = useState("");
  const [selectPago, setSelectPago] = useState(null);

  // Clases optimizadas con paddings ajustados y bordes sutiles
  const stickyHeader = "sticky top-0 z-30 shadow-sm";
  const headerBase =
    "flex items-center justify-center font-bold text-[10px] uppercase tracking-wider py-2.5 px-2 text-center border-r border-slate-800";
  const headerDark = `${headerBase} bg-slate-900 text-white`;

  const cellBase =
    "flex items-center justify-center text-[11px] py-1.5 px-2 border-r border-b border-slate-200 min-h-[45px] transition-colors duration-300";
  const cellData = `${cellBase} bg-white text-black hover:bg-slate-50`;
  const cellHighlight = `${cellBase} bg-slate-50 text-black font-bold`;

  const gridTemplate = "40px 90px 120px 300px 90px 1fr";

  const handleSeeMore = (pago) => {
    setSelectModal("ver_pago");
    setSelectPago(pago);
    onOpen();
  };

  const handleVerHistorial = (pago) => {
    setSelectModal("ver_historial");
    setSelectPago(pago);
    onOpen();
  };

  const handleReiniciar = (pago) => {
    setSelectModal("reiniciar");
    setSelectPago(pago);
    onOpen();
  };

  return (
    <>
      {/* Estilos en línea para animaciones sin necesidad de configurar tailwind.config */}
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
      `}</style>

      <div className="w-full h-[75vh] overflow-auto shadow-lg rounded-xl bg-white relative border border-slate-200 scrollbar-hide">
        {loading ? (
          <div className="flex h-full items-center justify-center bg-white/50 backdrop-blur-sm z-50">
            <Spinner
              size="lg"
              color="danger"
              label="Cargando pagos..."
              labelColor="danger"
            />
          </div>
        ) : (
          <div
            className="grid bg-slate-200 gap-[1px]"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            {/* === CABECERAS === */}
            <div className={headerDark + " " + stickyHeader}>#</div>
            <div className={headerDark + " " + stickyHeader}>Fecha</div>
            <div className={headerDark + " " + stickyHeader}>Vendedor</div>
            <div className={headerDark + " " + stickyHeader}>Cliente</div>
            <div className={headerDark + " " + stickyHeader}>Total</div>
            <div className={`${headerDark} ${stickyHeader}`}>
              Detalle de Pagos
            </div>

            {/* === CUERPO === */}
            {cotizaciones?.map((cot, index) => {
              const numPagos = cot.pagos?.length || 1;
              const rowSpan = { gridRowEnd: `span ${numPagos}` };
              // Calculamos un pequeño retraso para que las filas entren en cascada
              const animationDelay = `${index * 0.05}s`;

              return (
                <React.Fragment key={cot.id}>
                  {/* 1. # */}
                  <div
                    className={`${cellData} animate-fade-in-up opacity-0`}
                    style={{ ...rowSpan, animationDelay }}
                  >
                    <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-mono text-[9px]">
                      {index + 1}
                    </span>
                  </div>
                  {/* 2. Fecha */}
                  <div
                    className={`${cellData} animate-fade-in-up opacity-0`}
                    style={{ ...rowSpan, animationDelay }}
                  >
                    {formatDate(cot.fechaEmision)}
                  </div>
                  {/* 3. Vendedor */}
                  <div
                    className={`${cellData} text-[10px] animate-fade-in-up opacity-0 text-slate-600`}
                    style={{ ...rowSpan, animationDelay }}
                  >
                    {cot.vendedor}
                  </div>
                  {/* 4. Cliente */}
                  <div
                    className={`${cellData} flex-col items-start justify-center text-left animate-fade-in-up opacity-0 px-4`}
                    style={{ ...rowSpan, animationDelay }}
                  >
                    <span className="font-bold text-black truncate w-full">
                      {cot.cliente?.nombreApellidos ||
                        cot.cliente?.nombreComercial}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono mt-0.5">
                      DOC: {cot.cliente?.numeroDoc}
                    </span>
                  </div>
                  {/* 5. Total */}
                  <div
                    className={`${cellHighlight} text-slate-900 animate-fade-in-up opacity-0`}
                    style={{ ...rowSpan, animationDelay }}
                  >
                    S/. {formatNumber(cot.saldoInicial)}
                  </div>

                  {/* COLUMNA DE PAGOS */}
                  {cot.pagos && cot.pagos.length > 0 ? (
                    cot.pagos.map((pago, pIndex) => {
                      // Estilos basados en tu paleta
                      const statusClass =
                        pago.estado_verificacion === "Conforme"
                          ? "bg-white border-l-slate-900 hover:bg-slate-50"
                          : pago.estado_verificacion === "Observado"
                            ? "bg-amber-50/50 border-l-amber-500 hover:bg-amber-50"
                            : "bg-red-50/50 border-l-red-600 hover:bg-red-50";

                      const statusText =
                        pago.estado_verificacion === "Observado"
                          ? "text-amber-700"
                          : pago.estado_verificacion === "Rechazado"
                            ? "text-red-700"
                            : "text-slate-500";

                      return (
                        <div
                          key={pago.id}
                          className={`${cellBase} ${statusClass} border-l-[3px] justify-between px-4 animate-fade-in-up opacity-0 group`}
                          style={{
                            animationDelay: `${index * 0.05 + pIndex * 0.02}s`,
                          }}
                        >
                          {/* Info Monto y Fecha */}
                          <div className="w-28 flex flex-col items-start">
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider ${statusText}`}
                            >
                              {formatDate(pago.fecha)}
                            </span>
                            <span className="text-[13px] font-black text-black">
                              S/. {formatNumber(pago.monto)}
                            </span>
                          </div>

                          {/* Operación */}
                          <div className="flex flex-col items-center justify-center flex-1">
                            <span className="text-[8px] uppercase tracking-widest text-slate-400 mb-0.5">
                              Operación
                            </span>
                            <span className="text-[11px] font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                              {pago.operacion || "---"}
                            </span>
                          </div>

                          {/* Botones de Acción */}
                          <div className="flex gap-1.5 ml-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                            <Tooltip
                              content="Reiniciar"
                              placement="top"
                              size="sm"
                              color="warning"
                              closeDelay={0}
                            >
                              <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                className="h-7 w-7 min-w-7 bg-white border border-slate-200 text-amber-600 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all shadow-sm"
                                onPress={() => handleReiniciar(pago)}
                              >
                                <RiResetLeftFill size={14} />
                              </Button>
                            </Tooltip>

                            <Tooltip
                              content="Historial"
                              placement="top"
                              size="sm"
                              className="bg-slate-900 text-white"
                              closeDelay={0}
                            >
                              <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                className="h-7 w-7 min-w-7 bg-white border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                                onPress={() => handleVerHistorial(pago)}
                              >
                                <IoTimeSharp size={14} />
                              </Button>
                            </Tooltip>

                            <Tooltip
                              content="Validar"
                              placement="top"
                              size="sm"
                              color="danger"
                              closeDelay={0}
                            >
                              <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                className="h-7 w-7 min-w-7 bg-white border border-slate-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm"
                                onPress={() => handleSeeMore(pago)}
                              >
                                <Eye size={14} />
                              </Button>
                            </Tooltip>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div
                      className={`${cellData} italic text-slate-400 animate-fade-in-up opacity-0`}
                      style={{ animationDelay }}
                    >
                      <span className="bg-slate-50 px-3 py-1 rounded-full border border-slate-200 text-[10px]">
                        Sin pagos registrados
                      </span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Modales */}
        {selectModal === "ver_pago" && selectPago && (
          <ModalVerPago
            key={`ver-${selectPago.id}`}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            selectPago={selectPago}
            handleFindCotizaciones={handleFindCotizaciones}
          />
        )}
        {selectModal === "ver_historial" && selectPago && (
          <ModalVerHistorialValidacionPago
            key={`hist-${selectPago.id}`}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            selectPago={selectPago}
            handleFindCotizaciones={handleFindCotizaciones}
          />
        )}
        {selectModal === "reiniciar" && selectPago && (
          <ModalReiniciarPago
            key={`re-${selectPago.id}`}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            selectPago={selectPago}
            handleFindCotizaciones={handleFindCotizaciones}
          />
        )}
      </div>
    </>
  );
};

export default TablaVerificacionPagos;
