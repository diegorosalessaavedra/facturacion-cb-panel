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
  Textarea, // <-- IMPORTANTE: Importamos Textarea
} from "@nextui-org/react";
import config from "../../../../utils/getToken";
import { Upload, Eye, FileText, X, Send } from "lucide-react"; // <-- Añadí el icono Send

const CargarSustentoRendicion = ({
  isOpen,
  onOpenChange,
  selectRendicion,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [comentario, setComentario] = useState(""); // <-- Estado para el motivo del cambio
  const fileInputRef = useRef(null);

  // Verificamos si ya existe un sustento para renderizar condicionalmente
  const hasSustento = !!selectRendicion?.sustento_link;

  // Función 1: Subir el archivo directamente (Cuando NO hay sustento)
  const handleUploadSustento = async (onClose) => {
    if (!file) {
      toast.error("Por favor, selecciona un archivo primero.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

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

  // Función 2: Solicitar cambio de sustento (Cuando SÍ hay sustento)
  const handleSolicitarCambio = async (onClose) => {
    if (!comentario || comentario.trim() === "") {
      toast.error("El motivo o comentario es obligatorio.");
      return;
    }

    setLoading(true);
    // 👇 ATENCIÓN: Ajusta esta URL a la ruta exacta de tu backend que apunta a `solicitarNuevoSustento`
    const url = `${API}/caja-chica/rendicion/solicitar-nuevo-sustento/${selectRendicion.id}`;

    try {
      // Asumo que es un POST o PATCH que recibe JSON, ajústalo si tu ruta usa otro método
      await axios.post(url, { comentario }, config);

      toast.success("¡Solicitud de cambio enviada correctamente!");
      setComentario(""); // Limpiamos el comentario
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
              {hasSustento ? "Solicitar Cambio de Sustento" : "Cargar Sustento"}
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
                    color={hasSustento ? "primary" : "default"}
                    startContent={<Eye size={18} />}
                    onPress={handleViewSustento}
                    isDisabled={!hasSustento}
                    className="w-full font-medium"
                  >
                    {hasSustento
                      ? "Ver Documento Actual"
                      : "Sin documento adjunto"}
                  </Button>
                </div>

                <hr className="border-slate-200" />

                {/* RENDERIZADO CONDICIONAL: SI HAY SUSTENTO (Formulario de solicitud) */}
                {hasSustento ? (
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Motivo de la anulación / cambio
                    </p>
                    <Textarea
                      placeholder="Escribe el motivo por el cual necesitas cambiar este sustento..."
                      value={comentario}
                      onValueChange={setComentario}
                      minRows={3}
                      variant="bordered"
                    />
                  </div>
                ) : (
                  /* RENDERIZADO CONDICIONAL: SI NO HAY SUSTENTO (Subir archivo) */
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Cargar Nuevo Sustento
                    </p>

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
                        onPress={() => fileInputRef.current.click()}
                      >
                        {file ? "Cambiar archivo" : "Seleccionar archivo"}
                      </Button>

                      {file && (
                        <Button
                          isIconOnly
                          color="danger"
                          variant="light"
                          onPress={() => setFile(null)}
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
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} isDisabled={loading}>
                Cancelar
              </Button>

              {/* BOTÓN DE ACCIÓN DINÁMICO */}
              <Button
                className={
                  hasSustento
                    ? "bg-red-600 text-white"
                    : "bg-slate-900 text-white"
                }
                onPress={() =>
                  hasSustento
                    ? handleSolicitarCambio(onClose)
                    : handleUploadSustento(onClose)
                }
                isLoading={loading}
                isDisabled={hasSustento ? !comentario.trim() : !file}
                startContent={
                  !loading &&
                  (hasSustento ? <Send size={18} /> : <Upload size={18} />)
                }
              >
                {hasSustento ? "Enviar Solicitud" : "Subir Sustento"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CargarSustentoRendicion;
