import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useState, useRef } from "react";
import { FiUploadCloud, FiFileText, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import config from "../../../../utils/getToken";
import { selectClassNames } from "../../../../assets/classNames";
import { toast } from "sonner";

const ModalVerificarPdf = ({
  isOpen,
  onOpenChange,
  handleFindCotizaciones,
}) => {
  const [file, setFile] = useState(null);
  const [banco, setBanco] = useState(""); // <-- Nuevo estado para el banco
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Manejar la selección del archivo
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Por favor, selecciona un archivo PDF válido.");
    }
  };

  // Limpiar estados
  const handleReset = () => {
    setFile(null);
    setBanco(""); // Limpiamos también el banco al cerrar o borrar
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Enviar archivo y banco al backend
  const handleVerify = async (onClose) => {
    if (!file || !banco) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("documento_pdf", file);
    formData.append("banco", banco); // <-- Agregamos el banco al FormData

    try {
      const url = `${import.meta.env.VITE_URL_API}/ventas/pagos-cotizaciones/verificar-pdf`;

      const res = await axios.post(url, formData, config);

      handleFindCotizaciones();
      onClose();
      handleReset();
      toast.success(
        `${res.data.pagosActualizados} Pagos verificados correctamente`,
      );
    } catch (error) {
      toast.error("Error al verificar los pagos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleReset(); // Limpia los datos si el usuario cierra el modal
        onOpenChange(open);
      }}
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-xl font-bold text-slate-800">
                Verificar Cotización PDF
              </h3>
              <p className="text-sm text-slate-500 font-normal">
                Selecciona el banco y sube el documento PDF.
              </p>
            </ModalHeader>
            <ModalBody className="gap-4">
              {/* Selector de Banco */}
              <Select
                label="Selecciona el Banco"
                labelPlacement="outside"
                placeholder="Elige BBVA o BCP"
                variant="bordered"
                radius="sm"
                size="sm"
                classNames={selectClassNames}
                selectedKeys={banco ? [banco] : []}
                onChange={(e) => setBanco(e.target.value)}
                isDisabled={loading}
              >
                <SelectItem key="BCP" value="BCP">
                  BCP
                </SelectItem>
                <SelectItem key="BBVA" value="BBVA">
                  BBVA
                </SelectItem>
              </Select>

              {/* Zona de subida de archivo */}
              {!file ? (
                <div
                  onClick={() => !loading && fileInputRef.current.click()}
                  className={`w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-colors 
                    ${loading ? "border-slate-200 bg-slate-50 cursor-not-allowed" : "border-slate-300 hover:border-primary-500 hover:bg-primary-50 cursor-pointer"}`}
                >
                  <FiUploadCloud
                    className={`text-4xl ${loading ? "text-slate-300" : "text-slate-400"}`}
                  />
                  <p
                    className={`text-sm font-medium ${loading ? "text-slate-400" : "text-slate-500"}`}
                  >
                    Haz clic para seleccionar el PDF
                  </p>
                </div>
              ) : (
                <div className="w-full p-4 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                      <FiFileText className="text-xl" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-semibold text-slate-700 truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                  <Button
                    isIconOnly
                    color="danger"
                    variant="light"
                    onPress={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    isDisabled={loading}
                  >
                    <FiTrash2 className="text-lg" />
                  </Button>
                </div>
              )}

              {/* Input oculto real */}
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                isDisabled={loading}
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                onPress={() => handleVerify(onClose)}
                isDisabled={!file || !banco} // <-- Validamos que ambos existan
                isLoading={loading}
              >
                Verificar Archivo
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalVerificarPdf;
