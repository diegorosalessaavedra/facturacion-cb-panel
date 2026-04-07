import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Chip,
  Select,
  SelectItem,
  Input, // Añadido: Faltaba importar Input
} from "@nextui-org/react";
import { FiCheckCircle, FiAlertCircle, FiCreditCard } from "react-icons/fi";
import { formatNumber } from "../../../../assets/formats";
import formatDate from "../../../../hooks/FormatDate";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../assets/classNames";
import { useForm } from "react-hook-form";
import config from "../../../../utils/getToken";
import { toast } from "sonner";
import { API } from "../../../../utils/api";
import { handleAxiosError } from "../../../../utils/handleAxiosError";

const ModalVerPago = ({
  isOpen,
  onOpenChange,
  selectPago,
  handleFindCotizaciones,
}) => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false); // Estado para controlar la carga

  const isVerified = selectPago.datos_validacion !== null;

  // Función que procesa el envío al backend
  const onSubmit = async (data, estado) => {
    setLoading(true);

    const payload = {
      banco: data.banco,
      fecha_operacion: data.fecha_operacion,
      cargo_abono: data.cargo_abono,
      num_op: data.num_op,
      estado: estado,
    };

    const url = `${API}/ventas/pagos-cotizaciones/${selectPago.id}`;

    await axios
      .patch(url, payload, config)
      .then((res) => {
        toast.success(`El pago se a actualizó correctamente`);
        handleFindCotizaciones();
        reset();
        onOpenChange();
      })
      .catch((err) => handleAxiosError(err))
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="md"
      classNames={{
        base: "border-[#e4e4e7] border-1",
        header: "border-b-[1px] border-[#e4e4e7]",
        footer: "border-t-[1px] border-[#e4e4e7]",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-between items-center pr-10">
              <div className="flex flex-col">
                <p className="text-md font-bold text-slate-800">
                  Detalles del Pago
                </p>
                <p className="text-xs text-slate-500 font-normal">
                  ID Registro: #{selectPago.id}
                </p>
              </div>
              <Chip
                startContent={
                  isVerified ? (
                    <FiCheckCircle size={14} />
                  ) : (
                    <FiAlertCircle size={14} />
                  )
                }
                color={isVerified ? "success" : "warning"}
                variant="flat"
                size="sm"
              >
                {isVerified ? "Verificado" : "Pendiente"}
              </Chip>
            </ModalHeader>

            <ModalBody className="py-6 flex flex-col gap-6">
              {/* SECCIÓN 1: DATOS REGISTRADOS */}
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
                  <FiCreditCard /> Información Registrada
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">
                      Banco / Método
                    </p>
                    <p className="text-sm font-semibold">
                      {selectPago.banco?.banco || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">
                      Monto Recibido
                    </p>
                    <p className="text-sm font-bold text-blue-700">
                      S/. {formatNumber(selectPago.monto)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">
                      N° Operación
                    </p>
                    <p className="text-sm font-mono font-bold">
                      {selectPago.operacion || "S/N"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">
                      Fecha Reportada
                    </p>
                    <p className="text-sm font-semibold">
                      {formatDate(selectPago.fecha)}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: DATOS DE VERIFICACIÓN (SOLO SI EXISTE) */}
              <div className="flex flex-col gap-5 p-2 mt-4 border-t border-slate-200 pt-4">
                <h3 className="font-bold text-slate-800">
                  Datos de Validación
                </h3>

                {/* Formulario */}
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    isRequired
                    label="Selecciona el Banco"
                    labelPlacement="outside"
                    placeholder="Elige BBVA o BCP"
                    variant="bordered"
                    radius="sm"
                    size="sm"
                    classNames={selectClassNames}
                    {...register("banco")}
                    defaultSelectedKeys={
                      selectPago.datos_validacion
                        ? [selectPago.datos_validacion.banco]
                        : []
                    }
                    isDisabled={loading}
                  >
                    <SelectItem key="BCP" value="BCP">
                      BCP
                    </SelectItem>
                    <SelectItem key="BBVA" value="BBVA">
                      BBVA
                    </SelectItem>
                  </Select>

                  <Input
                    isRequired
                    type="date"
                    label="Fecha de Operación"
                    labelPlacement="outside"
                    placeholder=" "
                    variant="bordered"
                    size="sm"
                    {...register("fecha_operacion")}
                    defaultValue={
                      selectPago.datos_validacion?.fecha_operacion ||
                      selectPago.fecha ||
                      ""
                    }
                    classNames={inputClassNames}
                    isDisabled={loading}
                  />

                  <Input
                    type="number"
                    step="0.01"
                    label="Cargo / Abono"
                    labelPlacement="outside"
                    placeholder="0.00"
                    variant="bordered"
                    size="sm"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">S/.</span>
                      </div>
                    }
                    {...register("cargo_abono")}
                    defaultValue={
                      selectPago.datos_validacion?.cargo_abono ||
                      selectPago.monto ||
                      ""
                    }
                    classNames={inputClassNames}
                    isDisabled={loading}
                  />

                  <Input
                    label="N° de Operación"
                    labelPlacement="outside"
                    placeholder="Ej. 12345678"
                    variant="bordered"
                    size="sm"
                    {...register("num_op")}
                    defaultValue={
                      selectPago.datos_validacion?.num_op ||
                      selectPago.operacion ||
                      ""
                    }
                    classNames={inputClassNames}
                    isDisabled={loading}
                  />
                </form>

                {/* Botones de Acción */}
                <div className="flex gap-4 items- justify-end mt-2">
                  <Button
                    color="danger"
                    variant="flat"
                    isLoading={loading}
                    onPress={handleSubmit((data) =>
                      onSubmit(data, "Rechazado"),
                    )}
                    className="font-bold"
                    size="sm"
                  >
                    Depósito Rechazado
                  </Button>

                  <Button
                    color="success"
                    isLoading={loading}
                    onPress={handleSubmit((data) => onSubmit(data, "Conforme"))}
                    className="font-bold text-white"
                    size="sm"
                  >
                    Depósito Validado
                  </Button>
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                color="primary"
                onPress={onClose}
                size="sm"
                isDisabled={loading}
              >
                Cerrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalVerPago;
