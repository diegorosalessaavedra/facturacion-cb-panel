import React from "react";
import FilaPrincipal from "./components/FilaPrincipal";
import TbodyAdicionales from "./components/TbodyAdicionales";

const TablaResumenPlantilla = ({
  colaboradores,
  semana_id,
  dataSemana,
  setSelectColaborador,
  onOpen,
  isOpen,
  totalSemanas,
}) => {
  const isFinalizado = dataSemana?.estado_planilla !== "EN PROCESO";

  const handleColaboradorClick = (id) => {
    setSelectColaborador(id);
    onOpen();
  };

  // --- LÓGICA DE CONTENEDORES CON BLOQUEO (DISABLED) ---
  // Si está finalizado, bloqueamos eventos de mouse y reducimos opacidad
  const mainWrapperClass = `flex flex-col xl:flex-row items-start gap-5 w-full mt-4 pb-4 max-h-[600px] overflow-y-auto custom-scrollbar transition-all duration-300 ${isFinalizado && "opacity-80"}`;

  const tableContainerClass =
    "shadow-md border border-slate-200 rounded-xl bg-white overflow-x-auto";

  // --- CLASES DE CABECERA ---
  const thInfo =
    "bg-slate-900 border-r border-sky-950 px-3 py-2 font-bold uppercase text-[10px] tracking-wider text-slate-100 whitespace-nowrap text-center";

  const thFinance =
    "bg-green-600 border-r border-green-700 px-3 py-2 font-bold uppercase text-[10px] tracking-wider text-slate-100 whitespace-nowrap text-center";

  const thTotal =
    "bg-amber-600 px-3 py-2 font-extrabold uppercase text-[10px] tracking-wider text-white whitespace-nowrap text-center shadow-inner";

  const thExtra =
    "bg-slate-900 border-r border-slate-900 px-3 py-2 font-bold uppercase text-[10px] tracking-wider text-slate-100 whitespace-nowrap text-center";
  const thExtraLast =
    "bg-slate-900 px-3 py-2 font-bold uppercase text-[10px] tracking-wider text-slate-100 whitespace-nowrap text-center";

  return (
    <div className={mainWrapperClass}>
      {/* --- TABLA 1: DATOS PRINCIPALES --- */}
      <div className={`flex-1 ${tableContainerClass}`}>
        <table className="w-full border-collapse relative">
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr className="h-[35px]">
              <th className={thInfo}>REGIMEN</th>
              <th className={thInfo}>GRUPO</th>
              <th className={thInfo}>APELLIDOS Y NOMBRES</th>
              <th className={thInfo}>DNI</th>
              <th className={thInfo}>BCO</th>
              <th className={thInfo}>Nº CUENTA BCO</th>

              <th className={thFinance}>BRUTO</th>
              <th className={thFinance}>ASIG. FAM</th>
              <th className={thFinance}>ONP - AFP</th>
              <th className={thFinance}>DESCUENTOS</th>

              <th className={thTotal}>TOTAL POR PAGAR</th>
            </tr>
          </thead>
          <tbody>
            {!colaboradores || colaboradores.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="text-center h-[60px] p-3 text-slate-500 bg-slate-50 text-sm font-medium"
                >
                  No hay colaboradores registrados.
                </td>
              </tr>
            ) : (
              colaboradores.map((colaborador) => (
                <FilaPrincipal
                  key={colaborador.id}
                  colaborador={colaborador}
                  semana_id={semana_id}
                  handleColaboradorClick={handleColaboradorClick}
                  isOpen={isOpen}
                  totalSemanas={totalSemanas}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- TABLA 2: ADICIONALES Y DESTINO --- */}
      <div className={`shrink-0 w-[200px] ${tableContainerClass}`}>
        <table className="w-full border-collapse relative">
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr className="h-[35px]">
              <th className={thExtra}>ADICIONALES</th>
              <th className={thExtraLast}>Nº DESTINO</th>
            </tr>
          </thead>
          <tbody>
            {!colaboradores || colaboradores.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="text-center h-[60px] p-3 text-slate-500 bg-slate-50 text-sm font-medium"
                >
                  -
                </td>
              </tr>
            ) : (
              colaboradores.map((colaborador) => (
                <TbodyAdicionales
                  key={colaborador.id}
                  colaborador={colaborador}
                  semana_id={semana_id}
                  isOpen={isOpen}
                  isFinalizado={isFinalizado}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaResumenPlantilla;
