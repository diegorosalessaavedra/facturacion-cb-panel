import { useEffect, useRef, useState } from "react";
import { Tooltip, Chip, Input } from "@nextui-org/react";
import { tdClass, tdLastClass, tdNameClass, renderMoney } from "./tableHelpers";
import { toast } from "sonner";
import { handleAxiosError } from "../../../../../../utils/handleAxiosError";
import config from "../../../../../../utils/getToken";
import axios from "axios";
import { API } from "../../../../../../utils/api";

const FilaPrincipal = ({
  colaborador,
  totales,
  prestamos,
  handleColaboradorClick,
  totalSemanas,
  onTotalesCalculados,
  periodo5ta,
  isFinalizado,
}) => {
  const [tardanza, setTardanza] = useState(totales?.descuento_tardanza ?? 0);
  const lastSavedValue = useRef(String(totales?.descuento_tardanza ?? 0));

  useEffect(() => {
    const valorInicial = totales?.descuento_tardanza ?? 0;
    setTardanza(valorInicial);
    lastSavedValue.current = String(valorInicial);
  }, [totales?.descuento_tardanza]);

  const esAdministrativo =
    colaborador?.cargo_laboral?.agrupacion_cargo === "ADMINISTRATIVOS";
  const nombreGrupo = colaborador?.cargo_laboral?.agrupacion_cargo || "-";
  const chipBg = esAdministrativo
    ? "bg-purple-100 border-purple-200"
    : "bg-orange-100 border-orange-200";
  const chipText = esAdministrativo ? "text-purple-700" : "text-orange-700";

  const salarioBruto = Number(totales?.salario_total || 0);
  const asigFamiliar = Number(colaborador?.asignacion_familiar || 0);

  const pensionEncontrada = [
    colaborador?.afp_integra,
    colaborador?.afp_prima,
    colaborador?.afp_horizonte,
    colaborador?.afp_profuturo,
    colaborador?.afp_habitat,
    colaborador?.onp,
  ].find((monto) => Number(monto) > 0);

  const porcentajePension = Number(pensionEncontrada || 0);
  const montoAsignacionFamiliar = esAdministrativo
    ? asigFamiliar / totalSemanas
    : asigFamiliar / 4;

  const salarioAfp = salarioBruto + montoAsignacionFamiliar;
  const montoPension = (salarioAfp * porcentajePension) / 100;

  const descuentos = prestamos.reduce(
    (acc, pago) => acc + Number(pago.importe_cuota || 0),
    0,
  );
  const descuentos_5ta = Number(periodo5ta?.retencion_5ta || 0);
  const descuentos_tardanza = Number(tardanza || 0);

  const totalPorPagar =
    salarioBruto +
    montoAsignacionFamiliar -
    montoPension -
    descuentos -
    descuentos_5ta -
    descuentos_tardanza;

  useEffect(() => {
    if (onTotalesCalculados) {
      onTotalesCalculados(colaborador.id, {
        bruto: salarioBruto,
        asigFam: montoAsignacionFamiliar,
        onpAfp: montoPension,
        descuentos,
        totalPagar: totalPorPagar,
        descuentos_5ta,
        descuentos_tardanza,
      });
    }
  }, [
    colaborador.id,
    salarioBruto,
    montoAsignacionFamiliar,
    montoPension,
    descuentos,
    descuentos_5ta,
    descuentos_tardanza,
    totalPorPagar,
  ]);

  const patchTotales = () => {
    if (!totales?.id) {
      toast.error("No hay datos en el tareo");
      return;
    }

    if (String(tardanza) === lastSavedValue.current) return;

    const endpoint = esAdministrativo
      ? "totales-asistencia-administrativo/tardanza"
      : "totales-asistencia-operativo/tardanza";

    const url = `${API}/${endpoint}/${totales.id}`;
    const payload = {
      descuento_tardanza: Number(tardanza || 0),
    };

    const toastId = toast.loading("Guardando descuento...");

    axios
      .patch(url, payload, config)
      .then(() => {
        toast.success("Descuento de tardanza actualizado", { id: toastId });
        lastSavedValue.current = String(tardanza);
      })
      .catch((err) => {
        toast.dismiss(toastId);
        handleAxiosError(err);
      });
  };

  return (
    <tr className="hover:bg-blue-50/50 transition-colors group h-[38px]">
      <td className={tdClass}>{colaborador.regimen}</td>
      <td className={tdClass}>
        <Chip
          size="sm"
          variant="flat"
          className="h-5 min-h-min"
          classNames={{
            base: chipBg,
            content: `font-bold text-[9px] px-2 ${chipText}`,
          }}
        >
          {nombreGrupo}
        </Chip>
      </td>
      <td className={tdNameClass}>
        <Tooltip
          content="Ver tareo de asistencias"
          placement="right"
          delay={300}
        >
          <span
            className="cursor-pointer text-slate-700 hover:text-amber-600 hover:underline transition-colors block w-full"
            onClick={() => handleColaboradorClick(colaborador.id)}
          >
            {colaborador?.apellidos_colaborador}{" "}
            {colaborador?.nombre_colaborador}
          </span>
        </Tooltip>
      </td>
      <td className={tdClass}>{colaborador?.dni_colaborador || "-"}</td>
      <td className={tdClass}>{colaborador?.bco || "-"}</td>
      <td className={tdClass}>{colaborador?.nro_cuenta || "-"}</td>
      <td className={tdClass}>
        {totales?.salario_total ? renderMoney(salarioBruto) : "-"}
      </td>
      <td className={tdClass}>{renderMoney(montoAsignacionFamiliar)}</td>
      <td className={tdClass}>
        <Tooltip
          content={`${porcentajePension}% de pensión`}
          placement="top"
          delay={300}
        >
          <div className="w-full cursor-help">{renderMoney(montoPension)}</div>
        </Tooltip>
      </td>
      <td className={tdClass}>{renderMoney(descuentos)}</td>
      <td className={tdClass}>{renderMoney(descuentos_5ta)}</td>
      <td className={tdClass}>
        <Input
          isDisabled={isFinalizado || !totales?.id}
          type="text"
          placeholder="0"
          value={String(tardanza)}
          onChange={(e) => setTardanza(e.target.value)}
          onBlur={patchTotales}
          size="sm"
          classNames={{
            inputWrapper:
              "min-h-[25px] h-[25px] px-2 bg-transparent shadow-none hover:bg-slate-100 data-[focus=true]:bg-white data-[focus=true]:shadow-sm data-[focus=true]:border-slate-300 transition-all border border-transparent rounded-md",
            input: "text-[10px] text-center text-slate-700 font-semibold",
          }}
        />
      </td>
      <td className={tdLastClass}>{renderMoney(totalPorPagar)}</td>
    </tr>
  );
};

export default FilaPrincipal;
