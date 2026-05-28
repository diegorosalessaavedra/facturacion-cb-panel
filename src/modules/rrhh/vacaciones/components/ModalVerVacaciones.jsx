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
} from "@nextui-org/react";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiCalendar,
  FiEye,
  FiDownload,
  FiUploadCloud,
} from "react-icons/fi";
import config from "../../../../utils/getToken";
import { toast } from "sonner";
import { API, API_DOC } from "../../../../utils/api";
import { handleAxiosError } from "../../../../utils/handleAxiosError";
import formatDate from "../../../../hooks/FormatDate";
import { generarDocumentoWordVacaciones } from "../../../../utils/pantillasWord/generarWordVacaciones";

const ModalVerVacaciones = ({
  isOpen,
  onOpenChange,
  selectVacacion,
  selectColaborador,
  handleFindColaboradores,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  if (!selectVacacion || !selectColaborador) return null;

  const estadoActual = selectVacacion.pendiente_autorizacion;
  const adjuntoLink = selectVacacion.solicitud_adjunto;

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "ACEPTADO":
        return "success";
      case "PENDIENTE":
        return "warning";
      case "RECHAZADO":
        return "danger";
      default:
        return "default";
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "ACEPTADO":
        return <FiCheckCircle size={14} />;
      case "RECHAZADO":
        return <FiXCircle size={14} />;
      default:
        return <FiAlertCircle size={14} />;
    }
  };

  // === MANEJADOR DEL BOTÓN DE DESCARGA ===
  const handleDownload = async (tipo_solicitud) => {
    setIsDownloading(true);
    try {
      await generarDocumentoWordVacaciones(
        tipo_solicitud,
        selectColaborador,
        selectVacacion,
      );
      toast.success("Documento descargado con éxito");
    } catch (error) {
      toast.error("Hubo un error al generar el documento Word");
    } finally {
      setIsDownloading(false);
    }
  };

  // === MANEJADOR DE SUBIDA DE FORMATO ===
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Crear el FormData para enviar archivos vía multipart/form-data
    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    const url = `${API}/rrhh/vacaciones/cargar-formato/${selectVacacion.id}`;

    try {
      await axios.patch(url, formData, {
        ...config,
        headers: {
          ...config.headers,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("El formato se ha cargado correctamente");
      handleFindColaboradores();
      onOpenChange(); // Cierra el modal automáticamente después de cargar si así lo deseas
    } catch (error) {
      handleAxiosError(error);
      toast.error("Error al cargar el formato");
    } finally {
      setIsUploading(false);
      event.target.value = null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="md"
      classNames={{
        base: "h-[85vh] border-[#e4e4e7] border-1 ",
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
                  Detalles de Vacación
                </p>
                <p className="text-xs text-slate-500 font-normal truncate max-w-[200px]">
                  {selectColaborador?.nombre_colaborador}
                </p>
              </div>
              <Chip
                startContent={getEstadoIcon(estadoActual)}
                color={getEstadoColor(estadoActual)}
                variant="flat"
                size="sm"
              >
                {estadoActual}
              </Chip>
            </ModalHeader>

            <ModalBody className="py-6 flex flex-col gap-6 overflow-y-auto">
              {/* SECCIÓN 1: DATOS REGISTRADOS */}
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
                  <FiCalendar /> Información Solicitada
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Tipo</p>
                    <p className="text-sm font-semibold">
                      {selectVacacion.tipo_vaciones}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">
                      Días Totales
                    </p>
                    <p className="text-sm font-bold text-blue-700">
                      {selectVacacion.dias_totales} Días
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">
                      Fecha Inicio
                    </p>
                    <p className="text-sm font-semibold">
                      {formatDate(selectVacacion.fecha_inicio)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">
                      Fecha Final
                    </p>
                    <p className="text-sm font-semibold">
                      {formatDate(selectVacacion.fecha_final)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-slate-500 uppercase">
                      Año Asignado
                    </p>
                    <p className="text-sm font-mono font-bold">
                      {selectVacacion.year_vacaciones}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: GESTIÓN */}
              <div className="flex flex-col gap-5 p-2 mt-2 border-t border-slate-200 pt-4">
                <h3 className="font-bold text-slate-800">
                  Gestión de Autorización
                </h3>

                {/* BOTONES DE FORMATO DINÁMICOS */}
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-600">
                    Formatos Disponibles
                  </span>
                  {selectVacacion.tipo_vaciones === "COMPRA" ? (
                    <Button
                      color="secondary"
                      variant="flat"
                      size="sm"
                      isLoading={isDownloading}
                      startContent={!isDownloading && <FiDownload />}
                      className="justify-start font-medium"
                      onPress={() => handleDownload("COMPRA")}
                    >
                      Descargar formato Compra
                    </Button>
                  ) : (
                    <Button
                      color="secondary"
                      variant="flat"
                      size="sm"
                      isLoading={isDownloading}
                      startContent={!isDownloading && <FiDownload />}
                      className="justify-start font-medium"
                      onPress={() => handleDownload("SOLICITUD")}
                    >
                      Descargar formato Solicitud
                    </Button>
                  )}
                </div>

                {/* =========================================
                    SECCIÓN DE ARCHIVO ADJUNTO Y CARGA
                ========================================= */}
                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-sm font-medium text-slate-600">
                    Documento Adjunto
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Input file oculto */}
                    <input
                      type="file"
                      id={`upload-formato-${selectVacacion.id}`}
                      className="hidden"
                      accept=".pdf, .doc, .docx, .xls, .xlsx"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />

                    {/* Botón que actúa como label para abrir el input de archivos */}
                    <Button
                      as="label"
                      htmlFor={`upload-formato-${selectVacacion.id}`}
                      color="primary"
                      variant="flat"
                      size="sm"
                      isLoading={isUploading}
                      startContent={!isUploading && <FiUploadCloud />}
                      className="cursor-pointer font-medium"
                    >
                      {adjuntoLink ? "Reemplazar formato" : "Cargar formato"}
                    </Button>

                    {/* Botón de visualización (solo aparece si hay archivo) */}
                    {adjuntoLink && (
                      <Button
                        as="a"
                        href={
                          adjuntoLink.startsWith("http")
                            ? adjuntoLink
                            : `${API_DOC}/solped/${adjuntoLink}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        color="default"
                        variant="bordered"
                        startContent={<FiEye />}
                        className="font-medium"
                      >
                        Ver Archivo
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                color="primary"
                variant="light"
                onPress={() => onClose()}
                size="sm"
                isDisabled={isUploading}
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

export default ModalVerVacaciones;
