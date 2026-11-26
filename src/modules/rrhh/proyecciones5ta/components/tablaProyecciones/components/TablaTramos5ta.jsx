import { formatearMontoPe } from "../../../../../../assets/formats";
import { onInputPrice } from "../../../../../../assets/onInputs";

const TablaTramos5ta = ({ tramos, totales, onChangeTramo, visualizar }) => {
  return (
    <table className="w-full border-collapse text-xs bg-white">
      <thead className="bg-slate-900 text-white">
        <tr>
          <th className="py-3 px-4 font-semibold uppercase text-[10px] tracking-wider text-left w-[34%]">
            Tramos y Escalas
          </th>
          <th className="py-3 px-4 font-semibold uppercase text-[10px] tracking-wider text-right w-[22%]">
            Máximos
          </th>
          <th className="py-3 px-4 font-semibold uppercase text-[10px] tracking-wider text-right w-[22%]">
            Renta 5ta
          </th>
          <th className="py-3 px-4 font-semibold uppercase text-[10px] tracking-wider text-right w-[22%]">
            Distribución Tramos
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {tramos.map((t, index) => (
          <tr
            key={t.tramos_escala}
            className="bg-white hover:bg-amber-50/30 transition-colors"
          >
            <td className="px-4 py-2.5 font-semibold text-slate-700">
              {t.tramos_escala}
            </td>

            <td className="px-4 py-2.5 text-slate-700 tabular-nums">
              {t.esSinLimite ? (
                <div className="flex justify-end">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase tracking-wide">
                    Sin límite
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">S/</span>
                  <span className="font-bold text-slate-800">
                    {formatearMontoPe(t.maximos)}
                  </span>
                </div>
              )}
            </td>

            {/* RENTA 5TA (editable) */}
            <td className="px-2.5 py-1.5 tabular-nums">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-amber-300/90 hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-400/20 shadow-2xs transition-all">
                <span className="text-[11px] font-bold text-amber-600">S/</span>
                <input
                  disabled={visualizar}
                  type="text"
                  value={t.renta_5ta}
                  onInput={onInputPrice}
                  onChange={(e) =>
                    onChangeTramo(index, "renta_5ta", e.target.value)
                  }
                  placeholder="0.00"
                  className="w-full text-right text-xs font-bold text-slate-800 bg-transparent outline-none tabular-nums"
                />
              </div>
            </td>

            {/* DISTRIBUCION TRAMOS (editable) */}
            <td className="px-2.5 py-1.5 tabular-nums">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-amber-300/90 hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-400/20 shadow-2xs transition-all">
                <span className="text-[11px] font-bold text-amber-600">S/</span>
                <input
                  disabled={visualizar}
                  type="text"
                  value={t.distribucion_tramos}
                  onInput={onInputPrice}
                  onChange={(e) =>
                    onChangeTramo(index, "distribucion_tramos", e.target.value)
                  }
                  placeholder="0.00"
                  className="w-full text-right text-xs font-bold text-slate-800 bg-transparent outline-none tabular-nums"
                />
              </div>
            </td>
          </tr>
        ))}

        {/* RETENCIÓN ANUAL (Alto contraste) */}
        <tr className=" text-white font-bold">
          <td
            colSpan={2}
            className=" bg-slate-900 px-4 py-3 text-right uppercase text-[11px] tracking-wider text-slate-200"
          >
            Retención Anual
          </td>
          <td
            className={`px-4 py-3 ${Number(totales.totalRetencionPeriodos).toFixed(2) === Number(totales.retencionAnual).toFixed(2) ? "bg-green-600/50" : "bg-red-600/50"} text-slate-900 tabular-nums`}
          >
            <div className="flex items-center justify-between">
              <span className=" font-semibold">S/</span>
              <span>{formatearMontoPe(totales.retencionAnual)}</span>
            </div>
          </td>
          <td
            rowSpan={2}
            className="px-4 py-3 bg-white text-indigo-950 align-middle tabular-nums border-l border-indigo-100"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-500 text-right">
                Total Distribuido
              </span>
              <div className="flex items-center justify-between text-sm font-extrabold">
                <span className="text-indigo-500 font-semibold text-xs">
                  S/
                </span>
                <span>{formatearMontoPe(totales.totalDistribucion)}</span>
              </div>
            </div>
          </td>
        </tr>

        {/* RETENCIÓN MENSUAL */}
        <tr className="bg-amber-50/70 font-bold">
          <td
            colSpan={2}
            className="px-4 py-2.5 text-right uppercase text-[11px] tracking-wide text-amber-950"
          >
            Retención Mensual
          </td>
          <td className="px-4 py-2.5 bg-amber-400/60 text-slate-950 tabular-nums">
            <div className="flex items-center justify-between">
              <span className="text-amber-950/70 font-semibold">S/</span>
              <span>{formatearMontoPe(totales.retencionMensual)}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default TablaTramos5ta;
