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
  isFinalizado,
  totalSemanas,
  setSelectDatosText,
}) => {
  const [dataValidacionTxt, setDataValidacionTxt] = useState(null);
  const [totales, setTotales] = useState(null);

  const [isValidado, setIsValidado] = useState(false);
  const [isPagoMasivo, setIsPagoMasivo] = useState(false);

  const tdClass = "border-b border-slate-200 p-2 text-center h-[38px] bg-white";

  // --- LÓGICA CORREGIDA DEL ARREGLO GLOBAL ---
  const actualizarArregloGlobal = (estadoMasivo, datosValidacion) => {
    setSelectDatosText((prev) => {
      const prevArray = Array.isArray(prev) ? prev : [];

      if (estadoMasivo) {
        // Verificamos si ya existe el colaborador en el arreglo
        const existe = prevArray.some(
          (item) => item.colaborador.id === colaborador.id,
        );

        if (existe) {
          // Si ya existe, ACTUALIZAMOS sus datos para tener la información más reciente
          return prevArray.map((item) =>
            item.colaborador.id === colaborador.id
              ? { dataValidacionTxt: datosValidacion, colaborador }
              : item,
          );
        } else {
          // Si no existe, lo AGREGAMOS por primera vez
          return [
            ...prevArray,
            { dataValidacionTxt: datosValidacion, colaborador },
          ];
        }
      } else {
        // Si el estadoMasivo es false, lo ELIMINAMOS del arreglo
        return prevArray.filter(
          (item) => item.colaborador.id !== colaborador.id,
        );
      }
    });
  };

  const fetchValidacionTxt = () => {
    if (!semana_id || !colaborador?.id) return;

    const url = `${API}/validacion-planilla-txt/${semana_id}/${colaborador.id}`;

    axios
      .get(url, config)
      .then((res) => {
        const validacionData = res.data.validacion;
        setDataValidacionTxt(validacionData);
        setTotales(res.data.totales);

        if (validacionData) {
          setIsValidado(validacionData.validacion);
          setIsPagoMasivo(validacionData.enviar_pago_masivo);

          // Sincronizar con el arreglo global al cargar
          actualizarArregloGlobal(
            validacionData.enviar_pago_masivo,
            validacionData,
          );
        }
      })
      .catch((err) => console.error("Error cargando validacion txt:", err));
  };

  useEffect(() => {
    fetchValidacionTxt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semana_id, colaborador.id]);

  const salarioBruto = Number(totales?.salario_total || 0);
  const asigFamiliar = Number(
    colaborador?.asignacion_familiar / totalSemanas || 0,
  );

  const pensionEncontrada = [
    colaborador?.afp_integra,
    colaborador?.afp_prima,
    colaborador?.afp_horizonte,
    colaborador?.afp_profuturo,
    colaborador?.afp_habitat,
    colaborador?.onp,
  ].find((monto) => Number(monto) > 0);

  const porcentajePension = Number(pensionEncontrada || 0);
  const montoPension = (salarioBruto * porcentajePension) / 100;
  const descuentos = 0;
  const totalPorPagar = salarioBruto + asigFamiliar - montoPension - descuentos;

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

        // Actualizar el arreglo global tras guardar exitosamente
        actualizarArregloGlobal(
          updatedValidacion.enviar_pago_masivo,
          updatedValidacion,
        );
      })
      .catch((err) => {
        handleAxiosError(err);
        // Revertir estados visuales si falla
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
            isDisabled={isFinalizado || !dataValidacionTxt}
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
            isDisabled={isFinalizado || !dataValidacionTxt}
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
