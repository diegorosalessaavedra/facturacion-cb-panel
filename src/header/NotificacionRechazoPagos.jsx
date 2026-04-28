import { useEffect, useState, useRef } from "react";
import { useSocketContext } from "../context/SocketContext";
import axios from "axios";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Badge,
  ScrollShadow,
  useDisclosure,
} from "@nextui-org/react";
import { FaBell, FaRegSadTear, FaRegCalendarAlt } from "react-icons/fa";
import {
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiCreditCard,
} from "react-icons/fi";
import { IoChatbubblesOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ChatRechazoModal from "./ChatRechazoModal";
import { API } from "../utils/api";
import config from "../utils/getToken";
import { handleAxiosError } from "../utils/handleAxiosError";
import formatDate from "../hooks/FormatDate";
import { formatDateTime } from "../utils/formatDateTime";

const NotificacionRechazoPagos = () => {
  const navigate = useNavigate();
  const socket = useSocketContext();

  const [pagosRechazados, setPagosRechazados] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectNotificacion, setSelectNotificacion] = useState(null);

  // Estado derivado: Calcula el total de no leídos basándose en el array
  const unreadCount = pagosRechazados.length;

  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/notificacion.mp3");
    audioRef.current.volume = 0.5;
    handleFindNotificaciones();
  }, []);

  const handleFindNotificaciones = () => {
    const url = `${API}/datos-validacion-pago`;
    axios
      .get(url, config)
      .then((res) => {
        const notificaciones = res.data.datos || [];
        setPagosRechazados(notificaciones);
      })
      .catch((err) => handleAxiosError(err));
  };

  useEffect(() => {
    if (!socket) return;

    const handleCreated = (notificacion) => {
      if (notificacion) {
        setPagosRechazados((prev) => [notificacion, ...prev]);

        if (audioRef.current) {
          audioRef.current.play();
        }
      }
    };

    socket.on("notificacion-rechazo-pago:create", handleCreated);
    return () => {
      socket.off("notificacion-rechazo-pago:create", handleCreated);
    };
  }, [socket]);

  const handleOpenChangePopover = (open) => {
    setIsPopoverOpen(open);
    if (!open) {
      setIsExpanded(false);
    }
  };

  const handleAbrirChat = (notificacion) => {
    setSelectNotificacion(notificacion);
    onOpen();
    setIsPopoverOpen(false);
  };

  return (
    <>
      <Popover
        placement="bottom-end"
        offset={12}
        isOpen={isPopoverOpen}
        onOpenChange={handleOpenChangePopover}
      >
        <PopoverTrigger>
          <Button
            isIconOnly
            variant="light"
            aria-label="Notificaciones"
            className="overflow-visible border-[0.5px] border-amber-400 text-white/80 hover:text-white transition-colors duration-200"
          >
            <Badge
              color="danger"
              content={unreadCount}
              isInvisible={unreadCount === 0}
              shape="circle"
              size="sm"
              className="border-none shadow-md animate-pulse"
            >
              <div className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <FaBell className="text-xl" />
              </div>
            </Badge>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className={`p-0 w-[380px] -mt-2 bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "transform translate-y-1" : ""
          }`}
        >
          <div className="w-full flex flex-col">
            {/* Cabecera */}
            <div className="px-4 py-2.5 border-b border-white/40 bg-white/40 flex justify-between items-center z-10">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
                <div className="bg-danger-100/80 p-1 rounded-md border border-danger-200/50">
                  <FiAlertCircle className="text-danger-600 text-base" />
                </div>
                Pagos Rechazados
              </h4>
              <Badge
                color="danger"
                variant="flat"
                size="sm"
                className="font-bold border border-danger-200/50 bg-danger-50/80 text-[10px] px-1.5"
              >
                {unreadCount} Nuevos
              </Badge>
            </div>

            <ScrollShadow
              className={`w-full bg-transparent transition-all duration-300 ease-in-out ${
                isExpanded ? "h-[80vh]" : "max-h-[400px]"
              }`}
            >
              {pagosRechazados.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[150px] text-slate-500">
                  <FaRegSadTear className="text-3xl mb-2 opacity-40" />
                  <p className="text-xs font-semibold">Todo al día</p>
                </div>
              ) : (
                <div className="flex flex-col p-2 gap-2">
                  {pagosRechazados.map((notificacion) => (
                    <div
                      key={notificacion.id}
                      onClick={() => {
                        setIsPopoverOpen(false);
                        // Ajusta esta ruta a donde realmente necesites ir en tu app
                        const cotizacionId =
                          notificacion.pago_cotizacion?.cotizacionId;
                        navigate(
                          cotizacionId
                            ? `/cotizaciones/${cotizacionId}`
                            : "/despacho",
                        );
                      }}
                      className="cursor-pointer h-auto p-2.5 bg-white/50 hover:bg-white/80 border border-white/60 shadow-sm backdrop-blur-sm rounded-xl transition-all duration-300 flex flex-col gap-1.5 group relative overflow-hidden whitespace-normal items-start min-w-full justify-start"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-danger-500 opacity-80"></div>

                      <div className="flex justify-between items-center pl-1.5 w-full">
                        <div className="flex flex-col items-start">
                          <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-1 leading-none">
                            Rechazo de Cobro
                          </h3>
                          <p className="text-[9px] text-slate-600 font-medium flex items-center gap-1 mt-0.5">
                            <FaRegCalendarAlt className="opacity-70" />
                            Fecha de Pago:{" "}
                            <span className="font-semibold">
                              {notificacion.pago_cotizacion?.fecha
                                ? formatDate(notificacion.pago_cotizacion.fecha)
                                : "N/A"}
                            </span>
                          </p>
                        </div>
                        <span className="text-[9px] text-slate-900 bg-amber-500 px-1.5 py-0.5 rounded-md border border-white/80 shadow-sm">
                          {formatDateTime(notificacion.createdAt)}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5 pl-1.5 w-full text-left">
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                          <span className="bg-danger-50/80 text-danger-700 font-bold px-2 py-0.5 rounded border border-danger-200/50">
                            S/ {notificacion.pago_cotizacion?.monto || "0.00"}
                          </span>
                          <span className="bg-white/60 text-slate-700 font-medium px-2 py-0.5 rounded border border-white/80 shadow-sm flex items-center gap-1">
                            <FiCreditCard className="opacity-60" /> Op:
                            <span className="font-mono font-bold">
                              {notificacion.pago_cotizacion?.operacion || "S/N"}
                            </span>
                          </span>
                        </div>

                        <div className="mt-0.5 bg-red-50/40 border border-red-200/50 p-1.5 rounded-md backdrop-blur-sm w-full">
                          <p className="text-[9px] font-bold text-danger-800 uppercase tracking-wider leading-none mb-0.5">
                            Motivo:
                          </p>
                          <p className="text-[11px] text-slate-800 font-medium italic leading-tight">
                            "
                            {notificacion.observacion_validacion ||
                              notificacion.pago_cotizacion
                                ?.observaciones_rechazo ||
                              "Ninguna observación detallada"}
                            "
                          </p>
                        </div>
                      </div>

                      <div className="w-full flex justify-end border-t border-white/40 mt-1 pt-1.5">
                        <Button
                          size="sm"
                          color="danger"
                          className="h-6 bg-slate-900 text-[10px] font-medium z-20 relative"
                          onPress={() => {
                            handleAbrirChat(notificacion);
                          }}
                        >
                          <IoChatbubblesOutline className="text-sm " />
                          {notificacion.respuestas_validacion.length}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollShadow>

            {/* Footer */}
            {pagosRechazados.length > 0 && (
              <div className="p-2 bg-white/40 border-t border-white/50 backdrop-blur-md z-10">
                <Button
                  size="sm"
                  variant="flat"
                  className={`w-full font-bold transition-all duration-300 text-xs h-8 ${
                    isExpanded
                      ? "bg-white/50 text-slate-700 hover:bg-white/80 border border-white/60"
                      : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                  }`}
                  onPress={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <>
                      Menos <FiChevronUp className="text-base ml-1" />
                    </>
                  ) : (
                    <>
                      Extender <FiChevronDown className="text-base ml-1" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {selectNotificacion && (
        <ChatRechazoModal
          key={selectNotificacion.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          selectNotificacion={selectNotificacion}
        />
      )}
    </>
  );
};

export default NotificacionRechazoPagos;
