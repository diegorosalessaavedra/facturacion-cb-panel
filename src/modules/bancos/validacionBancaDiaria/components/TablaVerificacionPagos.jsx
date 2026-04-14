import React, { useState } from "react";
import { Spinner, Button, useDisclosure } from "@nextui-org/react";
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

  const stickyHeader = "sticky top-0 z-20";
  const headerBase =
    "flex items-center justify-center font-bold text-[10px] uppercase tracking-wider py-3 px-2 text-center border-r border-b border-slate-400";
  const headerDark = `${headerBase} bg-slate-900 text-white`;

  const cellBase =
    "flex items-center justify-center text-[11px] py-2 px-2 border-r border-b border-slate-300 min-h-[50px]";
  const cellData = `${cellBase} bg-white text-slate-700 font-medium`;
  const cellHighlight = `${cellBase} bg-slate-50 text-slate-900 font-bold`;

  // Tienes exactamente 6 columnas aquí
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
    <div className="w-full h-[75vh] overflow-auto shadow-md rounded-lg bg-white relative border border-slate-300">
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <Spinner label="Cargando..." color="success" />
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: gridTemplate }}>
          {/* === CABECERAS (6 Columnas) === */}
          <div className={headerDark + " " + stickyHeader}>#</div>
          <div className={headerDark + " " + stickyHeader}>
            Fecha de Despacho
          </div>
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

            return (
              <React.Fragment key={cot.id}>
                {/* 1. # */}
                <div className={cellData} style={rowSpan}>
                  {index + 1}
                </div>
                {/* 2. Fecha */}
                <div className={cellData} style={rowSpan}>
                  {formatDate(cot.fechaEmision)}
                </div>
                {/* 3. Vendedor */}
                <div className={`${cellData} text-[10px]`} style={rowSpan}>
                  {cot.vendedor}
                </div>
                {/* 4. Cliente */}
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
                {/* 5. Total */}
                <div
                  className={`${cellHighlight} text-blue-700`}
                  style={rowSpan}
                >
                  S/. {formatNumber(cot.saldoInicial)}
                </div>

                {/* COLUMNA DE PAGOS */}
                {cot.pagos && cot.pagos.length > 0 ? (
                  cot.pagos.map((pago) => {
                    const statusClass =
                      pago.estado_verificacion === "Conforme"
                        ? "bg-green-50 border-l-green-300 text-green-900"
                        : pago.estado_verificacion === "Observado"
                          ? "bg-amber-50 border-l-amber-300 text-amber-900"
                          : "bg-red-50 border-l-red-300 text-red-900";

                    return (
                      <React.Fragment key={pago.id}>
                        {/* 6. Detalle de Pagos (Se repite por cada pago) */}
                        <div
                          className={`${cellBase} ${statusClass} border-l-2 justify-between px-3`}
                        >
                          <div className="w-32 flex flex-col gap-0">
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

                          <div className="flex gap-2">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="flat"
                              className="h-7 w-7 min-w-7 bg-slate-900 text-white shadow-sm shadow-slate-900/30"
                              onPress={() => handleReiniciar(pago)}
                            >
                              <RiResetLeftFill size={14} />
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="flat"
                              className="h-7 w-7 min-w-7 bg-slate-900 text-white shadow-sm shadow-slate-900/30"
                              onPress={() => handleVerHistorial(pago)}
                            >
                              <IoTimeSharp size={14} />
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="flat"
                              className="h-7 w-7 min-w-7 bg-slate-900 text-white shadow-sm shadow-slate-900/30"
                              onPress={() => handleSeeMore(pago)}
                            >
                              <Eye size={14} />
                            </Button>
                          </div>
                        </div>
                        {/* Se eliminó la celda extra de Estado que estaba rompiendo el grid aquí */}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <>
                    {/* 6. Detalle de Pagos (Vacío) */}
                    <div className={`${cellData} italic text-slate-400`}>
                      Sin pagos registrados
                    </div>
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
      {selectModal === "ver_pago" && selectPago && (
        <ModalVerPago
          key={selectPago.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          selectPago={selectPago}
          handleFindCotizaciones={handleFindCotizaciones}
        />
      )}
      {selectModal === "ver_historial" && selectPago && (
        <ModalVerHistorialValidacionPago
          key={selectPago.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          selectPago={selectPago}
          handleFindCotizaciones={handleFindCotizaciones}
        />
      )}
      {selectModal === "reiniciar" && selectPago && (
        <ModalReiniciarPago
          key={selectPago.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          selectPago={selectPago}
        />
      )}
    </div>
  );
};

export default TablaVerificacionPagos;
