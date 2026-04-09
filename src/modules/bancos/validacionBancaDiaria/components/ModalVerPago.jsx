import React, { useState, useEffect } from "react";
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
  Input,
  Textarea,
} from "@nextui-org/react";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiCreditCard,
  FiXCircle,
  FiUploadCloud, // <-- Importado para el diseño del input file
  FiEye, // <-- Importado para previsualizar la imagen
} from "react-icons/fi";
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
  const {
    register,
    handleSubmit,
    reset,
    watch, // <-- Extraemos watch para monitorear el archivo seleccionado
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  // Observamos el campo del archivo en tiempo real
  const fileVoucher = watch("file_voucher");

  useEffect(() => {
    if (isOpen) {
      setIsRejecting(false);
    }
  }, [isOpen]);

  if (!selectPago) return null;

  const estadoActual = selectPago.estado_verificacion;
  const savedVoucherLink = selectPago.datos_validacion?.link_file; // Por si ya existe un voucher guardado

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Conforme":
        return "success";
      case "Observado":
        return "warning";
      case "Rechazado":
        return "danger";
      default:
        return "default";
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "Conforme":
        return <FiCheckCircle size={14} />;
      case "Rechazado":
        return <FiXCircle size={14} />;
      default:
        return <FiAlertCircle size={14} />;
    }
  };

  // Función para abrir la imagen en una nueva pestaña
  const handlePreviewVoucher = () => {
    if (fileVoucher && fileVoucher.length > 0) {
      // Imagen recién seleccionada desde la PC
      const file = fileVoucher[0];
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl, "_blank");
    } else if (savedVoucherLink) {
      window.open(`${API_DOC}/${savedVoucherLink}`, "_blank");
    }
  };

  const onSubmit = async (data, estado) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("banco", data.banco);
    formData.append("fecha_operacion", data.fecha_operacion);
    formData.append("cargo_abono", data.cargo_abono);
    formData.append("num_op", data.num_op);
    formData.append("estado_verificacion", estado);

    if (data.observacion_validacion) {
      formData.append("observacion_validacion", data.observacion_validacion);
    }

    if (estado === "Rechazado" && data.observaciones_rechazo) {
      formData.append("observaciones_rechazo", data.observaciones_rechazo);
    }

    if (data.file_voucher && data.file_voucher.length > 0) {
      formData.append("file", data.file_voucher[0]);
    }

    const url = `${API}/ventas/pagos-cotizaciones/${selectPago.id}`;

    await axios
      .patch(url, formData, config)
      .then((res) => {
        toast.success(`El pago se actualizó a: ${estado}`);
        handleFindCotizaciones();
        reset();
        setIsRejecting(false);
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
        base: "h-[90vh] border-[#e4e4e7] border-1 ",
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
                startContent={getEstadoIcon(estadoActual)}
                color={getEstadoColor(estadoActual)}
                variant="flat"
                size="sm"
                className="capitalize"
              >
                {estadoActual || "Pendiente"}
              </Chip>
            </ModalHeader>

            <ModalBody className="py-6 flex flex-col gap-6 overflow-y-auto">
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

              {/* SECCIÓN 2: DATOS DE VERIFICACIÓN */}
              <div className="flex flex-col gap-5 p-2 mt-4 border-t border-slate-200 pt-4">
                <h3 className="font-bold text-slate-800">
                  Datos de Validación
                </h3>

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
                    {...register("banco", { required: "Selecciona un banco" })}
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
                    <SelectItem key="AHORROS" value="AHORROS">
                      AHORROS
                    </SelectItem>
                  </Select>

                  <Input
                    isRequired
                    type="date"
                    label="Fecha de Operación"
                    labelPlacement="outside"
                    variant="bordered"
                    size="sm"
                    {...register("fecha_operacion", {
                      required: "Fecha requerida",
                    })}
                    defaultValue={
                      selectPago.datos_validacion?.fecha_operacion ||
                      selectPago.fecha ||
                      ""
                    }
                    classNames={inputClassNames}
                    isDisabled={loading}
                  />

                  <Input
                    isRequired
                    type="number"
                    step="0.01"
                    label="Cargo / Abono"
                    labelPlacement="outside"
                    placeholder="0.00"
                    variant="bordered"
                    size="sm"
                    startContent={
                      <span className="text-default-400 text-small">S/.</span>
                    }
                    {...register("cargo_abono", {
                      required: "Monto requerido",
                    })}
                    defaultValue={
                      selectPago.datos_validacion?.cargo_abono ||
                      selectPago.monto ||
                      ""
                    }
                    classNames={inputClassNames}
                    isDisabled={loading}
                  />

                  <Input
                    isRequired
                    label="N° de Operación"
                    labelPlacement="outside"
                    placeholder="Ej. 12345678"
                    variant="bordered"
                    size="sm"
                    {...register("num_op", { required: "N° requerido" })}
                    defaultValue={
                      selectPago.datos_validacion?.num_op ||
                      selectPago.operacion ||
                      ""
                    }
                    classNames={inputClassNames}
                    isDisabled={loading}
                  />

                  {/* NUEVO DISEÑO MEJORADO: Voucher de Pago */}
                  <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5 mt-2">
                    <label className="text-sm font-medium text-slate-700">
                      Voucher de Validación
                    </label>

                    <div className="flex items-center gap-3 h-[40px]">
                      {/* Área de subida estilizada */}
                      <label
                        className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2 h-full border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                          fileVoucher && fileVoucher.length > 0
                            ? "border-primary-400 bg-primary-50 text-primary-700"
                            : "border-slate-300 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:border-slate-400"
                        } ${loading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
                      >
                        <FiUploadCloud className="text-lg" />
                        <span className="text-sm font-medium truncate max-w-[200px]">
                          {fileVoucher && fileVoucher.length > 0
                            ? fileVoucher[0].name
                            : "Haz clic para subir una imagen"}
                        </span>

                        {/* Input nativo oculto */}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          {...register("file_voucher")}
                          disabled={loading}
                        />
                      </label>

                      {((fileVoucher && fileVoucher.length > 0) ||
                        savedVoucherLink) && (
                        <Button
                          isIconOnly
                          color={
                            fileVoucher && fileVoucher.length > 0
                              ? "primary"
                              : "default"
                          }
                          variant="flat"
                          onPress={handlePreviewVoucher}
                          title="Ver Imagen"
                          radius="md"
                          className="h-full px-2 min-w-[40px] shadow-sm"
                        >
                          <FiEye size={18} />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Observación General */}
                  <div className="col-span-1 md:col-span-2 mt-1">
                    <Textarea
                      label="Observación de Validación"
                      labelPlacement="outside"
                      placeholder="Agrega notas adicionales sobre esta validación..."
                      variant="bordered"
                      radius="sm"
                      {...register("observacion_validacion")}
                      defaultValue={
                        selectPago.datos_validacion?.observacion_validacion ||
                        ""
                      }
                      isDisabled={loading}
                    />
                  </div>

                  {/* CAMPO DE OBSERVACIONES DE RECHAZO (Condicional) */}
                  {isRejecting && (
                    <div className="col-span-1 md:col-span-2 mt-2">
                      <Textarea
                        isRequired
                        label="Motivo de Rechazo"
                        labelPlacement="outside"
                        placeholder="Escribe el motivo por el cual rechazas este pago..."
                        variant="bordered"
                        radius="sm"
                        {...register("observaciones_rechazo", {
                          required: "El motivo de rechazo es obligatorio",
                        })}
                        isInvalid={!!errors.observaciones_rechazo}
                        errorMessage={errors.observaciones_rechazo?.message}
                        isDisabled={loading}
                      />
                    </div>
                  )}
                </form>

                <div className="flex gap-2 items-center justify-end mt-2 flex-wrap">
                  {!isRejecting ? (
                    <>
                      <Button
                        color="danger"
                        variant="flat"
                        onPress={() => setIsRejecting(true)}
                        className="font-bold text-xs"
                        size="sm"
                      >
                        Rechazar
                      </Button>

                      <Button
                        color="success"
                        isLoading={loading}
                        onPress={handleSubmit((data) =>
                          onSubmit(data, "Conforme"),
                        )}
                        className="font-bold text-white text-xs"
                        size="sm"
                      >
                        Validar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        color="default"
                        variant="flat"
                        onPress={() => {
                          setIsRejecting(false);
                          reset({ observaciones_rechazo: "" });
                        }}
                        className="font-bold text-xs"
                        size="sm"
                        isDisabled={loading}
                      >
                        Cancelar Rechazo
                      </Button>

                      <Button
                        color="danger"
                        isLoading={loading}
                        onPress={handleSubmit((data) =>
                          onSubmit(data, "Rechazado"),
                        )}
                        className="font-bold text-white text-xs"
                        size="sm"
                      >
                        Confirmar Rechazo
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                color="primary"
                onPress={() => {
                  onClose();
                  reset();
                  setIsRejecting(false);
                }}
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
