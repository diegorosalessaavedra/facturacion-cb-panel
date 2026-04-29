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
import {
  FiCreditCard,
  FiAlertCircle,
  FiPaperclip,
  FiFileText,
  FiX,
  FiImage,
  FiUploadCloud,
  FiDownload,
} from "react-icons/fi";
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

  // Estados para archivos e imágenes
  const [archivo, setArchivo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imagenAmpliacion, setImagenAmpliacion] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

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

  useEffect(() => {
    if (!archivo) {
      setPreviewUrl(null);
      return;
    }

    if (archivo.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(archivo);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [archivo]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setArchivo(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArchivo(e.target.files[0]);
    }
  };

  const removeArchivo = () => {
    setArchivo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEnviarMensaje = async () => {
    // AHORA VALIDA QUE SÍ O SÍ EXISTA TEXTO EN EL MENSAJE
    if (!nuevoMensaje.trim() || !selectNotificacion) return;

    setIsLoading(true);
    try {
      const url = `${API}/respuesta-rechazo-pago/enviada/${selectNotificacion.pago_cotizacion_id}`;

      let data;
      let headersConfig = { ...config.headers };

      if (archivo) {
        data = new FormData();
        data.append("respuesta_enviada", nuevoMensaje);
        data.append("file", archivo);
        headersConfig["Content-Type"] = "multipart/form-data";
      } else {
        data = {
          respuesta_enviada: nuevoMensaje,
        };
      }

      await axios.post(url, data, { headers: headersConfig });

      setNuevoMensaje("");
      removeArchivo();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper para saber si el archivo guardado es un PDF
  const isPdfFile = (filename) => {
    return filename && filename.toLowerCase().endsWith(".pdf");
  };

  if (!selectNotificacion) return null;

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
          base: "bg-slate-50/30 w-full max-w-2xl min-h-[80vh] max-h-[90vh] flex flex-col backdrop-blur-[40px] border border-white/50 shadow-[0_8px_32px_0_rgba(15,23,42,0.2)] rounded-[24px] overflow-hidden relative",
          header: "p-0 bg-transparent z-20 flex-shrink-0",
          body: "p-0 z-10 relative flex-1 min-h-0 overflow-hidden flex flex-col",
          footer:
            "bg-white/30 border-t border-white/30 p-3 flex-col items-start backdrop-blur-xl z-20 flex-shrink-0",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {/* --- ORBES LÍQUIDOS --- */}
              <div className="absolute -top-20 -left-20 w-72 h-72 bg-amber-400/20 rounded-full mix-blend-multiply filter blur-[80px] z-0 pointer-events-none"></div>
              <div className="absolute top-1/2 -right-20 w-64 h-64 bg-slate-400/30 rounded-full mix-blend-multiply filter blur-[80px] z-0 pointer-events-none"></div>
              <div className="absolute -bottom-20 left-10 w-80 h-80 bg-red-400/15 rounded-full mix-blend-multiply filter blur-[80px] z-0 pointer-events-none"></div>

              <ModalHeader className="flex flex-col w-full relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-700 via-red-500 to-amber-500 shadow-[0_0_11px_rgba(245,158,11,0.5)]"></div>

                <div className="px-4 pt-3 pb-2 bg-white/50 backdrop-blur-md border-b border-white/30 flex flex-col gap-2 shadow-sm z-10">
                  <div className="flex justify-between items-start w-full">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-red-500/10 text-red-600 p-1.5 rounded-lg border border-red-500/20 backdrop-blur-sm shadow-inner">
                        <FiAlertCircle className="text-[16px]" />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-[13px] font-black text-slate-900 leading-tight drop-shadow-sm">
                          Resolución de Rechazo
                        </h3>
                        <p className="text-[10px] text-slate-600 font-medium">
                          Detalles de la transacción
                        </p>
                      </div>
                    </div>

                    <div className="items-center gap-1.5 hidden sm:flex text-[11px]">
                      <span className="bg-white/40 backdrop-blur-sm text-slate-700 font-medium px-2 py-0.5 rounded-md border border-white/50 flex items-center gap-1 shadow-sm">
                        <FiCreditCard className="text-slate-500 text-[11px]" />
                        Op:{" "}
                        <span className="font-mono font-bold text-slate-900 ">
                          {selectNotificacion.pago_cotizacion?.operacion ||
                            "S/N"}
                        </span>
                      </span>
                      <span className="bg-white/40 backdrop-blur-sm text-slate-700 font-medium px-2 py-0.5 rounded-md border border-white/50 flex items-center gap-1 shadow-sm">
                        <FaRegCalendarAlt className="text-amber-600 text-[11px]" />
                        {selectNotificacion.pago_cotizacion?.fecha
                          ? formatDate(selectNotificacion.pago_cotizacion.fecha)
                          : "N/A"}
                      </span>

                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="ml-4 min-w-7 w-7 h-7 rounded-full bg-white/40 border border-white/60 text-slate-500 hover:bg-red-500/20 hover:text-red-600 hover:border-red-500/30 transition-all shadow-sm"
                        onPress={onClose}
                      >
                        <IoClose className="text-[18px]" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] w-full">
                    <span className="bg-white/60 backdrop-blur-sm text-slate-800 font-black px-2 py-0.5 rounded-md border border-white/70 shadow-sm whitespace-nowrap">
                      S/ {selectNotificacion.pago_cotizacion?.monto || "0.00"}
                    </span>

                    <div className="flex-1 bg-red-500/10 backdrop-blur-sm border-l-2 border-red-400 p-1.5 px-2 rounded-r-md border-y border-r border-white/40 shadow-inner">
                      <p className="text-[10px] text-slate-800 font-medium italic leading-relaxed line-clamp-1 sm:line-clamp-2">
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

              <ModalBody
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {isDragging && (
                  <div className="absolute inset-2 z-50 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md border-2 border-dashed border-amber-400 rounded-2xl pointer-events-none transition-all duration-200 animate-appearance-in shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                    <div className="bg-white/20 p-3 rounded-full shadow-[inset_0_0_15px_rgba(255,255,255,0.5)] mb-2">
                      <FiUploadCloud className="text-4xl text-amber-400 drop-shadow-md" />
                    </div>
                    <span className="text-white font-bold text-sm tracking-wide drop-shadow-md">
                      Suelta tu archivo aquí
                    </span>
                  </div>
                )}

                <ScrollShadow
                  ref={scrollRef}
                  className="w-full flex-1 min-h-[150px] px-4 py-3 flex flex-col gap-3 pb-10"
                >
                  {mensajes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2 opacity-90 pointer-events-none">
                      <div className="w-12 h-12 bg-white/50 backdrop-blur-md border border-white/70 rounded-full flex items-center justify-center mb-1 shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
                        <BiMessageSquareDots className="text-2xl text-slate-400 drop-shadow-sm" />
                      </div>
                      <p className="text-[12px] font-bold text-slate-700 drop-shadow-sm">
                        El chat está vacío
                      </p>
                      <p className="text-[10px] text-center text-slate-500 max-w-[180px]">
                        Escribe un mensaje o arrastra una imagen.
                      </p>
                    </div>
                  ) : (
                    mensajes.map((msg) => (
                      <div
                        key={msg.id}
                        className="flex flex-col w-full gap-1.5"
                      >
                        {/* Mensaje Recibido */}
                        {msg.respuesta_recibida && (
                          <div className="flex justify-start w-full">
                            <div className="w-fit max-w-[450px] bg-white/70 backdrop-blur-md border border-white/80 text-slate-800 px-3 py-2 rounded-2xl rounded-tl-sm text-[12px] shadow-[0_4px_15px_rgba(15,23,42,0.04)] leading-relaxed">
                              <span className="block text-[9px] text-amber-600 font-bold mb-0.5 opacity-90">
                                {msg.usuario_respuesta_recibida}
                              </span>

                              {msg.respuesta_file &&
                                (isPdfFile(msg.respuesta_file) ? (
                                  <a
                                    href={`${import.meta.env.VITE_LARAVEL_URL}/chat/${msg.respuesta_file}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 bg-white/80 border border-slate-200 p-2 rounded-lg mb-1.5 hover:bg-slate-50 transition-colors"
                                  >
                                    <FiFileText className="text-red-500 text-lg" />
                                    <span className="text-[10px] font-semibold text-slate-700 underline truncate w-24">
                                      Documento PDF
                                    </span>
                                  </a>
                                ) : (
                                  <img
                                    src={`${import.meta.env.VITE_LARAVEL_URL}/chat/${msg.respuesta_file}`}
                                    className="w-full h-auto object-cover rounded-lg border border-white/60 shadow-sm mb-1.5 cursor-zoom-in hover:opacity-90 hover:shadow-md transition-all duration-200"
                                    alt="Adjunto recibido"
                                    onClick={() =>
                                      setImagenAmpliacion(
                                        `${import.meta.env.VITE_LARAVEL_URL}/chat/${msg.respuesta_file}`,
                                      )
                                    }
                                  />
                                ))}
                              {msg.respuesta_recibida && (
                                <p>{msg.respuesta_recibida}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Mensaje Enviado */}
                        {msg.respuesta_enviada && (
                          <div className="flex justify-end w-full">
                            <div className="w-fit max-w-[450px] bg-gradient-to-br from-slate-700/90 to-slate-900/90 backdrop-blur-md border border-slate-500/30 text-white px-3 py-2 rounded-2xl rounded-tr-sm text-[12px] shadow-[0_8px_20px_rgba(15,23,42,0.3)] leading-relaxed">
                              <span className="block text-[9px] text-amber-400 font-bold mb-0.5 opacity-90">
                                {msg.usuario_respuesta_enviada}
                              </span>

                              {msg.respuesta_file &&
                                (isPdfFile(msg.respuesta_file) ? (
                                  <a
                                    href={`${import.meta.env.VITE_LARAVEL_URL}/chat/${msg.respuesta_file}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 bg-slate-800/80 border border-slate-600 p-2 rounded-lg mb-1.5 hover:bg-slate-700 transition-colors group"
                                  >
                                    <FiFileText className="text-red-400 text-lg" />
                                    <span className="text-[10px] font-semibold text-slate-200 group-hover:text-white underline truncate w-24">
                                      Documento PDF
                                    </span>
                                    <FiDownload className="text-slate-400 group-hover:text-amber-400" />
                                  </a>
                                ) : (
                                  <img
                                    src={`${import.meta.env.VITE_LARAVEL_URL}/chat/${msg.respuesta_file}`}
                                    className="w-full h-auto object-cover rounded-lg border border-slate-600/50 shadow-sm mb-1.5 cursor-zoom-in hover:opacity-90 hover:shadow-md hover:border-amber-400/50 transition-all duration-200"
                                    alt="Adjunto enviado"
                                    onClick={() =>
                                      setImagenAmpliacion(
                                        `${import.meta.env.VITE_LARAVEL_URL}/chat/${msg.respuesta_file}`,
                                      )
                                    }
                                  />
                                ))}
                              {msg.respuesta_enviada && (
                                <p className="drop-shadow-sm">
                                  {msg.respuesta_enviada}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </ScrollShadow>
              </ModalBody>

              <ModalFooter>
                {/* PREVISUALIZACIÓN GLASS */}
                {archivo && (
                  <div className="relative flex items-center gap-2 bg-white/60 backdrop-blur-xl p-1.5 border border-white/70 rounded-xl shadow-[0_8px_20px_rgba(15,23,42,0.06)] w-max max-w-[90%] mb-1 animate-appearance-in">
                    <div className="relative w-9 h-9 flex-shrink-0 rounded-lg overflow-hidden bg-white/50 flex items-center justify-center border border-white/60 shadow-inner">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : archivo.type === "application/pdf" ? (
                        <FiFileText className="text-xl text-red-500/90 drop-shadow-sm" />
                      ) : (
                        <FiImage className="text-xl text-slate-500/80" />
                      )}
                    </div>

                    <div className="flex flex-col overflow-hidden pr-2">
                      <span className="text-[11px] font-bold text-slate-800 truncate w-28 drop-shadow-sm">
                        {archivo.name}
                      </span>
                      <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">
                        {(archivo.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>

                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="absolute -top-2 -right-2 h-5 w-5 min-w-5 bg-white/90 backdrop-blur-md border border-white shadow-md rounded-full text-slate-500 hover:text-red-500 hover:bg-white transition-all z-10"
                      onPress={removeArchivo}
                    >
                      <FiX className="text-[12px]" />
                    </Button>
                  </div>
                )}

                {/* Contenedor de Inputs Glass */}
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                    className="hidden"
                  />

                  <Button
                    isIconOnly
                    size="sm"
                    radius="full"
                    variant="flat"
                    className="bg-white/50 backdrop-blur-md text-slate-600 border border-white/60 shadow-sm h-9 w-9 min-w-9 hover:bg-white/80 hover:text-amber-600 transition-all"
                    onPress={() => fileInputRef.current?.click()}
                  >
                    <FiPaperclip className="text-[16px]" />
                  </Button>

                  <Input
                    autoFocus
                    size="sm"
                    radius="full"
                    // Placeholder condicional si hay archivo
                    placeholder={
                      archivo
                        ? "Añade un mensaje a tu archivo..."
                        : "Escribe tu respuesta..."
                    }
                    value={nuevoMensaje}
                    onValueChange={setNuevoMensaje}
                    onKeyDown={(e) => {
                      // Verifica que haya texto antes de enviar al presionar Enter
                      if (e.key === "Enter" && nuevoMensaje.trim())
                        handleEnviarMensaje();
                    }}
                    className="flex-1"
                    classNames={{
                      inputWrapper:
                        "bg-white/50 backdrop-blur-md shadow-[inset_0_2px_5px_rgba(15,23,42,0.03)] border border-white/60 h-9 px-4 focus-within:!bg-white/80 focus-within:!border-amber-400/50 transition-all",
                      input:
                        "text-[12px] text-slate-800 placeholder:text-slate-500 font-medium",
                    }}
                  />

                  <Button
                    isIconOnly
                    size="sm"
                    radius="full"
                    // AHORA EL BOTÓN ESTARÁ DESHABILITADO SI NO HAY TEXTO
                    isDisabled={!nuevoMensaje.trim()}
                    className="bg-gradient-to-tr from-slate-700 to-slate-900 text-amber-400 shadow-[0_4px_15px_rgba(15,23,42,0.3)] border border-slate-600/50 hover:scale-105 hover:shadow-[0_6px_20px_rgba(15,23,42,0.5)] transition-all duration-300 h-9 w-9 min-w-9 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    isLoading={isLoading}
                    onPress={handleEnviarMensaje}
                  >
                    {!isLoading && (
                      <IoSend className="text-[16px] ml-0.5 text-amber-400 drop-shadow-md" />
                    )}
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* --- MODAL DE VISUALIZACIÓN A PANTALLA COMPLETA --- */}
      <Modal
        isOpen={!!imagenAmpliacion}
        onOpenChange={(open) => !open && setImagenAmpliacion(null)}
        backdrop="blur"
        size="4xl"
        placement="center"
        classNames={{
          base: "bg-transparent shadow-none border-none",
          closeButton:
            "top-4 right-4 z-50 text-white bg-slate-900/60 backdrop-blur-md hover:bg-red-500 hover:text-white transition-colors border border-white/20 rounded-full",
        }}
      >
        <ModalContent>
          {() => (
            <div className="flex items-center justify-center p-2 outline-none">
              <img
                src={imagenAmpliacion || ""}
                alt="Imagen ampliada"
                className="max-w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 animate-appearance-in"
              />
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChatRechazoModal;
