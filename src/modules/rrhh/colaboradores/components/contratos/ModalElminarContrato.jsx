import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import Loading from "../../../../../hooks/Loading";
import config from "../../../../../utils/getToken";
import { inputClassNames } from "../../../../../assets/classNames";
import { FiAlertTriangle } from "react-icons/fi";

const ModalSolicitarEliminarContrato = ({
  isOpen,
  onOpenChange,
  handleFindColaboradores,
  selectContrato,
  selectColaborador,
}) => {
  const [loading, setLoading] = useState(false);
  const [motivo, setMotivo] = useState("");

  const solicitarEliminacion = () => {
    if (!motivo.trim()) {
      toast.warning(
        "Por favor, ingrese un motivo para solicitar la eliminación.",
      );
      return;
    }

    setLoading(true);

    const url = `${import.meta.env.VITE_URL_API}/rrhh/contratos/solicitar-eliminacion/${selectContrato?.id}`;

    const requestConfig = {
      ...config,
      data: { motivo },
    };

    axios
      .delete(url, requestConfig)
      .then((res) => {
        toast.success(`La solicitud de eliminación se envió correctamente`);
        handleFindColaboradores();
        setMotivo("");
        onOpenChange(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message ||
            "Hubo un error al solicitar la eliminación del contrato",
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      classNames={{
        // Fondo blanco, texto oscuro y bordes suaves
        base: "bg-white text-slate-800 border border-slate-200 shadow-2xl",
        header: "border-b border-slate-200 pb-3",
        footer: "border-t border-slate-200 pt-3",
        closeButton:
          "hover:bg-slate-100 active:bg-slate-200 text-slate-500 transition-all",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-3">
              <div className="flex items-center justify-center p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <FiAlertTriangle size={22} />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-slate-800">
                  Solicitar eliminación
                </h2>
                <span className="text-sm font-normal text-slate-500">
                  Colaborador: {selectColaborador.nombre_colaborador}{" "}
                  {selectColaborador.apellidos_colaborador}
                </span>
              </div>
            </ModalHeader>

            <ModalBody className="py-5">
              {loading && <Loading />}

              <p className="text-slate-600 text-sm leading-relaxed">
                ¿Está seguro de que desea{" "}
                <strong className="text-amber-500 font-semibold">
                  solicitar
                </strong>{" "}
                la eliminación del contrato de este colaborador? Esta solicitud
                será enviada a gerencia/RRHH para su revisión.
              </p>

              <Textarea
                isRequired
                label="Motivo de la solicitud"
                labelPlacement="outside"
                placeholder="Explique brevemente el motivo..."
                value={motivo}
                onValueChange={setMotivo}
                variant="bordered"
                minRows={3}
                className="mt-4"
                classNames={{
                  ...inputClassNames,
                  label: "text-slate-700 font-medium",
                  inputWrapper:
                    "border-slate-300 bg-slate-50 hover:border-amber-500 focus-within:!border-amber-500 data-[hover=true]:border-amber-400 transition-colors",
                  input: "text-slate-800 placeholder:text-slate-400",
                }}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                variant="light"
                onPress={() => {
                  setMotivo("");
                  onClose();
                }}
                className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-all"
              >
                Cancelar
              </Button>
              <Button
                color="danger"
                className="font-medium shadow-lg shadow-danger/20"
                onPress={solicitarEliminacion}
                isLoading={loading}
              >
                Solicitar Eliminación
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalSolicitarEliminarContrato;
