import { formatearMontoPe } from "../../../../../../assets/formats";
import { onInputPrice } from "../../../../../../assets/onInputs";

const TablaPeriodos5ta = ({
  periodos,
  totales,
  onChangeRemu,
  onChangeRetencion,
  visualizar,
}) => {
  return (
    <table className="w-full border-collapse text-xs bg-white">
      <thead className="bg-slate-900 text-white">
        <tr>
          <th className="py-3 px-4 font-semibold uppercase text-[10px] tracking-wider text-left w-[26%]">
            Periodo
          </th>
          <th className="py-3 px-3 font-semibold uppercase text-[10px] tracking-wider text-center w-[30%]">
            Semanas
          </th>
          <th className="py-3 px-4 font-semibold uppercase text-[10px] tracking-wider text-right w-[22%]">
            Remu. Bruta
          </th>
          <th className="py-3 px-4 font-semibold uppercase text-[10px] tracking-wider text-right w-[22%]">
            Retención 5ta
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {periodos.map((p, index) => {
          const esExtra = !p.aplicaRetencion;

          return (
            <tr
              key={p.orden}
              className={`transition-colors ${
                esExtra
                  ? "bg-indigo-50/40 hover:bg-indigo-50/70"
                  : "bg-white hover:bg-amber-50/30"
              }`}
            >
              <td className="px-4 py-2 font-semibold text-slate-800">
                <div className="flex items-center gap-2">
                  <span>{p.nombre_periodo}</span>
                  {esExtra && (
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase bg-indigo-100 text-indigo-700">
                      Extra
                    </span>
                  )}
                </div>
              </td>

              <td className="px-3 py-2 text-center text-[10px] text-slate-500 leading-snug">
                {p.semanas || <span className="text-slate-300">—</span>}
              </td>

              {/* REMU BRUTA (editable) */}
              <td className="px-2.5 py-1.5">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-amber-300/90 hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-400/20 shadow-2xs transition-all">
                  <span className="text-[11px] font-bold text-amber-600">
                    S/
                  </span>
                  <input
                    disabled={visualizar}
                    type="text"
                    value={p.remu_bruta}
                    onInput={onInputPrice}
                    onChange={(e) => onChangeRemu(index, e.target.value)}
                    placeholder="0.00"
                    className="w-full text-right text-xs font-bold text-slate-800 bg-transparent outline-none tabular-nums"
                  />
                </div>
              </td>

              {/* RETENCIÓN 5TA */}
              <td className="px-2.5 py-1.5">
                {p.aplicaRetencion ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-amber-300/90 hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-400/20 shadow-2xs transition-all">
                    <span className="text-[11px] font-bold text-amber-600">
                      S/
                    </span>
                    <input
                      disabled={visualizar}
                      type="text"
                      value={p.retencion_5ta}
                      onInput={onInputPrice}
                      onChange={(e) => onChangeRetencion(index, e.target.value)}
                      placeholder="0.00"
                      className="w-full text-right text-xs font-bold text-slate-800 bg-transparent outline-none tabular-nums"
                    />
                  </div>
                ) : (
                  <div className="w-full py-1.5 rounded-lg border border-dashed border-indigo-200 bg-white/60 text-center text-[10px] font-semibold text-indigo-400">
                    No aplica
                  </div>
                )}
              </td>
            </tr>
          );
        })}

        {/* INGRESO TOTAL (Alto contraste) */}
        <tr className="bg-slate-900 text-white font-bold">
          <td
            colSpan={2}
            className="px-4 py-3 text-right uppercase text-[11px] tracking-wider text-slate-200"
          >
            Ingreso Total
          </td>
          <td className="px-4 py-3 tabular-nums text-white border-l border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">S/</span>
              <span>{formatearMontoPe(totales.ingresoTotal)}</span>
            </div>
          </td>
          <td className="px-4 py-3 bg-emerald-600 text-white tabular-nums">
            <div className="flex items-center justify-between">
              <span className="text-emerald-200 font-semibold">S/</span>
              <span>{formatearMontoPe(totales.totalRetencionPeriodos)}</span>
            </div>
          </td>
        </tr>

        {/* DEDUCCIÓN 7 UIT */}
        <tr className="bg-rose-50/60 font-bold">
          <td
            colSpan={2}
            className="px-4 py-2.5 text-right uppercase text-[11px] tracking-wide text-rose-700"
          >
            Deducción 7 UIT
          </td>
          <td className="px-4 py-2.5 text-rose-700 tabular-nums border-l border-rose-100">
            <div className="flex items-center justify-between">
              <span>-S/</span>
              <span>{formatearMontoPe(totales.deduccion7Uit)}</span>
            </div>
          </td>
          <td
            rowSpan={2}
            className="px-4 py-2.5 bg-white text-center uppercase text-[10px] font-extrabold tracking-widest text-indigo-900/40 align-middle border-l border-slate-200"
          >
            Totales
          </td>
        </tr>

        {/* RENTA IMPONIBLE */}
        <tr className="bg-indigo-50/70 font-bold">
          <td
            colSpan={2}
            className="px-4 py-2.5 text-right uppercase text-[11px] tracking-wide text-indigo-950"
          >
            Renta Imponible
          </td>
          <td className="px-4 py-2.5 text-indigo-950 tabular-nums border-l border-indigo-100">
            <div className="flex items-center justify-between">
              <span className="text-indigo-500 font-semibold">S/</span>
              <span>{formatearMontoPe(totales.rentaImponible)}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default TablaPeriodos5ta;
