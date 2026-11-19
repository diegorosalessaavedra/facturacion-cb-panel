import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { FiUser, FiCreditCard, FiBriefcase } from "react-icons/fi";
import { formatearMontoPe } from "../../../../assets/formats";

const DatosTrabajadorUit = ({
  colaboradores = [],
  selectColaborador,
  setSelectColaborador,
  uit,
}) => {
  const trabajador = colaboradores.find(
    (col) => String(col.id) === String(selectColaborador),
  );

  const dni = trabajador?.dni_colaborador || "";
  const empresa =
    trabajador?.empresa?.razon_social ||
    trabajador?.empresa?.nombre ||
    (typeof trabajador?.empresa === "string" ? trabajador.empresa : null) ||
    "";

  return (
    <div className="w-full  rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-200/50 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {/* TRABAJADOR */}
        <div className="md:col-span-5 p-4 flex flex-col justify-center gap-1.5 bg-white">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            <FiUser size={12} />
            Trabajador
          </span>
          <Autocomplete
            aria-label="Seleccionar trabajador"
            placeholder="Seleccione o escriba un nombre..."
            variant="bordered"
            radius="lg"
            size="sm"
            selectedKey={selectColaborador ? String(selectColaborador) : null}
            onSelectionChange={(key) => setSelectColaborador(key)}
            inputProps={{
              classNames: {
                input: "text-xs font-bold text-slate-800 uppercase",
                inputWrapper:
                  "min-h-9 bg-white border border-slate-300 hover:border-slate-400 focus-within:!border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/15 shadow-2xs transition-all",
              },
            }}
          >
            {colaboradores.map((col) => (
              <AutocompleteItem
                key={String(col.id)}
                value={String(col.id)}
                textValue={`${col.apellidos_colaborador} ${col.nombre_colaborador}`}
              >
                <p className="text-[11px] font-semibold text-slate-700 uppercase">
                  {col.apellidos_colaborador} {col.nombre_colaborador}
                </p>
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>

        {/* DNI */}
        <div className="md:col-span-2 p-4 flex flex-col justify-center gap-1.5 bg-white">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <FiCreditCard size={12} />
            DNI
          </span>
          {dni ? (
            <span className="inline-flex items-center w-fit px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-100 text-xs font-extrabold tracking-wide tabular-nums">
              {dni}
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-300">
              Sin seleccionar
            </span>
          )}
        </div>

        {/* EMPRESA */}
        <div className="md:col-span-3 p-4 flex flex-col justify-center gap-1.5 bg-white">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <FiBriefcase size={12} />
            Empresa
          </span>
          {empresa ? (
            <span className="text-xs font-bold text-slate-800 uppercase leading-snug">
              {empresa}
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-300">
              Sin seleccionar
            </span>
          )}
        </div>

        {/* UIT MONTO (Bloque destacado de alto contraste) */}
        <div className="md:col-span-2 p-4 flex flex-col justify-center gap-1 bg-slate-900 text-white">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
            UIT {uit?.year || ""}
          </span>
          <div className="flex items-baseline gap-1 tabular-nums">
            <span className="text-sm font-semibold text-green-500">S/</span>
            <span className="text-sm font-extrabold text-white tracking-tight">
              {formatearMontoPe(uit?.monto || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatosTrabajadorUit;
