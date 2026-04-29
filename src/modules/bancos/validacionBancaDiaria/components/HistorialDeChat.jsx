import { useEffect, useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ScrollShadow,
  Button,
  Spinner,
} from "@nextui-org/react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { FaRegCalendarAlt } from "react-icons/fa";
import {
  FiCreditCard,
  FiAlertCircle,
  FiFileText,
  FiDownload,
} from "react-icons/fi";
import { BiMessageSquareDots } from "react-icons/bi";
import { API } from "../../../../utils/api";
import config from "../../../../utils/getToken";
import { handleAxiosError } from "../../../../utils/handleAxiosError";
import { useSocketContext } from "../../../../context/SocketContext";
import formatDate from "../../../../hooks/FormatDate";

const HistorialDeChat = ({ isOpen, onOpenChange, id }) => {
  const socket = useSocketContext();
  const [datosValidacionPago, setDatosValidacionPago] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [imagenAmpliacion, setImagenAmpliacion] = useState(null);
  const scrollRef = useRef(null);

  const isPdfFile = (filename) => filename?.toLowerCase().endsWith(".pdf");

  // 1. Obtener datos iniciales
  useEffect(() => {
    if (isOpen && id) {
      setLoadingData(true);
      const fetchDatos = async () => {
        try {
          const url = `${API}/datos-validacion-pago/${id}`;
          const res = await axios.get(url, config);
          const data = res.data.datosValidacionPago || null;
          setDatosValidacionPago(data);

          if (data?.id) {
            const resMsj = await axios.get(
              `${API}/respuesta-rechazo-pago/${data.id}`,
              config,
            );

            setMensajes(resMsj.data.respuestaRechazoPagos || []);
          }
        } catch (error) {
          console.error("Error al cargar historial:", error);
          setDatosValidacionPago(null);
        } finally {
          setLoadingData(false);
        }
      };
      fetchDatos();
    }
  }, [isOpen, id]);

  // 2. Socket en tiempo real
  useEffect(() => {
    if (!socket || !datosValidacionPago) return;
    const handleNuevoMensaje = (mensaje) => {
      if (mensaje.datos_validacion_pago_id === datosValidacionPago.id) {
        setMensajes((prev) => [...prev, mensaje]);
      }
    };
    socket.on("respuesta-rechazo-pago:create", handleNuevoMensaje);
    return () =>
      socket.off("respuesta-rechazo-pago:create", handleNuevoMensaje);
  }, [socket, datosValidacionPago]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensajes]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        placement="center"
        size="lg"
        hideCloseButton
        classNames={{
          base: "bg-slate-50/30 w-full max-w-2xl min-h-[50vh] max-h-[85vh] flex flex-col backdrop-blur-[40px] border border-white/50 shadow-2xl rounded-[24px] overflow-hidden relative",
          header: "p-0 bg-transparent z-20 flex-shrink-0",
          body: "p-0 z-10 relative flex-1 min-h-0 overflow-hidden flex flex-col",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {/* Orbes decorativos */}
              <div className="absolute -top-20 -left-20 w-72 h-72 bg-amber-400/20 rounded-full blur-[80px] pointer-events-none"></div>

              <ModalHeader className="flex flex-col w-full relative p-0 z-20">
                <div className="h-1 bg-gradient-to-r from-slate-700 via-red-500 to-amber-500 w-full"></div>
                <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 px-4 py-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FiAlertCircle className="text-red-500 text-[16px]" />
                      <h3 className="text-slate-900 font-extrabold text-[13px]">
                        Historial de Validación
                      </h3>
                    </div>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      radius="full"
                      onPress={onClose}
                    >
                      <IoClose size={20} />
                    </Button>
                  </div>

                  {datosValidacionPago && (
                    <div className="flex items-center gap-3 text-[10px] bg-slate-100/80 p-2 rounded-lg border border-slate-200">
                      <span className="text-red-600 font-bold">
                        S/ {datosValidacionPago.pago_cotizacion?.monto}
                      </span>
                      <div className="w-px h-3 bg-slate-300"></div>
                      <span className="font-mono text-slate-700">
                        OP: {datosValidacionPago.pago_cotizacion?.operacion}
                      </span>
                    </div>
                  )}
                </div>
              </ModalHeader>

              <ModalBody>
                <ScrollShadow
                  ref={scrollRef}
                  className="w-full flex-1 px-4 py-4 flex flex-col gap-4"
                >
                  {loadingData ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-2">
                      <Spinner color="danger" size="sm" />
                      <p className="text-[11px] text-slate-500 font-medium">
                        Buscando conversaciones...
                      </p>
                    </div>
                  ) : !datosValidacionPago || mensajes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-2">
                      <div className="w-16 h-16 bg-white/40 rounded-full flex items-center justify-center border border-dashed border-slate-300">
                        <BiMessageSquareDots className="text-3xl text-slate-300" />
                      </div>
                      <p className="font-bold text-slate-700 text-sm">
                        Sin historial de chat
                      </p>
                      <p className="text-[11px] text-center px-12">
                        No hay mensajes registrados para este proceso de
                        validación.
                      </p>
                    </div>
                  ) : (
                    mensajes.map((msg) => (
                      <div key={msg.id} className="flex flex-col w-full gap-1">
                        {/* Mensaje Recibido */}
                        {msg.respuesta_recibida && (
                          <div className="flex justify-start">
                            <div className="max-w-[85%] bg-white border border-slate-200 p-2.5 rounded-2xl rounded-tl-none shadow-sm text-[12px]">
                              <span className="text-[9px] font-bold text-amber-600 block mb-1 uppercase">
                                {msg.usuario_respuesta_recibida}
                              </span>
                              {msg.respuesta_file &&
                                renderFile(
                                  msg.respuesta_file,
                                  setImagenAmpliacion,
                                  isPdfFile,
                                )}
                              <p className="text-slate-800 leading-snug">
                                {msg.respuesta_recibida}
                              </p>
                            </div>
                          </div>
                        )}
                        {/* Mensaje Enviado */}
                        {msg.respuesta_enviada && (
                          <div className="flex justify-end">
                            <div className="max-w-[85%] bg-slate-800 text-white p-2.5 rounded-2xl rounded-tr-none shadow-md text-[12px]">
                              <span className="text-[9px] font-bold text-amber-400 block mb-1 uppercase">
                                {msg.usuario_respuesta_enviada}
                              </span>
                              {msg.respuesta_file &&
                                renderFile(
                                  msg.respuesta_file,
                                  setImagenAmpliacion,
                                  isPdfFile,
                                  true,
                                )}
                              <p className="leading-snug">
                                {msg.respuesta_enviada}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </ScrollShadow>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal para ampliar imagen */}
      <Modal
        isOpen={!!imagenAmpliacion}
        onOpenChange={() => setImagenAmpliacion(null)}
        backdrop="blur"
        size="3xl"
      >
        <ModalContent className="bg-transparent shadow-none border-none">
          <div className="relative p-2">
            <img
              src={imagenAmpliacion}
              className="max-w-full max-h-[90vh] rounded-xl object-contain mx-auto"
            />
            <Button
              isIconOnly
              className="absolute top-4 right-4 bg-black/50 text-white"
              radius="full"
              size="sm"
              onPress={() => setImagenAmpliacion(null)}
            >
              <IoClose size={20} />
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

// Función auxiliar para renderizar adjuntos
const renderFile = (file, setImagenAmpliacion, isPdfFile, isDark = false) => {
  const url = `${import.meta.env.VITE_LARAVEL_URL}/chat/${file}`;
  if (isPdfFile(file)) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={`flex items-center gap-2 p-2 rounded-lg mb-2 border ${isDark ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"}`}
      >
        <FiFileText className="text-red-500" />
        <span className="text-[10px] underline truncate w-32">
          Documento PDF
        </span>
        <FiDownload size={12} />
      </a>
    );
  }
  return (
    <img
      src={url}
      onClick={() => setImagenAmpliacion(url)}
      className="w-full h-32 object-cover rounded-lg mb-2 cursor-zoom-in hover:opacity-90 transition-opacity border border-black/10"
    />
  );
};

export default HistorialDeChat;
