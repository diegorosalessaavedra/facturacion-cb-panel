import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";
import { API } from "../../../../utils/api";
import config from "../../../../utils/getToken";
import { handleAxiosError } from "../../../../utils/handleAxiosError";

const ModalSubirSustento = ({
  isOpen,
  onOpenChange,
  prestamo,
  fetchPrestamos,
}) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!prestamo) return null;

  const nombreTrabajador = prestamo.colaborador
    ? `${prestamo.colaborador.apellidos_colaborador} ${prestamo.colaborador.nombre_colaborador}`
    : "Trabajador no encontrado";

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (onClose) => {
    if (!file) {
      toast.error("Por favor, selecciona un archivo primero.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file); // Asegúrate de que el nombre "file" coincida con tu configuración de Multer en el backend

    try {
      const url = `${API}/prestamos/${prestamo.id}`;
      await axios.patch(url, formData, config);

      toast.success("Sustento adjuntado correctamente");
      if (fetchPrestamos) fetchPrestamos(); // Recarga la tabla si pasas esta función como prop
      onClose();
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="md"
      classNames={{
        base: "rounded-[24px] bg-slate-50",
        header: "p-6 pb-2 text-slate-900 font-bold",
        body: "p-6 pt-2",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Adjuntar Sustento de Préstamo</ModalHeader>
            <ModalBody>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">
                  Trabajador
                </p>
                <p className="text-sm text-slate-800 font-semibold mb-2">
                  {nombreTrabajador}
                </p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">
                  Fecha de Desembolso
                </p>
                <p className="text-sm text-slate-800 font-semibold">
                  {prestamo.fecha_desembolso}
                </p>
              </div>

              {prestamo.archivo_adjunto && (
                <div className="mb-2 p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-medium">
                  Ya existe un archivo guardado. Al subir uno nuevo, reemplazará
                  al actual.
                </div>
              )}

              <div className="flex flex-col gap-2 mt-2">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Seleccionar Archivo
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-sm text-slate-600 bg-white border border-slate-200 rounded-md cursor-pointer file:cursor-pointer file:mr-4 file:py-2.5 file:px-4 file:rounded-l-md file:border-0 file:text-xs file:font-bold file:bg-green-600 file:text-white hover:file:bg-green-700 transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="flat"
                  onPress={onClose}
                  className="text-slate-700 bg-slate-200 hover:bg-slate-300 font-bold"
                  size="sm"
                >
                  Cancelar
                </Button>
                <Button
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold"
                  size="sm"
                  onPress={() => handleUpload(onClose)}
                  isLoading={loading}
                >
                  Guardar Archivo
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalSubirSustento;
