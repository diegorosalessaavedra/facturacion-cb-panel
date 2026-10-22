import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import { toast } from "sonner";
import axios from "axios";
import { useForm } from "react-hook-form";

import { handleAxiosError } from "../../../../utils/handleAxiosError";
import { API, API_DOC } from "../../../../utils/api";
import config from "../../../../utils/getToken";

const ModalCpSemana = ({ selectSemana, isOpen, onOpenChange }) => {
  const [cpAdjunto, setCpAdjunto] = useState(null);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  // Referencia al input file oculto para abrirlo desde un botón personalizado
  const fileInputRef = useRef(null);

  const { handleSubmit, register, reset, setValue } = useForm();

  // Buscar si ya existe un archivo para esta semana
  const fetchCpSemana = async () => {
    if (!selectSemana?.id || !isOpen) return;

    setLoadingFetch(true);
    // Asumimos que tienes una ruta GET en tu backend que recibe el ID de la semana
    // y te devuelve el registro de CpSemanaPlanilla si existe.
    const url = `${API}/cp-semana-planilla/${selectSemana.id}`;

    axios
      .get(url, config)
      .then((res) => {
        setCpAdjunto(res.data.cpSemanaPlanilla);
      })
      .catch((err) => {
        // Si el backend tira un 404 porque no existe, está bien, solo seteamos a null.
        if (err.response?.status === 404) {
          setCpAdjunto(null);
        } else {
          handleAxiosError(err);
        }
      })
      .finally(() => {
        setLoadingFetch(false);
      });
  };

  useEffect(() => {
    fetchCpSemana();

    // Limpiar estados cuando se cierra el modal
    if (!isOpen) {
      setCpAdjunto(null);
      setSelectedFileName("");
      reset();
    }
  }, [selectSemana, isOpen]);

  // Manejar el submit (Crear o Actualizar)
  const submit = (data) => {
    if (!data.file || data.file.length === 0) {
      toast.error("Seleccione un archivo primero");
      return;
    }

    setLoadingSubmit(true);
    const formData = new FormData();
    formData.append("file", data.file[0]);

    // Lógica para decidir si es POST (crear) o PATCH/PUT (actualizar)
    const isUpdate = !!cpAdjunto;
    const method = isUpdate ? "patch" : "post";
    // Asegúrate de que las rutas coincidan con tu backend
    const url = isUpdate
      ? `${API}/cp-semana-planilla/${cpAdjunto.id}` // Para update
      : `${API}/cp-semana-planilla/${selectSemana.id}`; // Para create

    const toastId = toast.loading(
      isUpdate ? "Actualizando archivo..." : "Subiendo archivo...",
    );

    axios[method](url, formData, config)
      .then((res) => {
        toast.success("Archivo guardado correctamente", { id: toastId });
        setCpAdjunto(res.data.cpSemanaPLanilla || res.data.data);
        setSelectedFileName("");
        reset();
      })
      .catch((err) => {
        toast.error("Error al guardar archivo", { id: toastId });
        handleAxiosError(err);
      })
      .finally(() => {
        setLoadingSubmit(false);
      });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    } else {
      setSelectedFileName("");
    }
  };

  const handleVerAdjunto = () => {
    if (cpAdjunto?.file_url) {
      // Reemplaza esto con la URL base de tus archivos estáticos si es necesario
      const fileUrl = `${API_DOC}/solped/${cpAdjunto.file_url}`;
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="xl" // Reduje el tamaño porque un formulario de un solo archivo no necesita '5xl'
      classNames={{
        base: "rounded-[24px] overflow-hidden",
        header: "p-4 pb-0 bg-transparent z-20",
        body: "p-6",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-lg font-bold text-slate-800">
              Adjunto de la Semana {selectSemana?.numero_semana}
            </ModalHeader>
            <ModalBody>
              {loadingFetch ? (
                <div className="flex justify-center items-center py-10">
                  <Spinner size="lg" color="primary" />
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* SI YA EXISTE UN ADJUNTO: Mostrar botón de ver */}
                  {cpAdjunto ? (
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex flex-col items-center justify-center gap-3">
                      <p className="text-sm text-blue-800 font-medium text-center">
                        Ya existe un archivo guardado para esta semana.
                      </p>
                      <Button
                        color="primary"
                        variant="shadow"
                        onPress={handleVerAdjunto}
                      >
                        Ver Archivo Actual
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                      <p className="text-sm text-slate-500 text-center">
                        No hay ningún archivo adjunto subido todavía.
                      </p>
                    </div>
                  )}

                  {/* FORMULARIO PARA SUBIR/REEMPLAZAR ARCHIVO */}
                  <div className="border-t border-slate-200 pt-6">
                    <h4 className="text-sm font-bold text-slate-700 mb-3 text-center">
                      {cpAdjunto
                        ? "¿Deseas reemplazar el archivo?"
                        : "Subir nuevo archivo"}
                    </h4>

                    <form
                      className="flex flex-col items-center gap-4"
                      onSubmit={handleSubmit(submit)}
                    >
                      {/* Input oculto gestionado por react-hook-form */}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,application/pdf"
                        {...register("file", {
                          onChange: handleFileChange,
                        })}
                        ref={(e) => {
                          register("file").ref(e);
                          fileInputRef.current = e;
                        }}
                      />

                      <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
                        <Button
                          color="default"
                          variant="bordered"
                          onPress={() => fileInputRef.current?.click()}
                        >
                          Seleccionar Archivo
                        </Button>

                        <Button
                          type="submit"
                          color={cpAdjunto ? "warning" : "success"}
                          className="font-bold text-white"
                          isLoading={loadingSubmit}
                          isDisabled={!selectedFileName}
                        >
                          {cpAdjunto ? "Reemplazar Adjunto" : "Guardar Adjunto"}
                        </Button>
                      </div>

                      {selectedFileName && (
                        <p className="text-xs text-slate-500 font-medium">
                          Seleccionado:{" "}
                          <span className="text-slate-800">
                            {selectedFileName}
                          </span>
                        </p>
                      )}
                    </form>
                  </div>
                </div>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalCpSemana;
