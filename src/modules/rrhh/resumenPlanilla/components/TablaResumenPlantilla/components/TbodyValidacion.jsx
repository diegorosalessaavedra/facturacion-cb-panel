import React, { useEffect, useState } from "react";
import { Checkbox } from "@nextui-org/react";
import config from "../../../../../../utils/getToken";
import { API } from "../../../../../../utils/api";
import axios from "axios";
import { toast } from "sonner";
import { handleAxiosError } from "../../../../../../utils/handleAxiosError";

const TbodyValidacion = ({
  colaborador,
  semana_id,
  totalSemanas,
  setSelectDatosText,
}) => {
  const [dataValidacionTxt, setDataValidacionTxt] = useState(null);
  const [totales, setTotales] = useState(null);

  const [isValidado, setIsValidado] = useState(false);
  const [isPagoMasivo, setIsPagoMasivo] = useState(false);
  const [prestamos, setPrestamos] = useState([]);

  const tdClass = "border-b border-slate-200 p-2 text-center h-[38px] bg-white";

  const actualizarArregloGlobal = (estadoMasivo, datosValidacion) => {
    setSelectDatosText((prev) => {
      const prevArray = Array.isArray(prev) ? prev : [];

      if (estadoMasivo) {
        const existe = prevArray.some(
          (item) => item.colaborador.id === colaborador.id,
        );

        if (existe) {
          return prevArray.map((item) =>
            item.colaborador.id === colaborador.id
              ? { dataValidacionTxt: datosValidacion, colaborador }
              : item,
          );
        } else {
          return [
            ...prevArray,
            { dataValidacionTxt: datosValidacion, colaborador },
          ];
        }
      } else {
        return prevArray.filter(
          (item) => item.colaborador.id !== colaborador.id,
        );
      }
    });
  };

  useEffect(() => {
    if (!semana_id || !colaborador?.id) return;

    // 1. Cargar Totales según la agrupación del colaborador
    const esAdmin = colaborador?.cargo_laboral?.agrupacion_cargo === "ADMINISTRATIVOS";
    const endpointTotales = esAdmin
      ? `${API}/totales-asistencia-administrativo/${semana_id}/${colaborador.id}`
      : `${API}/totales-asistencia-operativo/${semana_id}/${colaborador.id}`;

    axios.get(endpointTotales, config).then((res) => {
      if (res.data.totales?.id) {
        setTotales(res.data.totales);
      }
    });

    // 2. Cargar Prestamos
    const urlPrestamos = `${API}/prestamos/${semana_id}/${colaborador.id}`;
    axios.get(urlPrestamos, config).then((res) => {
      if (res.data.pago_encontrados) {
        setPrestamos(res.data.pago_encontrados);
      }
    });

    // 3. Cargar Validación TXT
    const urlValidacion = `${API}/validacion-planilla-txt/${semana_id}/${colaborador.id}`;
    axios
      .get(urlValidacion, config)
      .then((res) => {
        const validacionData = res.data.validacion;
        setDataValidacionTxt(validacionData);

        if (validacionData) {
          setIsValidado(validacionData.validacion);
          setIsPagoMasivo(validacionData.enviar_pago_masivo);

          actualizarArregloGlobal(
            validacionData.enviar_pago_masivo,
            validacionData,
          );
        }
      })
      .catch((err) => console.error("Error cargando validación txt:", err));
  }, [semana_id, colaborador?.id]);

  const esAdministrativo =
    colaborador?.cargo_laboral?.agrupacion_cargo === "ADMINISTRATIVOS";

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

  const divisorSemanas = Number(totalSemanas || 1) > 0 ? Number(totalSemanas) : 4;


  const montoAsignacionFamiliar = esAdministrativo
    ? asigFamiliar / divisorSemanas
    : asigFamiliar / 4;

  const salarioAfp = salarioBruto + montoAsignacionFamiliar

  const montoPension = (salarioAfp * porcentajePension) / 100;

  const descuentos = prestamos.reduce(
    (acc, pago) => acc + Number(pago.importe_cuota || 0),
    0
  );

  // Asegurar divisor válido para evitar divisiones entre 0



  const totalPorPagar =
    salarioBruto + montoAsignacionFamiliar - montoPension - descuentos;

  const handlePatch = (nuevoValidacion, nuevoPagoMasivo) => {
    if (!dataValidacionTxt?.id) {
      toast.error("Error: No existe el registro base de validación.");
      return;
    }

    const url = `${API}/validacion-planilla-txt/${dataValidacionTxt.id}`;

    const payload = {
      validacion: nuevoValidacion,
      enviar_pago_masivo: nuevoPagoMasivo,
      monto: totalPorPagar,
    };

    axios
      .patch(url, payload, config)
      .then((res) => {
        const updatedValidacion = res.data.validacionTxt;
        setDataValidacionTxt(updatedValidacion);

        setIsValidado(updatedValidacion.validacion);
        setIsPagoMasivo(updatedValidacion.enviar_pago_masivo);

        actualizarArregloGlobal(
          updatedValidacion.enviar_pago_masivo,
          updatedValidacion,
        );
      })
      .catch((err) => {
        handleAxiosError(err);
        setIsValidado(dataValidacionTxt.validacion);
        setIsPagoMasivo(dataValidacionTxt.enviar_pago_masivo);
      });
  };

  const onChangeValidado = (isSelected) => {
    setIsValidado(isSelected);
    handlePatch(isSelected, isPagoMasivo);
  };

  const onChangePagoMasivo = (isSelected) => {
    setIsPagoMasivo(isSelected);
    handlePatch(isValidado, isSelected);
  };

  return (
    <tr className="hover:bg-blue-50/50 transition-colors group">
      <td className={`border-r border-slate-200 ${tdClass}`}>
        <div className="flex w-full justify-center">
          <Checkbox
            color="success"
            size="sm"
            isSelected={isValidado}
            onValueChange={onChangeValidado}
            isDisabled={!dataValidacionTxt}
            classNames={{
              wrapper: "m-0 rounded-full border-2 border-green-500",
            }}
          />
        </div>
      </td>
      <td className={tdClass}>
        <div className="flex w-full justify-center">
          <Checkbox
            color="success"
            size="sm"
            isSelected={isPagoMasivo}
            onValueChange={onChangePagoMasivo}
            isDisabled={!dataValidacionTxt}
            classNames={{
              wrapper: "m-0 rounded-full border-2 border-green-500",
            }}
          />
        </div>
      </td>
    </tr>
  );
};

export default TbodyValidacion;