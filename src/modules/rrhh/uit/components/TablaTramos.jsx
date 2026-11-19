import { useEffect, useState } from "react";
import { Button, Spinner } from "@nextui-org/react";
import { FiSave, FiLayers, FiTrendingUp } from "react-icons/fi";
import axios from "axios";
import { toast } from "sonner";
import { formatearMontoPe } from "../../../../assets/formats";
import { onInputNumber } from "../../../../assets/onInputs";
import config from "../../../../utils/getToken";
import { handleAxiosError } from "../../../../utils/handleAxiosError";
import { API } from "../../../../utils/api";
import { Link } from "react-router-dom";

const crearTramosPorDefecto = (uit) => {
  const monto = Number(uit?.monto) || 0;
  const year = Number(uit?.year) || 0;
  const uit_id = uit?.id;

  return [
    {
      uit_id,
      year,
      secuencia: "PRIMER TRAMO",
      escala: "0-5 UIT",
      maximo: Number((monto * 5).toFixed(2)),
      aplicación: 8,
    },
    {
      uit_id,
      year,
      secuencia: "SEGUNDO TRAMO",
      escala: "5-20 UIT",
      maximo: Number((monto * 15).toFixed(2)),
      aplicación: 14,
    },
    {
      uit_id,
      year,
      secuencia: "TERCER TRAMO",
      escala: "20-35 UIT",
      maximo: Number((monto * 15).toFixed(2)),
      aplicación: 17,
    },
    {
      uit_id,
      year,
      secuencia: "CUARTO TRAMO",
      escala: "35-45 UIT",
      maximo: Number((monto * 10).toFixed(2)),
      aplicación: 20,
    },
    {
      uit_id,
      year,
      secuencia: "QUINTO TRAMO",
      escala: "MAS 45 UIT",
      maximo: 0,
      aplicación: 30,
    },
  ];
};

const TablaTramos = ({ selectUit, selectModal }) => {
  const [tramos, setTramos] = useState([]);
  const [existeEnBd, setExisteEnBd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFindTramos = async () => {
    if (!selectUit?.id) {
      setTramos([]);
      setExisteEnBd(false);
      return;
    }

    if (selectModal && selectModal !== "tramos_uit") {
      return;
    }

    setIsLoading(true);
    const tramosBase = crearTramosPorDefecto(selectUit);

    try {
      const url = `${API}/rrhh/uit-tramos/${selectUit.id}`;
      const res = await axios.get(url, config);
      const tramosBd = res.data?.tramos || [];

      if (tramosBd.length > 0) {
        const tramosCombinados = tramosBase.map((base) => {
          const encontrado = tramosBd.find(
            (t) => t.secuencia === base.secuencia,
          );
          return encontrado
            ? {
                ...base,
                id: encontrado.id,
                aplicación: encontrado.aplicación,
              }
            : base;
        });

        setTramos(tramosCombinados);
        setExisteEnBd(true);
      } else {
        setTramos(tramosBase);
        setExisteEnBd(false);
      }
    } catch (err) {
      handleAxiosError(err);
      setTramos(tramosBase);
      setExisteEnBd(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFindTramos();
  }, [selectUit, selectModal]);

  const handleChangeAplicacion = (index, value) => {
    setTramos((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, aplicación: value } : item,
      ),
    );
  };

  const handleGuardar = async () => {
    if (!selectUit?.id) return;

    const hayVacio = tramos.some(
      (t) => t.aplicación === "" || isNaN(Number(t.aplicación)),
    );
    if (hayVacio) {
      toast.error("Todos los porcentajes de aplicación deben ser válidos");
      return;
    }

    const payload = tramos.map((t) => ({
      uit_id: selectUit.id,
      year: Number(selectUit.year),
      secuencia: t.secuencia,
      escala: t.escala,
      maximo: Number(t.maximo) || 0,
      aplicación: parseInt(t.aplicación, 10),
    }));

    setIsSaving(true);
    try {
      await axios.post(
        `${API}/rrhh/uit-tramos/${selectUit.id}`,
        { tramos: payload },
        config,
      );
      toast.success(
        existeEnBd
          ? "Los tramos se actualizaron correctamente"
          : "Los tramos se registraron correctamente",
      );
      handleFindTramos();
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-[720px] flex flex-col border border-slate-200/80 mt-2 rounded-2xl bg-white shadow-sm overflow-hidden">
      {/* Cabecera */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-700">
            <FiLayers size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 leading-tight">
              DATA TRAMOS UIT
            </h3>
            <p className="text-[11px] text-slate-500">
              Año{" "}
              <span className="font-semibold">{selectUit?.year || "-"}</span> ·
              UIT:{" "}
              <span className="font-semibold">
                S/ {formatearMontoPe(selectUit?.monto || 0)}
              </span>
            </p>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
            existeEnBd
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}
        >
          {existeEnBd ? "Registrado" : "Sin registrar"}
        </span>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="sm" color="warning" label="Cargando tramos..." />
          </div>
        ) : (
          <table className="w-full border-collapse text-center">
            <thead className="bg-slate-900 text-slate-100">
              <tr>
                <th className="py-2.5 px-3 font-semibold uppercase text-[10px] tracking-wider border-r border-slate-700">
                  AÑO
                </th>
                <th className="py-2.5 px-3 font-semibold uppercase text-[10px] tracking-wider border-r border-slate-700">
                  SECUENCIA
                </th>
                <th className="py-2.5 px-3 font-semibold uppercase text-[10px] tracking-wider border-r border-slate-700">
                  ESCALA
                </th>
                <th className="py-2.5 px-3 font-semibold uppercase text-[10px] tracking-wider border-r border-slate-700">
                  MÁXIMO
                </th>
                <th className="py-2.5 px-3 font-semibold uppercase text-[10px] tracking-wider">
                  APLICACIÓN %
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 text-xs">
              {tramos.map((tramo, index) => {
                const esQuintoTramo = tramo.secuencia === "QUINTO TRAMO";

                return (
                  <tr
                    key={tramo.secuencia}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* AÑO (combinado) */}
                    {index === 0 && (
                      <td
                        rowSpan={tramos.length}
                        className="px-4 py-3 font-extrabold text-sm text-slate-800 bg-slate-50/60 border-r border-slate-200 align-middle"
                      >
                        {selectUit?.year}
                      </td>
                    )}

                    {/* SECUENCIA (solo lectura) */}
                    <td className="px-3 py-2.5 font-semibold text-slate-700 border-r border-slate-200 whitespace-nowrap">
                      {tramo.secuencia}
                    </td>

                    {/* ESCALA (solo lectura) */}
                    <td className="px-3 py-2.5 font-medium text-slate-600 border-r border-slate-200 whitespace-nowrap">
                      {tramo.escala}
                    </td>

                    {/* MÁXIMO (solo lectura) */}
                    <td
                      className={`px-4 py-2.5 border-r border-slate-200 tabular-nums whitespace-nowrap ${
                        esQuintoTramo
                          ? "bg-amber-300/90 text-center"
                          : "text-right"
                      }`}
                    >
                      {esQuintoTramo ? (
                        <span className="font-bold text-slate-900 tracking-wide text-[11px]">
                          SIN LIMITE
                        </span>
                      ) : (
                        <span className="font-semibold text-slate-800">
                          S/ {formatearMontoPe(tramo.maximo)}
                        </span>
                      )}
                    </td>

                    {/* APLICACIÓN % (única columna editable) */}
                    <td className="px-2 py-1.5 bg-amber-50/80">
                      <div className="inline-flex items-center justify-center gap-1">
                        <input
                          type="text"
                          value={tramo.aplicación}
                          onInput={onInputNumber}
                          onChange={(e) =>
                            handleChangeAplicacion(index, e.target.value)
                          }
                          className="w-14 text-center text-xs font-bold text-slate-800 bg-white border border-amber-300/80 focus:border-amber-500 rounded-md px-1.5 py-1 outline-none transition-all tabular-nums shadow-xs"
                        />
                        <span className="text-xs font-bold text-slate-600">
                          %
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 bg-slate-50/50">
        <p className="text-[11px] text-slate-400 leading-snug">
          {existeEnBd
            ? "Modifica los porcentajes de aplicación y guarda los cambios."
            : "Verifica los porcentajes y guarda para registrar los tramos."}
        </p>

        <div className="flex items-center justify-end gap-2 shrink-0">
          {existeEnBd && (
            <Link to={`/rrhh/proyecciones-5ta/${selectUit?.id}`}>
              <Button
                size="sm"
                radius="lg"
                variant="bordered"
                isDisabled={isLoading || !selectUit?.id}
                startContent={<FiTrendingUp size={14} />}
                className="bg-white hover:bg-slate-100 text-slate-700 border-slate-200 font-semibold shadow-xs"
              >
                Proyecciones 5ta
              </Button>
            </Link>
          )}

          <Button
            size="sm"
            radius="lg"
            isLoading={isSaving}
            isDisabled={isLoading || !selectUit?.id}
            startContent={!isSaving && <FiSave size={15} />}
            onPress={handleGuardar}
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold shadow-sm"
          >
            {existeEnBd ? "Actualizar tramos" : "Guardar tramos"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TablaTramos;
