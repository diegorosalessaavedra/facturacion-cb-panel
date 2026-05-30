import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Chip, Divider } from "@nextui-org/react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  FileText,
  User,
  Calendar,
  FileQuestion,
} from "lucide-react";
import config from "../../../utils/getToken";
import { API, API_DOC } from "../../../utils/api";
import { handleAxiosError } from "../../../utils/handleAxiosError";

// Función de ayuda para formatear fechas si no tienes el hook a la mano
const formatDateStr = (dateString) => {
  if (!dateString) return "No definida";
  const date = new Date(dateString);
  // Ajuste de zona horaria para evitar desfases
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const AdministrarSolicitudVacaciones = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vacacionData, setVacacionData] = useState(null);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [actionStatus, setActionStatus] = useState(""); // 'ACEPTADO' o 'RECHAZADO'
  const [countdown, setCountdown] = useState(5);

  const handleFindVacacion = async () => {
    setLoadingFetch(true);
    const url = `${API}/rrhh/vacaciones/${id}`;

    try {
      const res = await axios.get(url, config);
      // Ajusta según cómo devuelva los datos tu controlador backend
      setVacacionData(res.data.vacacion || res.data.data || null);
    } catch (err) {
      handleAxiosError(err);
      setVacacionData(null);
    } finally {
      setLoadingFetch(false);
    }
  };

  useEffect(() => {
    if (id) {
      handleFindVacacion();
    }
  }, [id]);

  const handleUpdateStatus = async (status) => {
    setLoadingAction(true);
    const url = `${API}/rrhh/vacaciones/${id}`;

    try {
      await axios.patch(url, { pendiente_autorizacion: status }, config);
      setActionStatus(status);
      setIsSuccess(true);
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setLoadingAction(false);
    }
  };

  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isSuccess && countdown === 0) {
      navigate("/rrhh/colaboradores");
    }
  }, [isSuccess, countdown, navigate]);

  return (
    <main className="w-full min-h-[80vh] flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200 transition-all">
        {loadingFetch ? (
          // ================= VISTA 1: CARGA INICIAL =================
          <div className="p-16 flex flex-col items-center justify-center gap-4 text-slate-500">
            <Loader2 size={44} className="animate-spin text-blue-500" />
            <p className="text-sm font-medium animate-pulse">
              Obteniendo información de la solicitud...
            </p>
          </div>
        ) : !vacacionData && !isSuccess ? (
          // ================= VISTA 2: SOLICITUD NO EXISTE =================
          <div className="p-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <FileQuestion size={40} strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Solicitud no encontrada
            </h1>
            <p className="text-sm text-slate-500 mb-8 px-4">
              La solicitud de vacaciones que intentas administrar no se
              encuentra en el sistema. Es posible que el enlace sea incorrecto.
            </p>
            <Button
              color="primary"
              size="lg"
              className="w-full font-medium"
              onPress={() => navigate("/rrhh/colaboradores")}
            >
              Volver a Colaboradores
            </Button>
          </div>
        ) : !isSuccess ? (
          // ================= VISTA 3: GESTIÓN DE SOLICITUD =================
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Calendar size={36} strokeWidth={1.5} />
            </div>

            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Autorizar Vacaciones
            </h1>
            <p className="text-sm text-slate-500 mb-6 px-4">
              Por favor, revisa los detalles de la solicitud de vacaciones antes
              de emitir una resolución.
            </p>

            {/* DETALLES DE LA SOLICITUD */}
            <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-5 text-left mb-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <User size={18} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">
                    Colaborador
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {vacacionData.colaborador?.nombre_colaborador}{" "}
                    {vacacionData.colaborador?.apellidos_colaborador}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">
                    Tipo
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {vacacionData.tipo_vaciones}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">
                    Días Totales
                  </p>
                  <p className="text-sm font-bold text-blue-600">
                    {vacacionData.dias_totales} Días
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">
                    Fecha de Inicio
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {formatDateStr(vacacionData.fecha_inicio)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">
                    Fecha Final
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {formatDateStr(vacacionData.fecha_final)}
                  </p>
                </div>
              </div>

              {/* DOCUMENTO ADJUNTO SI EXISTE */}
              {vacacionData.solicitud_adjunto ? (
                <>
                  <Divider className="my-4" />
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-slate-400" />
                    <div className="flex-1 flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-800">
                        Formato Adjunto
                      </p>
                      <a
                        href={
                          vacacionData.solicitud_adjunto.startsWith("http")
                            ? vacacionData.solicitud_adjunto
                            : `${API_DOC}/solped/${vacacionData.solicitud_adjunto}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Chip
                          color="primary"
                          variant="flat"
                          size="sm"
                          className="cursor-pointer hover:bg-primary-100 transition-colors"
                        >
                          Ver Archivo
                        </Chip>
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-4 flex items-center gap-2 text-amber-600 bg-amber-50 p-2 rounded-md text-xs font-medium border border-amber-200">
                  <AlertCircle size={14} />
                  <span>Esta solicitud no cuenta con formato adjunto.</span>
                </div>
              )}
            </div>

            {/* ESTADO ACTUAL (Si ya fue gestionada previamente) */}
            {vacacionData.pendiente_autorizacion !== "PENDIENTE" && (
              <div className="mb-4 text-sm font-medium">
                Estado actual:{" "}
                <Chip
                  color={
                    vacacionData.pendiente_autorizacion === "ACEPTADO"
                      ? "success"
                      : "danger"
                  }
                  variant="flat"
                  size="sm"
                >
                  {vacacionData.pendiente_autorizacion}
                </Chip>
              </div>
            )}

            <div className="w-full flex flex-col gap-3 mt-2">
              <Button
                color="success"
                size="lg"
                className="w-full font-bold text-white shadow-lg shadow-green-500/30"
                isLoading={loadingAction}
                onPress={() => handleUpdateStatus("ACEPTADO")}
              >
                Aprobar Solicitud
              </Button>
              <Button
                color="danger"
                variant="flat"
                size="lg"
                className="w-full font-bold"
                isDisabled={loadingAction}
                onPress={() => handleUpdateStatus("RECHAZADO")}
              >
                Rechazar Solicitud
              </Button>
            </div>
          </div>
        ) : (
          // ================= VISTA 4: ÉXITO =================
          <div className="p-10 flex flex-col items-center text-center gap-4">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 animate-appearance-in ${
                actionStatus === "ACEPTADO"
                  ? "bg-green-50 text-green-500"
                  : "bg-red-50 text-red-500"
              }`}
            >
              {actionStatus === "ACEPTADO" ? (
                <CheckCircle2 size={40} strokeWidth={2} />
              ) : (
                <XCircle size={40} strokeWidth={2} />
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Solicitud {actionStatus === "ACEPTADO" ? "Aprobada" : "Rechazada"}
            </h1>
            <p className="text-slate-500 text-sm mb-2">
              La resolución de las vacaciones se ha guardado exitosamente en el
              sistema.
            </p>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 w-full text-left mt-2 mb-6">
              <p className="text-xs text-slate-400 uppercase font-semibold mb-3 border-b border-slate-200 pb-2">
                Resumen de la operación
              </p>
              <div className="space-y-2">
                <p className="text-sm text-slate-700 flex justify-between">
                  <span className="font-semibold text-slate-500">
                    Colaborador:
                  </span>
                  <span className="text-right">
                    {vacacionData.colaborador?.nombre_colaborador}{" "}
                    {vacacionData.colaborador?.apellidos_colaborador}
                  </span>
                </p>
                <p className="text-sm text-slate-700 flex justify-between">
                  <span className="font-semibold text-slate-500">
                    Estado Final:
                  </span>
                  <span
                    className={`font-bold ${
                      actionStatus === "ACEPTADO"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {actionStatus}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 text-slate-600 bg-slate-100 px-5 py-3 rounded-full text-sm font-medium w-full">
              <Loader2 size={18} className="animate-spin text-slate-400" />
              Redirigiendo en {countdown} segundos...
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdministrarSolicitudVacaciones;
