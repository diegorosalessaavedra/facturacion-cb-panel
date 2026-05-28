import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

import config from "../../../../utils/getToken";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../assets/classNames";
import Loading from "../../../../hooks/Loading";
import { onInputNumber } from "../../../../assets/onInputs";

// Función auxiliar para obtener la fecha de hoy en formato YYYY-MM-DD
const obtenerFechaActual = () => {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const day = String(hoy.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ModalAgregarVaciones = ({
  isOpen,
  onOpenChange,
  handleFindColaboradores,
  selectColaborador,
}) => {
  const fechaHoy = obtenerFechaActual();

  // === 1. ESTADOS LOCALES PARA LAS FECHAS Y DÍAS ===
  const [fechaInicio, setFechaInicio] = useState(fechaHoy);
  const [fechaFinal, setFechaFinal] = useState(fechaHoy);
  const [diasTotales, setDiasTotales] = useState(1);
  const [esInvalidoPorMaximo, setEsInvalidoPorMaximo] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue, // Seguimos usándolo para registrar el valor en react-hook-form de forma interna
  } = useForm({
    defaultValues: {
      fecha_solicitud: fechaHoy,
      fecha_inicio: fechaHoy,
      fecha_final: fechaHoy,
      dias_totales: "1",
    },
  });

  const [loading, setLoading] = useState(false);

  // === 2. EFECTO PARA CALCULAR LOS DÍAS MEDIANTE LOS ESTADOS ===
  useEffect(() => {
    if (fechaInicio && fechaFinal) {
      const [year1, month1, day1] = fechaInicio.split("-");
      const [year2, month2, day2] = fechaFinal.split("-");

      const dInicio = new Date(year1, month1 - 1, day1);
      const dFinal = new Date(year2, month2 - 1, day2);

      const diferenciaMilisegundos = dFinal - dInicio;

      if (diferenciaMilisegundos >= 0) {
        const dias =
          Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24)) + 1;

        setDiasTotales(dias);
        setValue("dias_totales", dias.toString());

        // Validamos si supera el límite de 15 días
        if (dias > 15) {
          setEsInvalidoPorMaximo(true);
        } else {
          setEsInvalidoPorMaximo(false);
        }
      } else {
        setDiasTotales(0);
        setValue("dias_totales", "0");
        setEsInvalidoPorMaximo(false);
      }
    }
  }, [fechaInicio, fechaFinal, setValue]);

  // Manejador para limpiar estados al cerrar el modal
  const handleLimpiarFormulario = () => {
    setFechaInicio(fechaHoy);
    setFechaFinal(fechaHoy);
    setDiasTotales(1);
    setEsInvalidoPorMaximo(false);
    reset();
  };

  const submit = (data) => {
    // Protección extra en el submit
    if (diasTotales > 15) {
      toast.error("No se puede registrar un periodo mayor a 15 días.");
      return;
    }

    setLoading(true);
    const url = `${import.meta.env.VITE_URL_API}/rrhh/vacaciones/${
      selectColaborador?.id
    }`;

    axios
      .post(url, data, config)
      .then(() => {
        handleFindColaboradores();
        handleLimpiarFormulario();
        onOpenChange(false);
        toast.success(`El periodo de vacaciones se registró correctamente`);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message ||
            "Hubo un error al registrar el periodo de vacaciones",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) handleLimpiarFormulario();
      }}
      backdrop="blur"
      size="2xl"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-base">
          Agregar Vacaciones para {selectColaborador?.nombre_colaborador}
        </ModalHeader>
        <ModalBody>
          {loading && <Loading />}
          <div className="w-full flex flex-col">
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(submit)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  isRequired
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="date"
                  label="Fecha de Solicitud"
                  {...register("fecha_solicitud")}
                  variant="bordered"
                  radius="sm"
                  size="sm"
                />

                <Input
                  isRequired
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  label="Días Totales"
                  placeholder="Ej: 15"
                  onInput={onInputNumber}
                  isReadOnly
                  value={diasTotales.toString()}
                  // Interfaz de error si excede los 15 días
                  isInvalid={esInvalidoPorMaximo}
                  color={esInvalidoPorMaximo ? "danger" : "default"}
                  errorMessage={
                    esInvalidoPorMaximo
                      ? "El máximo permitido es de 15 días"
                      : ""
                  }
                  variant="bordered"
                  radius="sm"
                  size="sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  isRequired
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="date"
                  label="Fecha de Inicio"
                  variant="bordered"
                  radius="sm"
                  size="sm"
                  // Desestructuramos lo de React Hook Form pero sobreescribimos el value y onChange
                  {...register("fecha_inicio")}
                  value={fechaInicio}
                  onChange={(e) => {
                    setFechaInicio(e.target.value);
                    setValue("fecha_inicio", e.target.value); // Mantiene sincronizado el hook form
                  }}
                />

                <Input
                  isRequired
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="date"
                  label="Fecha Final"
                  variant="bordered"
                  radius="sm"
                  size="sm"
                  // Desestructuramos lo de React Hook Form pero sobreescribimos el value y onChange
                  {...register("fecha_final")}
                  value={fechaFinal}
                  onChange={(e) => {
                    setFechaFinal(e.target.value);
                    setValue("fecha_final", e.target.value); // Mantiene sincronizado el hook form
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  isRequired
                  label="Tipo de Vacaciones"
                  labelPlacement="outside"
                  placeholder="Selecciona el tipo"
                  {...register("tipo_vaciones")}
                  variant="bordered"
                  classNames={selectClassNames}
                  radius="sm"
                  size="sm"
                >
                  <SelectItem key="SOLICITUD" value="SOLICITUD">
                    SOLICITUD
                  </SelectItem>
                  <SelectItem key="COMPRA" value="COMPRA">
                    COMPRA
                  </SelectItem>
                </Select>
              </div>

              <div className="w-full flex items-center justify-end gap-3 p-4 mt-2">
                <Button
                  color="danger"
                  type="button"
                  variant="light"
                  onPress={() => {
                    onOpenChange(false);
                    handleLimpiarFormulario();
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={loading}
                  // Se deshabilita el botón si los días no cumplen el requerimiento
                  isDisabled={esInvalidoPorMaximo || diasTotales <= 0}
                >
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalAgregarVaciones;
