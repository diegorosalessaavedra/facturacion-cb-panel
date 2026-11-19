import { Button, Tooltip } from "@nextui-org/react";
import { FiEdit, FiEye, FiPlus, FiInbox } from "react-icons/fi";
import { formatearMontoPe } from "../../../../assets/formats";

const TablaUit = ({ uits, setSelectModal, onOpen, setSelectUit }) => {
  const handleNuevaUit = () => {
    setSelectModal("nueva_uit");
    onOpen();
  };

  const handleEditarUit = (uit) => {
    setSelectUit(uit);
    setSelectModal("editar_uit");
    onOpen();
  };

  const handleVerTramos = (uit) => {
    setSelectUit(uit);
    setSelectModal("tramos_uit");
  };

  return (
    <div className="w-[360px] flex flex-col border border-slate-200/80 mt-2 rounded-2xl bg-white shadow-sm overflow-hidden">
      {/* Cabecera de la tarjeta */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
        <div>
          <h3 className="text-sm font-bold text-slate-800 leading-tight">
            Valores UIT
          </h3>
          <p className="text-[11px] text-slate-400">
            {uits?.length || 0} registros
          </p>
        </div>

        <Button
          size="sm"
          radius="sm"
          className="bg-amber-500 text-slate-900 font-semibold shadow-sm transition-all"
          startContent={<FiPlus size={16} />}
          onPress={handleNuevaUit}
        >
          Nueva UIT
        </Button>
      </div>

      {/* Contenedor con scroll solo para la tabla */}
      <div className="px-4 w-full overflow-y-auto">
        <table className="w-full border-collapse overflow-hidden text-left rounded-xl">
          <thead className="sticky top-0 bg-slate-900 text-slate-100 z-10">
            <tr>
              <th className="py-2.5 px-4 font-semibold uppercase text-[10px] tracking-wider">
                Año
              </th>
              <th className="py-2.5 px-3 font-semibold uppercase text-[10px] tracking-wider text-right">
                Monto (S/)
              </th>
              <th className="py-2.5 px-4 font-semibold uppercase text-[10px] tracking-wider text-center">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {!uits || uits.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-10 px-4 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <FiInbox size={26} className="opacity-60" />
                    <span className="text-xs font-medium text-slate-500">
                      No hay UITs registradas
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              uits.map((uit) => (
                <tr
                  key={uit.id ?? uit.year}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="py-2.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                      {uit.year}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-right text-xs font-semibold text-slate-800 tabular-nums">
                    S/ {formatearMontoPe(uit.monto)}
                  </td>

                  <td className="py-2.5 px-4">
                    <div className="flex justify-center gap-1.5">
                      <Tooltip content="Editar UIT" size="sm" delay={300}>
                        <Button
                          isIconOnly
                          size="sm"
                          radius="md"
                          variant="flat"
                          className="bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-700 h-7 w-7 min-w-7 transition-colors"
                          onPress={() => handleEditarUit(uit)}
                          aria-label="Editar UIT"
                        >
                          <FiEdit size={13} />
                        </Button>
                      </Tooltip>

                      <Tooltip content="Ver tramos" size="sm" delay={300}>
                        <Button
                          isIconOnly
                          size="sm"
                          radius="md"
                          variant="flat"
                          className="bg-sky-50 hover:bg-sky-100 text-sky-600 h-7 w-7 min-w-7 transition-colors"
                          onPress={() => handleVerTramos(uit)}
                          aria-label="Ver tramos"
                        >
                          <FiEye size={14} />
                        </Button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaUit;
