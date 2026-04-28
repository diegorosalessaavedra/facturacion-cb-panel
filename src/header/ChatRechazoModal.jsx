import { useEffect, useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  ScrollShadow,
} from "@nextui-org/react";
import { IoSend, IoClose } from "react-icons/io5";
import axios from "axios";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FiCreditCard, FiAlertCircle } from "react-icons/fi";
import { BiMessageSquareDots } from "react-icons/bi";
import { API } from "../utils/api";
import config from "../utils/getToken";
import { useSocketContext } from "../context/SocketContext";
import formatDate from "../hooks/FormatDate";

const ChatRechazoModal = ({ isOpen, onOpenChange, selectNotificacion }) => {
  const socket = useSocketContext();
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen && selectNotificacion) {
      const fetchMensajes = async () => {
        try {
          const url = `${API}/respuesta-rechazo-pago/${selectNotificacion.id}`;
          const res = await axios.get(url, config);
          setMensajes(res.data.respuestaRechazoPagos || []);
        } catch (error) {
          console.error("Error al obtener mensajes", error);
        }
      };
      4;
      fetchMensajes();
    }
  }, [isOpen, selectNotificacion]);

  useEffect(() => {
    if (!socket || !selectNotificacion) return;

    const handleNuevoMensaje = (mensaje) => {
      if (mensaje.datos_validacion_pago_id === selectNotificacion.id) {
        setMensajes((prev) => [...prev, mensaje]);
      }
    };

    socket.on("respuesta-rechazo-pago:create", handleNuevoMensaje);
    return () => {
      socket.off("respuesta-rechazo-pago:create", handleNuevoMensaje);
    };
  }, [socket, selectNotificacion]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensajes]);

  const handleEnviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !selectNotificacion) return;

    setIsLoading(true);
    try {
      const url = `${API}/respuesta-rechazo-pago/enviada/${selectNotificacion.pago_cotizacion_id}`;
      const payload = {
        respuesta_enviada: nuevoMensaje,
      };

      await axios.post(url, payload, config);
      setNuevoMensaje("");
    } catch (error) {
      console.error(error); // Reemplaza por tu manejador de errores
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectNotificacion) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      placement="center"
      size="md"
      hideCloseButton
      classNames={{
        base: "bg-white/95 backdrop-blur-2xl border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-[24px] overflow-hidden",
        header: "p-0 bg-transparent",
        footer: "bg-white/90 border-t border-slate-100 p-3",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col w-full relative">
              {/* Cinta superior decorativa */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-amber-400"></div>

              <div className="px-5 pt-4 pb-3 bg-white flex flex-col gap-4 shadow-sm z-10">
                {/* Fila 1: Título principal y Botón X */}
                <div className="flex justify-between items-start w-full">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-50 text-red-600 p-2 rounded-xl border border-red-100">
                      <FiAlertCircle className="text-[18px]" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-[15px] font-black text-slate-900 leading-tight">
                        Resolución de Rechazo
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Detalles de la transacción
                      </p>
                    </div>
                  </div>

                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="min-w-8 w-8 h-8 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                    onPress={onClose}
                  >
                    <IoClose className="text-[20px]" />
                  </Button>
                </div>

                {/* Fila 2: Metadatos compactos y limpios */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="bg-slate-100 text-slate-800 font-black px-2.5 py-1 rounded-lg border border-slate-200">
                      S/ {selectNotificacion.pago_cotizacion?.monto || "0.00"}
                    </span>
                    <span className="bg-slate-50 text-slate-600 font-medium px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5">
                      <FiCreditCard className="opacity-50" />
                      Op:{" "}
                      <span className="font-mono font-bold text-slate-800">
                        {selectNotificacion.pago_cotizacion?.operacion || "S/N"}
                      </span>
                    </span>
                    <span className="bg-slate-50 text-slate-600 font-medium px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5">
                      <FaRegCalendarAlt className="opacity-50" />
                      {selectNotificacion.pago_cotizacion?.fecha
                        ? formatDate(selectNotificacion.pago_cotizacion.fecha)
                        : "N/A"}
                    </span>
                  </div>

                  {/* Fila 3: Motivo visualmente integrado */}
                  <div className="bg-red-50/50 border-l-3 border-red-400 p-2.5 rounded-r-lg">
                    <p className="text-[11px] text-slate-700 font-medium italic leading-relaxed">
                      "
                      {selectNotificacion.observacion_validacion ||
                        selectNotificacion.pago_cotizacion
                          ?.observaciones_rechazo ||
                        "No se especificó un motivo de rechazo."}
                      "
                    </p>
                  </div>
                </div>
              </div>
            </ModalHeader>

            <ModalBody className="p-0 bg-slate-50/50">
              <ScrollShadow
                ref={scrollRef}
                className="h-[360px] w-full px-4 py-4 flex flex-col gap-3"
              >
                {mensajes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 opacity-80">
                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-1 shadow-sm">
                      <BiMessageSquareDots className="text-2xl text-slate-300" />
                    </div>
                    <p className="text-[13px] font-bold text-slate-600">
                      El chat está vacío
                    </p>
                    <p className="text-[11px] text-center text-slate-400 max-w-[200px]">
                      Escribe el primer mensaje para iniciar la resolución.
                    </p>
                  </div>
                ) : (
                  mensajes.map((msg) => (
                    <div key={msg.id} className="flex flex-col w-full gap-1.5">
                      {msg.respuesta_recibida && (
                        <div className="flex justify-start w-full">
                          <div className="max-w-[85%] bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-2xl rounded-tl-sm text-[12px] shadow-sm leading-relaxed">
                            <span className="text-[9px] text-amber-500">
                              {msg.usuario_respuesta_recibida}
                            </span>
                            <p>{msg.respuesta_recibida}</p>
                          </div>
                        </div>
                      )}

                      {msg.respuesta_enviada && (
                        <div className="flex justify-end w-full">
                          <div className="max-w-[85%] bg-gradient-to-tr from-slate-900 to-black text-white px-3.5 py-2 rounded-2xl rounded-tr-sm text-[12px] shadow-md shadow-slate-900/20 leading-relaxed">
                            <span className="text-[9px] text-slate-200">
                              {msg.usuario_respuesta_enviada}
                            </span>
                            <p>{msg.respuesta_enviada}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </ScrollShadow>
            </ModalBody>

            <ModalFooter className="flex items-center gap-2 px-4 py-3">
              <Input
                autoFocus
                size="sm"
                radius="full"
                placeholder="Escribe tu respuesta..."
                value={nuevoMensaje}
                onValueChange={setNuevoMensaje}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEnviarMensaje();
                }}
                className="flex-1"
                classNames={{
                  inputWrapper:
                    "bg-white shadow-sm border-slate-200 h-10 px-4 focus-within:!border-black transition-colors",
                  input: "text-[13px] text-slate-800",
                }}
              />
              <Button
                isIconOnly
                size="sm"
                radius="full"
                className="bg-black text-white shadow-lg shadow-black/30 hover:scale-105 transition-transform duration-200 h-10 w-10 min-w-10"
                isLoading={isLoading}
                onPress={handleEnviarMensaje}
              >
                {!isLoading && (
                  <IoSend className="text-[16px] ml-0.5 text-amber-400" />
                )}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ChatRechazoModal;
