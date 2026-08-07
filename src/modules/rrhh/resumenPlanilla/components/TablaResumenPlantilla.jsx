import React from "react";
import { Tooltip } from "@nextui-org/react";

const TablaResumenPlantilla = ({
  colaboradores,
  setSelectModal, // Si no lo usas aquí, puedes quitarlo
  setSelectColaborador,
  onOpen,
}) => {
  // Función más limpia para manejar el clic
  const handleColaboradorClick = (id) => {
    setSelectColaborador(id);
    onOpen();
  };

  return (
    <div className="flex-1 overflow-auto border border-slate-200 rounded-xl bg-white shadow-sm mt-4 custom-scrollbar">
      <table className="w-full border-collapse text-center">
        <thead className="sticky top-0 bg-slate-900 z-10 shadow-md">
          <tr>
            <th className="border-r border-slate-700 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-200 whitespace-nowrap">
              APELLIDOS Y NOMBRES
            </th>
            <th className="border-r border-slate-700 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-200 whitespace-nowrap">
              GRUPO
            </th>
            <th className="border-r border-slate-700 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-200 whitespace-nowrap">
              Nº DOC
            </th>
            <th className="border-r border-slate-700 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-200 whitespace-nowrap">
              BCO
            </th>
            <th className="border-r border-slate-700 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-200 whitespace-nowrap">
              Nº CUENTA BCO
            </th>
            <th className="border-r border-slate-700 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-200 whitespace-nowrap">
              SEMANA
            </th>
            <th className="border-r border-slate-700 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-200 whitespace-nowrap">
              ADICIONAL INAFECTO
            </th>
            <th className="p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-200 whitespace-nowrap">
              Nº TELEFONO
            </th>
          </tr>
        </thead>
        <tbody className="align-middle">
          {!colaboradores || colaboradores.length === 0 ? (
            <tr>
              <td
                colSpan={8} // CORREGIDO: De 3 a 8 columnas
                className="text-center p-8 text-slate-500 bg-slate-50 text-sm font-medium"
              >
                No hay colaboradores registrados.
              </td>
            </tr>
          ) : (
            colaboradores.map((colaborador) => (
              <tr
                key={colaborador.id}
                className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors group"
              >
                {/* NOMBRE CLICKABLE */}
                <td className="border-r border-slate-100 bg-white p-2 py-3 font-semibold text-slate-700 uppercase text-[10px] whitespace-nowrap text-left pl-4">
                  <Tooltip
                    content="Ver tareo de asistencias"
                    placement="right"
                    delay={500}
                  >
                    <span
                      className="cursor-pointer text-slate-600 hover:text-amber-600 hover:underline transition-colors block w-full"
                      onClick={() => handleColaboradorClick(colaborador.id)}
                    >
                      {colaborador.apellidos_colaborador}{" "}
                      {colaborador.nombre_colaborador}
                    </span>
                  </Tooltip>
                </td>

                {/* GRUPO CON BADGE DE COLOR */}
                <td className="border-r border-slate-100 bg-white p-2 font-medium text-slate-800 uppercase text-[10px] whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-[9px] font-bold ${
                      colaborador.cargo_laboral?.agrupacion_cargo ===
                      "ADMINISTRATIVOS"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {colaborador.cargo_laboral?.agrupacion_cargo || "-"}
                  </span>
                </td>

                <td className="border-r border-slate-100 bg-white p-2 font-medium text-slate-600 uppercase text-[10px] whitespace-nowrap">
                  {colaborador.dni_colaborador || "-"}
                </td>

                <td className="border-r border-slate-100 bg-white p-2 font-medium text-slate-600 uppercase text-[10px] whitespace-nowrap">
                  {colaborador.bco || "-"}
                </td>

                <td className="border-r border-slate-100 bg-white p-2 font-medium text-slate-600 uppercase text-[10px] whitespace-nowrap">
                  {colaborador.nro_cuenta || "-"}
                </td>

                {/* COLUMNAS VACÍAS (Antes repetían el nombre) */}
                <td className="border-r border-slate-100 bg-white p-2 font-medium text-slate-400 uppercase text-[10px] whitespace-nowrap">
                  -
                </td>

                <td className="border-r border-slate-100 bg-white p-2 font-medium text-slate-400 uppercase text-[10px] whitespace-nowrap">
                  -
                </td>

                <td className="bg-white p-2 font-medium text-slate-600 uppercase text-[10px] whitespace-nowrap">
                  {colaborador.telefono_colaborador || "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaResumenPlantilla;
