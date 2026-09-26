import React from "react";
import FilaPrincipal from "./components/FilaPrincipal";
import TbodyAdicionales from "./components/TbodyAdicionales";
import TbodyValidacion from "./components/TbodyValidacion";

const TablaResumenPlantilla = ({
  colaboradores,
  semana_id,
  dataSemana,
  setSelectColaborador,
  onOpen,
  isOpen,
  totalSemanas,
  setSelectDatosText,
}) => {
  const isFinalizado = dataSemana?.estado_planilla !== "EN PROCESO";

  const handleColaboradorClick = (id) => {
    setSelectColaborador(id);
    onOpen();
  };

  const mainWrapperClass = `flex flex-col xl:flex-row items-start gap-2 w-full mt-4 pb-4 max-h-[600px] overflow-y-auto custom-scrollbar transition-all duration-300 ${isFinalizado && "opacity-80"}`;

  const tableContainerClass =
    "shadow-md border border-slate-200 rounded-xl bg-white overflow-x-auto";

  // --- CLASES DE CABECERA ---
  const thInfo =
    "bg-slate-900 border-r border-sky-950 px-2 py-2 font-bold uppercase text-[10px] tracking-wider text-slate-100 whitespace-nowrap text-center";

  const thFinance =
    "bg-green-600 border-r border-green-700 px-2 py-2 font-bold uppercase text-[10px] tracking-wider text-slate-100 whitespace-nowrap text-center";

  const thTotal =
    "bg-amber-600 px-2 py-2 font-extrabold uppercase text-[9px] tracking-wider text-white whitespace-nowrap text-center shadow-inner";

  const thExtra =
    "bg-slate-900 border-r border-slate-900 px-2 py-2 font-bold uppercase text-[9px] tracking-wider text-slate-100 whitespace-nowrap text-center";

  const thExtraLast =
    "bg-slate-900 px-2 py-2 font-bold uppercase text-[9px] tracking-wider text-slate-100 whitespace-nowrap text-center";

  // Clases para la nueva tabla de Validación
  const thBlue =
    "bg-blue-300 border-r border-blue-400 px-2 py-2 font-bold uppercase text-[9px] tracking-wider text-slate-900 whitespace-nowrap text-center";
  const thBlueLast =
    "bg-blue-300 px-2 py-2 font-bold uppercase text-[9px] tracking-wider text-slate-900  text-center";

  return (
    <div className={mainWrapperClass}>
      {/* --- TABLA 1: DATOS PRINCIPALES --- */}
      <div className={`flex-1 ${tableContainerClass}`}>
        <table className="w-full border-collapse relative">
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr className="h-[43px]">
              <th className={thInfo}>REGIMEN</th>
              <th className={thInfo}>GRUPO</th>
              <th className={thInfo}>APELLIDOS Y NOMBRES</th>
              <th className={thInfo}>DNI</th>
              <th className={thInfo}>BCO</th>
              <th className={thInfo}>Nº CUENTA BCO</th>

              <th className={thFinance}>
                <span className="text-sm">+</span> BRUTO
              </th>
              <th className={thFinance}>
                <span className="text-sm">+</span> ASIG. FAM
              </th>
              <th className={thFinance}>
                <span className="text-sm">-</span> ONP - AFP
              </th>
              <th className={thFinance}>
                <span className="text-sm">-</span> DESCUENTOS
              </th>

              <th className={thTotal}>
                <span className="text-sm">=</span> TOTAL POR PAGAR
              </th>
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
            <tr className="h-[43px]">
              <th className={thExtra}>
                <span className="text-sm">+</span> ADICIONALES
              </th>
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

      {/* --- TABLA 3: VALIDACIÓN Y PAGO MASIVO --- */}
      <div className={`shrink-0 w-[180px] ${tableContainerClass}`}>
        <table className="w-full border-collapse relative">
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr className="h-[35px]">
              <th className={thBlue}>VALIDACIÓN</th>
              <th className={thBlueLast}>ENVIAR A PAGO MASIVO</th>
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
                <TbodyValidacion
                  key={colaborador.id}
                  colaborador={colaborador}
                  semana_id={semana_id}
                  isFinalizado={isFinalizado}
                  totalSemanas={totalSemanas}
                  setSelectDatosText={setSelectDatosText}
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
