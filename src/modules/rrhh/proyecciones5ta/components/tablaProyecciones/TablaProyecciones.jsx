import { useEffect, useMemo, useState } from "react";
import { Button, Spinner } from "@nextui-org/react";
import {
  FiSave,
  FiTrash2,
  FiTrendingUp,
  FiFileText,
  FiCalendar,
  FiLayers,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import axios from "axios";
import { toast } from "sonner";
import config from "../../../../../utils/getToken";
import { handleAxiosError } from "../../../../../utils/handleAxiosError";
import { API } from "../../../../../utils/api";
import { formatearMontoPe } from "../../../../../assets/formats";

import TablaPeriodos5ta from "./components/TablaPeriodos5ta";
import TablaTramos5ta from "./components/TablaTramos5ta";
import {
  construirPeriodosBase,
  construirTramosBase,
} from "./components/ProyeccionHelpers";

const TablaProyecciones = ({ uit, selectColaborador, visualizar }) => {
  const [periodos, setPeriodos] = useState([]);
  const [tramos, setTramos] = useState([]);
  const [existeEnBd, setExisteEnBd] = useState(false);
  const [observaciones, setObservaciones] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCargarDatos = async () => {
    if (!uit?.year) return;
    setIsLoading(true);

    try {
      const resMeses = await axios.get(
        `${API}/meses-planilla/semanas/${uit.year}`,
        config,
      );
      const mesesBd = resMeses.data?.meses || [];
      const periodosBase = construirPeriodosBase(mesesBd, uit.year);
      const tramosBase = construirTramosBase(uit.monto);

      if (uit?.id && selectColaborador) {
        const resProy = await axios.get(
          `${API}/rrhh/periodos-5ta/proyecciones-5ta/${uit.id}/${selectColaborador}`,
          config,
        );
        const periodosBd = resProy.data?.periodos || [];
        const tramosBd = resProy.data?.tramos || [];
        setObservaciones(tramosBd?.[0]?.observaciones || "");

        setExisteEnBd(periodosBd.length > 0 || tramosBd.length > 0);

        setPeriodos(
          periodosBd.length > 0
            ? periodosBase.map((base) => {
                const encontrado = periodosBd.find(
                  (p) => Number(p.orden) === Number(base.orden),
                );
                return encontrado
                  ? {
                      ...base,
                      id: encontrado.id,
                      remu_bruta:
                        Number(encontrado.remu_bruta) === 0
                          ? ""
                          : String(encontrado.remu_bruta),
                      retencion_5ta:
                        Number(encontrado.retencion_5ta) === 0
                          ? ""
                          : String(encontrado.retencion_5ta),
                    }
                  : base;
              })
            : periodosBase,
        );

        setTramos(
          tramosBd.length > 0
            ? tramosBase.map((base) => {
                const encontrado = tramosBd.find(
                  (t) => t.tramos_escala === base.tramos_escala,
                );
                return encontrado
                  ? {
                      ...base,
                      id: encontrado.id,
                      renta_5ta:
                        Number(encontrado.renta_5ta) === 0
                          ? ""
                          : String(encontrado.renta_5ta),
                      distribucion_tramos:
                        Number(encontrado.distribucion_tramos) === 0
                          ? ""
                          : String(encontrado.distribucion_tramos),
                    }
                  : base;
              })
            : tramosBase,
        );
      } else {
        setObservaciones("");
        setExisteEnBd(false);
        setPeriodos(periodosBase);
        setTramos(tramosBase);
      }
    } catch (err) {
      handleAxiosError(err);
      setPeriodos(construirPeriodosBase([], uit.year));
      setTramos(construirTramosBase(uit.monto));
      setExisteEnBd(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleCargarDatos();
  }, [uit?.id, uit?.year, uit?.monto, selectColaborador]);

  const handleChangeRemu = (index, value) => {
    const nuevosPeriodos = periodos.map((item, i) =>
      i === index ? { ...item, remu_bruta: value } : item,
    );

    const montoUit = Number(uit?.monto) || 0;
    const ingresoTotal = nuevosPeriodos.reduce(
      (acc, p) => acc + (Number(p.remu_bruta) || 0),
      0,
    );
    const deduccion7Uit = Number((montoUit * 7).toFixed(2));
    let restante = Math.max(
      0,
      Number((ingresoTotal - deduccion7Uit).toFixed(2)),
    );

    const nuevosTramos = tramos.map((t) => {
      const distribucion =
        restante <= 0
          ? 0
          : t.esSinLimite
            ? restante
            : Math.min(restante, t.maximos);

      restante = Math.max(0, Number((restante - distribucion).toFixed(2)));
      const renta = Number((distribucion * t.tasa).toFixed(2));

      return {
        ...t,
        distribucion_tramos: distribucion > 0 ? distribucion.toFixed(2) : "",
        renta_5ta: renta > 0 ? renta.toFixed(2) : "",
      };
    });

    setPeriodos(
      nuevosPeriodos.map((p) => ({
        ...p,
      })),
    );
    setTramos(nuevosTramos);
  };

  const handleChangeRetencion = (index, value) => {
    setPeriodos((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, retencion_5ta: value } : item,
      ),
    );
  };

  const handleChangeTramo = (index, field, value) => {
    setTramos((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const totales = useMemo(() => {
    const montoUit = Number(uit?.monto) || 0;
    const ingresoTotal = periodos.reduce(
      (acc, p) => acc + (Number(p.remu_bruta) || 0),
      0,
    );
    const totalRetencionPeriodos = periodos.reduce(
      (acc, p) => acc + (Number(p.retencion_5ta) || 0),
      0,
    );
    const deduccion7Uit = Number((montoUit * 7).toFixed(2));
    const rentaImponible = Math.max(
      0,
      Number((ingresoTotal - deduccion7Uit).toFixed(2)),
    );
    const retencionAnual = tramos.reduce(
      (acc, t) => acc + (Number(t.renta_5ta) || 0),
      0,
    );
    const totalDistribucion = tramos.reduce(
      (acc, t) => acc + (Number(t.distribucion_tramos) || 0),
      0,
    );
    const retencionMensual = Number((retencionAnual / 12).toFixed(2));

    return {
      ingresoTotal,
      totalRetencionPeriodos,
      deduccion7Uit,
      rentaImponible,
      retencionAnual,
      totalDistribucion,
      retencionMensual,
    };
  }, [periodos, tramos, uit?.monto]);

  const handleGuardar = async () => {
    if (!uit?.id || !selectColaborador) {
      toast.error("Selecciona un trabajador antes de guardar");
      return;
    }

    const payload = {
      observaciones,
      periodos: periodos.map((p) => ({
        orden: p.orden,
        nombre_periodo: p.nombre_periodo,
        mes_id: p.mes_id,
        remu_bruta: Number(p.remu_bruta) || 0,
        retencion_5ta: p.aplicaRetencion ? Number(p.retencion_5ta) || 0 : 0,
      })),
      tramos: tramos.map((t) => ({
        tramos_escala: t.tramos_escala,
        maximos: Number(t.maximos) || 0,
        renta_5ta: Number(t.renta_5ta) || 0,
        distribucion_tramos: Number(t.distribucion_tramos) || 0,
      })),
    };

    setIsSaving(true);
    try {
      await axios.post(
        `${API}/rrhh/periodos-5ta/proyecciones-5ta/${uit.id}/${selectColaborador}`,
        payload,
        config,
      );
      toast.success(
        existeEnBd
          ? "Proyección de 5ta actualizada correctamente"
          : "Proyección de 5ta registrada correctamente",
      );
      handleCargarDatos();
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLimpiar = () => {
    setPeriodos((prev) =>
      prev.map((p) => ({ ...p, remu_bruta: "", retencion_5ta: "" })),
    );
    setTramos((prev) =>
      prev.map((t) => ({ ...t, renta_5ta: "", distribucion_tramos: "" })),
    );
    setObservaciones("");
  };

  return (
    <div className="w-full  flex flex-col gap-5">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-200/50 overflow-hidden">
        {/* Cabecera oscura de alto contraste */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-sm shrink-0">
              <FiTrendingUp size={19} />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white">
                Proyección de Renta de 5ta Categoría
              </h2>
              <p className="text-xs text-slate-300">
                Ejercicio fiscal{" "}
                <span className="font-semibold text-amber-300">
                  {uit?.year || "-"}
                </span>{" "}
                · UIT vigente:{" "}
                <span className="font-semibold text-white">
                  S/ {formatearMontoPe(uit?.monto || 0)}
                </span>
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold w-fit ${
              existeEnBd
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                : "bg-amber-400/20 text-amber-300 border border-amber-400/30"
            }`}
          >
            {existeEnBd ? <FiCheckCircle size={13} /> : <FiClock size={13} />}
            {existeEnBd ? "Registrado en BD" : "Nueva proyección"}
          </span>
        </div>

        {/* Tarjetas KPI sobre fondo blanco puro */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 p-5 bg-white border-b border-slate-100">
          <div className="rounded-xl bg-white border border-slate-200 border-l-4 border-l-slate-900 p-3.5 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Ingreso Total Anual
            </p>
            <p className="text-base font-extrabold text-slate-900 mt-1 tabular-nums">
              S/ {formatearMontoPe(totales.ingresoTotal)}
            </p>
          </div>

          <div className="rounded-xl bg-white border border-indigo-200/80 border-l-4 border-l-indigo-600 p-3.5 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
              Renta Imponible
            </p>
            <p className="text-base font-extrabold text-indigo-950 mt-1 tabular-nums">
              S/ {formatearMontoPe(totales.rentaImponible)}
            </p>
          </div>

          <div className="rounded-xl bg-emerald-600 text-white p-3.5 shadow-sm shadow-emerald-600/20">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">
              Retención Anual
            </p>
            <p className="text-base font-extrabold text-white mt-1 tabular-nums">
              S/ {formatearMontoPe(totales.retencionAnual)}
            </p>
          </div>

          <div className="rounded-xl bg-amber-400 text-slate-950 p-3.5 shadow-sm shadow-amber-400/20">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-950/70">
              Retención Mensual
            </p>
            <p className="text-base font-extrabold text-slate-950 mt-1 tabular-nums">
              S/ {formatearMontoPe(totales.retencionMensual)}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center bg-white">
            <Spinner size="sm" color="warning" label="Cargando proyección..." />
          </div>
        ) : (
          <div className="p-5 bg-white flex flex-col gap-6">
            {/* Sección 1: Periodos */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FiCalendar size={13} />
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  1. Detalle de Periodos y Remuneraciones
                </h3>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                <TablaPeriodos5ta
                  periodos={periodos}
                  totales={totales}
                  onChangeRemu={handleChangeRemu}
                  onChangeRetencion={handleChangeRetencion}
                  visualizar={visualizar}
                />
              </div>
            </div>

            {/* Sección 2: Tramos */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FiLayers size={13} />
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  2. Distribución por Tramos y Escalas
                </h3>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                <TablaTramos5ta
                  tramos={tramos}
                  totales={totales}
                  onChangeTramo={handleChangeTramo}
                  visualizar={visualizar}
                />
              </div>
            </div>

            {/* Sección 3: Observaciones y Acciones sobre blanco limpio */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                  <FiFileText size={13} className="text-indigo-500" />
                  Observaciones
                </label>
                <input
                  disabled={visualizar}
                  type="text"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Agrega alguna nota o aclaración sobre esta proyección..."
                  className="w-full text-xs text-slate-800 bg-white border border-slate-300 hover:border-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 rounded-lg px-3.5 py-2.5 outline-none transition-all"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <p className="text-[11px] text-slate-500">
                  Los campos con borde ámbar son editables manualmente.
                </p>

                <div className="flex items-center justify-end gap-2.5">
                  {!visualizar && (
                    <Button
                      size="sm"
                      radius="lg"
                      color="danger"
                      variant="flat"
                      startContent={<FiTrash2 size={14} />}
                      onPress={handleLimpiar}
                      className="font-semibold"
                    >
                      Limpiar
                    </Button>
                  )}
                  <Button
                    size="sm"
                    radius="lg"
                    isLoading={isSaving}
                    isDisabled={!uit?.id || !selectColaborador}
                    startContent={!isSaving && <FiSave size={14} />}
                    onPress={handleGuardar}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm px-5"
                  >
                    {existeEnBd
                      ? "Actualizar proyección"
                      : "Guardar proyección"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TablaProyecciones;
