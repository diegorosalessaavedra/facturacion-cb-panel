import React from "react";
// Sugerencia: Renombrar TbodyPrincipales a FilaPrincipal ya que ahora renderiza un <tr>
import FilaPrincipal from "./components/FilaPrincipal";
import TbodyAdicionales from "./components/TbodyAdicionales";

const TablaResumenPlantilla = ({
  colaboradores,
  semana_id, // <- Recibes la semana
  setSelectColaborador,
  onOpen,
}) => {
  const handleColaboradorClick = (id) => {
    setSelectColaborador(id);
    onOpen();
  };

  const tableContainerClass =
    "shadow-md border border-slate-200 rounded-xl bg-white overflow-auto max-h-[600px] custom-scrollbar";

  const thClass =
    "bg-slate-900 border-r border-slate-700 px-3 py-2 font-semibold uppercase text-[10px] tracking-wider text-slate-200 whitespace-nowrap text-center";

  const thLastClass =
    "bg-slate-900 px-3 py-2 font-semibold uppercase text-[10px] tracking-wider text-slate-200 whitespace-nowrap text-center";

  return (
    <div className="flex flex-col xl:flex-row items-start gap-5 w-full mt-4 pb-4">

      {/* --- TABLA 1: DATOS PRINCIPALES --- */}
      <div className={`flex-1 ${tableContainerClass}`}>
        <table className="w-full border-collapse relative">
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr className="h-[35px]">
              <th className={thClass}>REGIMEN</th>
              <th className={thClass}>GRUPO</th>
              <th className={thClass}>APELLIDOS Y NOMBRES</th>
              <th className={thClass}>DNI</th>
              <th className={thClass}>BCO</th>
              <th className={thClass}>Nº CUENTA BCO</th>
              <th className={thClass}>BRUTO</th>
              <th className={thClass}>ASIG. FAM</th>
              <th className={thClass}>ONP - AFP</th>
              <th className={thClass}>DESCUENTOS</th>
              <th className={thLastClass}>TOTAL POR PAGAR</th>
            </tr>
          </thead>
          <tbody>
            {!colaboradores || colaboradores.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center h-[60px] p-3 text-slate-500 bg-slate-50 text-sm font-medium">
                  No hay colaboradores registrados.
                </td>
              </tr>
            ) : (
              colaboradores.map((colaborador) => (
                <FilaPrincipal
                  key={colaborador.id}
                  colaborador={colaborador}
                  semana_id={semana_id} // <- Pasamos el id de la semana a la fila
                  handleColaboradorClick={handleColaboradorClick}
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
              <th className={thClass}>ADICIONALES</th>
              <th className={thLastClass}>Nº DESTINO</th>
            </tr>
          </thead>
          <tbody>
            {!colaboradores || colaboradores.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center h-[60px] p-3 text-slate-500 bg-slate-50 text-sm font-medium">
                  -
                </td>
              </tr>
            ) : (
              colaboradores.map((colaborador) => (
                <TbodyAdicionales
                  key={colaborador.id}
                  colaborador={colaborador}
                  semana_id={semana_id} // <- Pasamos el id de la semana a la fila

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