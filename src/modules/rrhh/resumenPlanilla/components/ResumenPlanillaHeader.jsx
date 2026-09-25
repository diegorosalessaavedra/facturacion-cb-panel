import React, { useState } from "react";
import {
  Chip,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import {
  FaCalendarAlt,
  FaCircle,
  FaLock,
  FaExclamationTriangle,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";
import config from "../../../../utils/getToken";
import { handleAxiosError } from "../../../../utils/handleAxiosError";

const ResumenPlanillaHeader = ({
  fetchDataSemana,
  dataSemana,
  onSemanaCerrada,
}) => {
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const isFinalizado = dataSemana?.estado_planilla !== "EN PROCESO";

  const handleCerrarSemana = (onClose) => {
    if (!dataSemana?.id) return;

    setLoading(true);
    const toastId = toast.loading("Cerrando semana...");
    const url = `${import.meta.env.VITE_URL_API}/semanas-planilla/cerrar/${dataSemana.id}`;

    axios
      .patch(url, {}, config)
      .then((res) => {
        toast.success("Semana Cerrada correctamente", { id: toastId });
        if (onSemanaCerrada) onSemanaCerrada();
        if (fetchDataSemana) fetchDataSemana();
        onClose();
      })
      .catch((err) => {
        handleAxiosError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <header className="relative w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

        <div className="flex items-center gap-5 relative z-10 w-full">
          <div className="bg-white p-2.5 rounded-xl shadow-sm shrink-0">
            <img
              className="w-12 h-12 object-contain"
              src="/logo.jpg"
              alt="Logo Empresa"
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-slate-50 tracking-tight">
                Resumen Planilla
              </h1>

              {dataSemana && (
                <div className="flex items-center gap-2">
                  <Chip
                    startContent={
                      <FaCalendarAlt className="text-slate-900" size={10} />
                    }
                    variant="flat"
                    size="sm"
                    className="bg-green-500 font-semibold tracking-wide text-slate-900 px-2 gap-0.5"
                  >
                    Semana {dataSemana.numero_semana}
                  </Chip>
                  <Chip
                    variant="dot"
                    size="sm"
                    startContent={
                      <FaCircle className="text-slate-900" size={6} />
                    }
                    className="bg-amber-500 text-slate-900 border-none px-2 gap-0.5"
                  >
                    {dataSemana.mes_planilla?.mes} -{" "}
                    {dataSemana.year_planilla?.year}
                  </Chip>
                  <Chip
                    variant="flat"
                    size="sm"
                    className={`font-bold px-2 ${
                      isFinalizado
                        ? "bg-red-500/20 text-red-400"
                        : "bg-sky-500/20 text-sky-400"
                    }`}
                  >
                    {dataSemana.estado_planilla}
                  </Chip>
                </div>
              )}
            </div>

            <p className="text-slate-400 text-sm font-medium">
              Filtra y selecciona una semana para ingresar a la plantilla de la
              planilla.
            </p>
          </div>
        </div>

        {dataSemana && (
          <div className="relative z-10 shrink-0 w-full md:w-auto flex justify-end">
            <Button
              color={isFinalizado ? "default" : "danger"}
              variant={isFinalizado ? "faded" : "shadow"}
              startContent={!isFinalizado && <FaLock size={14} />}
              isDisabled={isFinalizado}
              className="font-bold w-full md:w-auto"
              size="sm"
              onPress={onOpen}
            >
              {isFinalizado ? "Semana Cerrada" : "Cerrar Semana"}
            </Button>
          </div>
        )}
      </header>

      {/* --- MODAL DE CONFIRMACIÓN MEJORADO --- */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-0">
                <div className="flex items-center gap-2 text-danger font-bold text-lg">
                  <FaExclamationTriangle size={18} />
                  Confirmar Cierre de Semana
                </div>
              </ModalHeader>

              <ModalBody className="py-5">
                <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 text-sm text-danger-900 leading-relaxed shadow-sm">
                  ¿Estás seguro de que deseas cerrar la{" "}
                  <strong>Semana {dataSemana?.numero_semana}</strong>?
                  <br />
                  <br />
                  Una vez cerrada,{" "}
                  <strong>toda la tabla quedará bloqueada</strong> y no se
                  podrán realizar más modificaciones en las asistencias ni en
                  los cálculos de esta semana.
                </div>
              </ModalBody>

              <ModalFooter className="pt-0">
                <Button
                  color="default"
                  variant="flat"
                  onPress={onClose}
                  isDisabled={loading}
                  className="font-medium"
                >
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  variant="shadow"
                  onPress={() => handleCerrarSemana(onClose)}
                  isLoading={loading}
                  className="font-bold"
                  startContent={!loading && <FaLock size={14} />}
                >
                  Sí, cerrar semana
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ResumenPlanillaHeader;
