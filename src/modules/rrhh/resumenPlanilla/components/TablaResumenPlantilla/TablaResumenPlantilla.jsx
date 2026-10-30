import React, { useState } from "react";
import FilaPrincipal from "./components/FilaPrincipal";
import TbodyAdicionales from "./components/TbodyAdicionales";
import TbodyValidacion from "./components/TbodyValidacion";

// Helper simple para moneda
const formatMoney = (amount) => `S/ ${Number(amount || 0).toFixed(2)}`;

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

  // ESTADO PARA ALMACENAR LOS TOTALES DE CADA COLABORADOR
  const [totalesTabla, setTotalesTabla] = useState({});

  const handleColaboradorClick = (id) => {
    setSelectColaborador(id);
    onOpen();
  };

  // FUNCIÓN PARA RECIBIR LOS DATOS DE LOS COMPONENTES HIJOS
  const handleTotalesCalculados = (colaboradorId, nuevosTotales) => {
    setTotalesTabla((prev) => {
      // Solo actualizamos si hay cambios reales para evitar renders infinitos
      const prevData = prev[colaboradorId] || {};
      const hasChanged = Object.keys(nuevosTotales).some(
        (key) => prevData[key] !== nuevosTotales[key],
      );
      if (!hasChanged) return prev;

      return {
        ...prev,
        [colaboradorId]: { ...prevData, ...nuevosTotales },
      };
    });
  };

  // CÁLCULO DEL GRAN TOTAL SUMANDO TODOS LOS REGISTROS
  const granTotal = Object.values(totalesTabla).reduce(
    (acc, curr) => ({
      bruto: acc.bruto + (curr.bruto || 0),
      asigFam: acc.asigFam + (curr.asigFam || 0),
      onpAfp: acc.onpAfp + (curr.onpAfp || 0),
      descuentos: acc.descuentos + (curr.descuentos || 0),
      totalPagar: acc.totalPagar + (curr.totalPagar || 0),
      adicionales: acc.adicionales + (curr.adicionales || 0),
    }),
    {
      bruto: 0,
      asigFam: 0,
      onpAfp: 0,
      descuentos: 0,
      totalPagar: 0,
      adicionales: 0,
    },
  );

  const mainWrapperClass = `flex flex-col xl:flex-row items-start gap-2 w-full mt-4 pb-4 max-h-[600px] overflow-y-auto overflow-x-auto custom-scrollbar transition-all duration-300 ${
    isFinalizado && "opacity-80"
  }`;

  const tableContainerClass =
    "shadow-md border border-slate-200 rounded-xl bg-white";

  // --- CLASES DE CABECERA Y FOOTER ---
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
  const thBlue =
    "bg-blue-300 border-r border-blue-400 px-2 py-2 font-bold uppercase text-[9px] tracking-wider text-slate-900 whitespace-nowrap text-center";
  const thBlueLast =
    "bg-blue-300 px-2 py-2 font-bold uppercase text-[9px] tracking-wider text-slate-900 text-center";

  const tfootClass =
    "sticky bottom-0 z-20 bg-slate-800 shadow-[0_-2px_4px_rgba(0,0,0,0.1)] border-t-2 border-slate-300 text-[10px]";

  return (
    <div className={mainWrapperClass}>
      {/* --- TABLA 1: DATOS PRINCIPALES --- */}
      <div className={`flex-1 w-full ${tableContainerClass}`}>
        <table className="w-full border-collapse relative">
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr className="h-[43px]">
              <th className={`${thInfo} rounded-tl-xl`}>REGIMEN</th>
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
              <th className={`${thTotal} rounded-tr-xl`}>
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
                  onTotalesCalculados={handleTotalesCalculados} // PASAMOS EL CALLBACK
                />
              ))
            )}
          </tbody>
          {/* FOOTER TOTALES TABLA 1 */}
          <tfoot className={tfootClass}>
            <tr className="h-[38px]">
              <td
                colSpan={6}
                className="text-right font-extrabold pr-4 text-slate-100 rounded-bl-xl"
              >
                TOTALES GENERALES:
              </td>
              <td className="text-center font-bold text-green-500 border-r border-slate-300">
                {formatMoney(granTotal.bruto)}
              </td>
              <td className="text-center font-bold text-green-500 border-r border-slate-300">
                {formatMoney(granTotal.asigFam)}
              </td>
              <td className="text-center font-bold text-red-500 border-r border-slate-300">
                {formatMoney(granTotal.onpAfp)}
              </td>
              <td className="text-center font-bold text-red-500 border-r border-slate-300">
                {formatMoney(granTotal.descuentos)}
              </td>
              <td className="text-center font-extrabold text-amber-500  rounded-br-xl">
                {formatMoney(granTotal.totalPagar)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* --- TABLA 2: ADICIONALES Y DESTINO --- */}
      <div className={`shrink-0 w-[200px] ${tableContainerClass}`}>
        <table className="w-full border-collapse relative">
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr className="h-[43px]">
              <th className={`${thExtra} rounded-tl-xl`}>
                <span className="text-sm">+</span> ADICIONALES
              </th>
              <th className={`${thExtraLast} rounded-tr-xl`}>Nº DESTINO</th>
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
                  onTotalesCalculados={handleTotalesCalculados}
                />
              ))
            )}
          </tbody>
          {/* FOOTER TOTALES TABLA 2 */}
          <tfoot className={tfootClass}>
            <tr className="h-[38px]">
              <td className="text-center font-bold text-green-500 border-r border-slate-300 rounded-bl-xl">
                {formatMoney(granTotal.adicionales)}
              </td>
              <td className="rounded-br-xl"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* --- TABLA 3: VALIDACIÓN Y PAGO MASIVO --- */}
      <div className={`shrink-0 w-[180px] ${tableContainerClass}`}>
        <table className="w-full border-collapse relative">
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr className="h-[35px]">
              <th className={`${thBlue} rounded-tl-xl`}>VALIDACIÓN</th>
              <th className={`${thBlueLast} rounded-tr-xl`}>
                ENVIAR A PAGO MASIVO
              </th>
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
          {/* FOOTER VACÍO PARA ALINEAR ALTURAS */}
          <tfoot className={tfootClass}>
            <tr className="h-[38px]">
              <td colSpan={2} className="rounded-b-xl"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TablaResumenPlantilla;
