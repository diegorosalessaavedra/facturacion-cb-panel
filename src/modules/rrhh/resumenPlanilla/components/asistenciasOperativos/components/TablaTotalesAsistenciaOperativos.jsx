import React, { useState, useEffect, useRef } from "react";
import { Input } from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";
import config from "../../../../../../utils/getToken";
import { onInputPrice } from "../../../../../../assets/onInputs";
import { handleAxiosError } from "../../../../../../utils/handleAxiosError";

const TablaTotalesAsistenciaOperativos = ({
  semanaPlanillaId,
  colaboradorId,
  salarioBase = 0,
  adicionalesBase = 0,
  isFinalizado = false,
}) => {
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [datosTotales, setDatosTotales] = useState({
    id: null,
    salario_exedente: "",
    salario_adicion: "",
    salario_total: "",
    adicionales_exedente: "",
    adicionales_adicion: "",
    adicionales_total: "",
  });

  const datosRef = useRef(datosTotales);
  const saveSeqRef = useRef(0);

  useEffect(() => {
    datosRef.current = datosTotales;
  }, [datosTotales]);

  // Si aún no existe registro en BD, sincroniza los totales con la base de la tabla
  useEffect(() => {
    if (!isDbLoaded || datosRef.current.id) return;

    const excSal = Number(datosRef.current.salario_exedente || 0);
    const adiSal = Number(datosRef.current.salario_adicion || 0);
    const excAdi = Number(datosRef.current.adicionales_exedente || 0);
    const adiAdi = Number(datosRef.current.adicionales_adicion || 0);

    const updated = {
      ...datosRef.current,
      salario_total: (Number(salarioBase || 0) - excSal + adiSal).toFixed(2),
      adicionales_total: (
        Number(adicionalesBase || 0) -
        excAdi +
        adiAdi
      ).toFixed(2),
    };

    datosRef.current = updated;
    setDatosTotales(updated);
  }, [salarioBase, adicionalesBase, isDbLoaded]);

  // --- GET: Carga datos de la BD ---
  const fetchTotales = () => {
    if (!semanaPlanillaId || !colaboradorId) return;

    setIsDbLoaded(false);
    const url = `${import.meta.env.VITE_URL_API}/totales-asistencia-operativo/${semanaPlanillaId}/${colaboradorId}`;

    axios
      .get(url, config)
      .then((res) => {
        if (res.data.totales?.id) {
          const t = res.data.totales;
          const loaded = {
            id: t.id,
            salario_exedente:
              Number(t.salario_exedente) === 0
                ? ""
                : String(t.salario_exedente),
            salario_adicion:
              Number(t.salario_adicion) === 0 ? "" : String(t.salario_adicion),
            salario_total: Number(t.salario_total || 0).toFixed(2),
            adicionales_exedente:
              Number(t.adicionales_exedente) === 0
                ? ""
                : String(t.adicionales_exedente),
            adicionales_adicion:
              Number(t.adicionales_adicion) === 0
                ? ""
                : String(t.adicionales_adicion),
            adicionales_total: Number(t.adicionales_total || 0).toFixed(2),
          };
          datosRef.current = loaded;
          setDatosTotales(loaded);
        } else {
          const empty = {
            id: null,
            salario_exedente: "",
            salario_adicion: "",
            salario_total: Number(salarioBase || 0).toFixed(2),
            adicionales_exedente: "",
            adicionales_adicion: "",
            adicionales_total: Number(adicionalesBase || 0).toFixed(2),
          };
          datosRef.current = empty;
          setDatosTotales(empty);
        }
      })
      .catch((err) => console.error("Error cargando totales:", err))
      .finally(() => {
        setIsDbLoaded(true);
      });
  };

  useEffect(() => {
    fetchTotales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semanaPlanillaId, colaboradorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = {
      ...datosRef.current,
      [name]: value,
    };

    // Si edita excedente o adición de salario, recalcula salario_total
    if (name === "salario_exedente" || name === "salario_adicion") {
      const exc = Number(updated.salario_exedente || 0);
      const adi = Number(updated.salario_adicion || 0);
      updated.salario_total = (Number(salarioBase || 0) - exc + adi).toFixed(2);
    }

    // Si edita excedente o adición de adicionales, recalcula adicionales_total
    if (name === "adicionales_exedente" || name === "adicionales_adicion") {
      const exc = Number(updated.adicionales_exedente || 0);
      const adi = Number(updated.adicionales_adicion || 0);
      updated.adicionales_total = (
        Number(adicionalesBase || 0) -
        exc +
        adi
      ).toFixed(2);
    }

    datosRef.current = updated;
    setDatosTotales(updated);
  };

  const handleSave = () => {
    if (!semanaPlanillaId || !colaboradorId || !isDbLoaded) return;

    const current = datosRef.current;

    const payload = {
      id: current.id,
      semana_planilla_id: semanaPlanillaId,
      colaborador_id: colaboradorId,
      salario_exedente: Number(current.salario_exedente || 0),
      salario_adicion: Number(current.salario_adicion || 0),
      salario_total: Number(current.salario_total || 0),
      adicionales_exedente: Number(current.adicionales_exedente || 0),
      adicionales_adicion: Number(current.adicionales_adicion || 0),
      adicionales_total: Number(current.adicionales_total || 0),
    };

    const mySeq = ++saveSeqRef.current;
    const toastId = toast.loading("Guardando totales...");
    const url = `${import.meta.env.VITE_URL_API}/totales-asistencia-operativo/${payload.id || "0"}`;

    axios
      .post(url, payload, config)
      .then((res) => {
        toast.success("Totales guardados", { id: toastId });
        const newId = res.data?.data?.id ?? payload.id;
        if (mySeq !== saveSeqRef.current) return;
        if (newId && newId !== datosRef.current.id) {
          setDatosTotales((prev) => ({ ...prev, id: newId }));
        }
      })
      .catch((err) => {
        toast.dismiss(toastId);
        handleAxiosError(err);
      });
  };

  const inputUIClasses = {
    inputWrapper:
      "min-h-[25px] h-[25px] px-1.5 bg-white shadow-sm border border-slate-200 hover:bg-white/90 data-[focus=true]:bg-white data-[focus=true]:shadow-md transition-all",
    input: "text-[10px] text-right text-slate-700 font-semibold",
  };

  const inputTotalUIClasses = {
    inputWrapper:
      "min-h-[25px] h-[25px] px-1.5 bg-white shadow-sm border border-slate-300 hover:bg-white data-[focus=true]:bg-white data-[focus=true]:shadow-md transition-all",
    input: "text-[10px] text-right text-slate-900 font-extrabold",
  };

  const thMainYellow =
    "bg-slate-800 border-b border-slate-900 p-2.5 font-bold uppercase text-[10px] tracking-widest text-white";
  const thSubYellow =
    "bg-green-100 border-r border-b border-green-300 p-3 font-bold uppercase text-[9px] tracking-wider text-slate-950 whitespace-nowrap";
  const thSubYellowLast =
    "bg-blue-100 border-b border-blue-300 p-3 px-1 font-bold uppercase text-[9px] tracking-wider text-slate-950 whitespace-nowrap";

  const tdTitle =
    "bg-sky-50 border-r border-b border-sky-200 p-2 font-bold text-[10px] text-left text-slate-600 uppercase";
  const tdValue =
    "bg-white border-r border-b border-slate-200 p-1 font-medium text-[9px] text-right text-slate-900 h-[33px]";
  const tdValueLast =
    "bg-white border-b border-slate-200 p-1 font-medium text-[9px] text-right text-slate-900 h-[33px]";

  const tdTotalTitle =
    "bg-slate-800 border-r border-slate-900 p-2 font-bold text-[10px] text-left text-slate-50 uppercase";
  const tdTotal =
    "bg-slate-50 border-r border-slate-300 p-1 font-extrabold text-[9px] text-right text-slate-900 h-[33px]";
  const tdTotalLast =
    "bg-slate-50 border-slate-300 p-1 font-extrabold text-[9px] text-right text-slate-900 h-[33px]";

  const renderInput = (name, label, isTotal = false) =>
    !isDbLoaded ? (
      <span className="pr-1">...</span>
    ) : (
      <Input
        isDisabled={isFinalizado}
        aria-label={label}
        type="text"
        onInput={onInputPrice}
        name={name}
        value={datosTotales[name]}
        onChange={handleChange}
        onBlur={handleSave}
        placeholder="0.00"
        size="sm"
        startContent={
          <span className="text-[9px] font-bold text-slate-400">S/</span>
        }
        classNames={isTotal ? inputTotalUIClasses : inputUIClasses}
      />
    );

  return (
    <div className="w-[300px] flex-1 overflow-hidden border border-slate-300 rounded-xl bg-white shadow-md custom-scrollbar">
      <table className="w-full border-collapse text-center">
        <thead>
          <tr>
            <th className="bg-white border-r border-b border-slate-200 p-2 w-[100px]"></th>
            <th colSpan={2} className={thMainYellow}>
              TOTALES
            </th>
          </tr>
          <tr>
            <th className="bg-slate-50 border-r border-b border-slate-200 p-2"></th>
            <th className={thSubYellow}>SALARIO</th>
            <th className={thSubYellowLast}>ADICIONALES</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-slate-50 transition-colors">
            <td className={tdTitle}>EXCEDENTE</td>
            <td className={tdValue}>
              {renderInput("salario_exedente", "Excedente salario")}
            </td>
            <td className={tdValueLast}>
              {renderInput("adicionales_exedente", "Excedente adicionales")}
            </td>
          </tr>
          <tr className="hover:bg-slate-50 transition-colors">
            <td className={tdTitle}>ADICIÓN</td>
            <td className={tdValue}>
              {renderInput("salario_adicion", "Adición salario")}
            </td>
            <td className={tdValueLast}>
              {renderInput("adicionales_adicion", "Adición adicionales")}
            </td>
          </tr>
          <tr className="bg-slate-50/50">
            <td className={tdTotalTitle}>TOTALES</td>
            <td className={tdTotal}>
              {renderInput("salario_total", "Total salario", true)}
            </td>
            <td className={tdTotalLast}>
              {renderInput("adicionales_total", "Total adicionales", true)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TablaTotalesAsistenciaOperativos;
