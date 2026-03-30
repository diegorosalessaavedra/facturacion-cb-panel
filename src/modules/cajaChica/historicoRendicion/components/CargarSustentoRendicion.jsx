import { useState, useRef } from "react";
import { API, API_DOC } from "../../../../utils/api";
import axios from "axios";
import { toast } from "sonner";
import { handleAxiosError } from "../../../../utils/handleAxiosError";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
} from "@nextui-org/react";
import config from "../../../../utils/getToken";
import { Upload, Eye, FileText, X } from "lucide-react";

const CargarSustentoRendicion = ({
  isOpen,
  onOpenChange,
  selectRendicion,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  // Función para subir el archivo al backend
  const handleUploadSustento = async (onClose) => {
    if (!file) {
      toast.error("Por favor, selecciona un archivo primero.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file); // El nombre "file" debe coincidir con tu multer en el backend

    const url = `${API}/caja-chica/rendicion/sustento/${selectRendicion.id}`;

    try {
      await axios.patch(url, formData, {
        ...config,
        headers: {
          ...config.headers,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("¡Sustento cargado correctamente!");
      setFile(null);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setLoading(false);
    }
  };

  // Función para ver el sustento en una pestaña nueva
  const handleViewSustento = () => {
    if (selectRendicion?.sustento_link) {
      window.open(
        `${API_DOC}/solped/${selectRendicion.sustento_link}`,
        "_blank",
      );
    } else {
      toast.error("No hay un sustento registrado para esta rendición.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="md"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-lg font-bold">
              Gestionar Sustento de Rendición
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-6 py-4">
                {/* SECCIÓN VER SUSTENTO */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Sustento Actual
                  </p>
                  <Button
                    variant="flat"
                    color={
                      selectRendicion?.sustento_link ? "primary" : "default"
                    }
                    startContent={<Eye size={18} />}
                    onPress={handleViewSustento}
                    isDisabled={!selectRendicion?.sustento_link}
                    className="w-full font-medium"
                  >
                    {selectRendicion?.sustento_link
                      ? "Ver Documento Actual"
                      : "Sin documento adjunto"}
                  </Button>
                </div>

                <hr className="border-slate-200" />

                {/* SECCIÓN CARGAR NUEVO */}
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {selectRendicion?.sustento_link
                      ? "Actualizar Sustento"
                      : "Cargar Nuevo Sustento"}
                  </p>

                  {/* Input de archivo oculto */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0])}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />

                  <div className="flex items-center gap-2">
                    <Button
                      variant="bordered"
                      startContent={<FileText size={18} />}
                      className="flex-1"
                      onClick={() => fileInputRef.current.click()}
                    >
                      {file ? "Cambiar archivo" : "Seleccionar archivo"}
                    </Button>

                    {file && (
                      <Button
                        isIconOnly
                        color="danger"
                        variant="light"
                        onClick={() => setFile(null)}
                      >
                        <X size={18} />
                      </Button>
                    )}
                  </div>

                  {file && (
                    <p className="text-[11px] text-emerald-600 font-medium truncate italic">
                      Listo para subir: {file.name}
                    </p>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} isDisabled={loading}>
                Cerrar
              </Button>
              <Button
                className="bg-slate-900 text-white"
                onPress={() => handleUploadSustento(onClose)}
                isLoading={loading}
                isDisabled={!file}
                startContent={!loading && <Upload size={18} />}
              >
                Subir Sustento
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CargarSustentoRendicion;
