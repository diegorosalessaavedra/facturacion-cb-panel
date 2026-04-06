import React, { useState } from "react";
import { Spinner, Button, useDisclosure } from "@nextui-org/react";
import { Eye } from "lucide-react";
import formatDate from "../../../../hooks/FormatDate";
import { formatNumber } from "../../../../assets/formats";
import ModalVerPago from "./ModalVerPago";

const TablaVerificacionPagos = ({ cotizaciones, loading }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectPago, setSelectPago] = useState(null);

  const stickyHeader = "sticky top-0 z-20";
  const headerBase =
    "flex items-center justify-center font-bold text-[10px] uppercase tracking-wider py-3 px-2 text-center border-r border-b border-slate-400";
  const headerDark = `${headerBase} bg-slate-900 text-white`;

  const cellBase =
    "flex items-center justify-center text-[11px] py-2 px-2 border-r border-b border-slate-300 min-h-[50px]";
  const cellData = `${cellBase} bg-white text-slate-700 font-medium`;
  // const cellHighlight = `${cellBase} bg-slate-50 text-slate-900 font-bold`; // (sin uso actualmente)

  // CORRECCIÓN: Exactamente 7 columnas para coincidir con las cabeceras
  const gridTemplate = "40px 90px 120px 300px 1fr 120px 90px";

  const handleSeeMore = (pago) => {
    setSelectPago(pago);
    onOpen();
  };

  return (
    <div className="w-full h-[75vh] overflow-auto shadow-md rounded-lg bg-white relative border border-slate-300">
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <Spinner label="Cargando..." color="success" />
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: gridTemplate }}>
          {/* === CABECERAS === */}
          <div className={`${headerDark} ${stickyHeader}`}>#</div>
          <div className={`${headerDark} ${stickyHeader}`}>Fecha</div>
          <div className={`${headerDark} ${stickyHeader}`}>Vendedor</div>
          <div className={`${headerDark} ${stickyHeader}`}>Cliente</div>
          <div className={`${headerDark} ${stickyHeader}`}>
            Detalle de Pagos
          </div>
          <div className={`${headerDark} ${stickyHeader}`}>Comprobante</div>
          <div className={`${headerDark} ${stickyHeader}`}>Estado</div>

          {/* === CUERPO === */}
          {cotizaciones?.map((cot, index) => {
            const numPagos = cot.pagos?.length || 1;
            const rowSpan = { gridRowEnd: `span ${numPagos}` };

            return (
              <React.Fragment key={cot.id}>
                <div className={cellData} style={rowSpan}>
                  {index + 1}
                </div>
                <div className={cellData} style={rowSpan}>
                  {formatDate(cot.fechaEmision)}
                </div>
                <div className={`${cellData} text-[10px]`} style={rowSpan}>
                  {cot.vendedor}
                </div>
                <div
                  className={`${cellData} flex-col items-start text-left`}
                  style={rowSpan}
                >
                  <span className="font-bold">
                    {cot.cliente?.nombreApellidos ||
                      cot.cliente?.nombreComercial}
                  </span>
                  <span className="text-[9px] text-slate-500">
                    {cot.cliente?.numeroDoc}
                  </span>
                </div>

                {/* COLUMNA DE PAGOS Y COLUMNAS FINALES */}
                {cot.pagos && cot.pagos.length > 0 ? (
                  cot.pagos.map((pago, pIdx) => {
                    const isVerified = pago.datos_verificacion !== null;
                    const statusClass = isVerified
                      ? "bg-green-50 border-l-green-300 text-green-900"
                      : "bg-amber-50 border-l-amber-300 text-amber-900";

                    return (
                      <React.Fragment key={pago.id}>
                        {/* Columna 5: Pago individual (NO lleva rowSpan para que fluya en filas nuevas) */}
                        <div
                          className={`${cellBase} ${statusClass} border-l-2 justify-between px-3`}
                        >
                          <div className="flex flex-col gap-0">
                            <span className="text-[10px] font-bold uppercase">
                              {formatDate(pago.fecha)}
                            </span>
                            <span className="text-[12px] font-black">
                              S/. {formatNumber(pago.monto)}
                            </span>
                          </div>

                          <div className="flex flex-col items-center">
                            <span className="text-[9px] opacity-70">
                              Operación:
                            </span>
                            <span className="text-[10px] font-mono font-bold">
                              {pago.operacion || "---"}
                            </span>
                          </div>

                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            color={isVerified ? "success" : "warning"}
                            className="h-7 w-7 min-w-7"
                            onPress={() => handleSeeMore(pago)}
                          >
                            <Eye size={14} />
                          </Button>
                        </div>

                        {/* Columnas 6 y 7: Solo se pintan en la primera iteración del pago, abarcando todas las filas */}
                        {pIdx === 0 && (
                          <>
                            <div className={cellData} style={rowSpan}>
                              {cot.ComprobanteElectronico?.tipoComprobante ||
                                "Sin comprobante"}
                            </div>
                            <div
                              className={`${cellData} font-bold ${cot.status === "Activo" ? "text-green-600" : "text-red-600"}`}
                              style={rowSpan}
                            >
                              {cot.status}
                            </div>
                          </>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <>
                    <div className={`${cellData} italic text-slate-400`}>
                      Sin pagos registrados
                    </div>
                    <div className={cellData}>
                      {cot.ComprobanteElectronico?.tipoComprobante || "---"}
                    </div>
                    <div className={`${cellData} font-bold`}>{cot.status}</div>
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
      {selectPago && (
        <ModalVerPago
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          selectPago={selectPago}
        />
      )}
    </div>
  );
};

export default TablaVerificacionPagos;
