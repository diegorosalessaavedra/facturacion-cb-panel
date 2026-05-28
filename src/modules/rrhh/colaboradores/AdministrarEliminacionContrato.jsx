import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Chip, Divider } from "@nextui-org/react";
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  FileText,
  User,
  Briefcase,
  FileQuestion, // Importamos este nuevo icono
} from "lucide-react";
import config from "../../../utils/getToken";
import { API } from "../../../utils/api";
import { handleAxiosError } from "../../../utils/handleAxiosError";

const AdministrarEliminacionContrato = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contratoData, setContratoData] = useState(null);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(7);

  const handleFindContrato = async () => {
    setLoadingFetch(true);
    const url = `${API}/rrhh/contratos/${id}`;

    try {
      const res = await axios.get(url, config);
      setContratoData(res.data.contrato || res.data.data || null);
    } catch (err) {
      handleAxiosError(err);
      setContratoData(null); // Nos aseguramos de que sea null si hay error
    } finally {
      setLoadingFetch(false);
    }
  };

  useEffect(() => {
    if (id) {
      handleFindContrato();
    }
  }, [id]);

  const handleDeleteContrato = async () => {
    setLoadingDelete(true);
    const url = `${API}/rrhh/contratos/${id}`;

    try {
      const res = await axios.delete(url, config);
      setContratoData(res.data.contrato || res.data.data || contratoData);
      setIsSuccess(true);
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setLoadingDelete(false);
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
            <Loader2 size={44} className="animate-spin text-amber-500" />
            <p className="text-sm font-medium animate-pulse">
              Obteniendo información del contrato...
            </p>
          </div>
        ) : !contratoData && !isSuccess ? (
          // ================= VISTA 2: CONTRATO NO EXISTE =================
          <div className="p-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <FileQuestion size={40} strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              El contrato no existe
            </h1>
            <p className="text-sm text-slate-500 mb-8 px-4">
              El contrato que intentas administrar no se encuentra en el
              sistema. Es posible que ya haya sido eliminado previamente o que
              el enlace sea incorrecto.
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
          // ================= VISTA 3: CONFIRMACIÓN =================
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <AlertTriangle size={36} strokeWidth={1.5} />
            </div>

            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Aprobar Eliminación
            </h1>
            <p className="text-sm text-slate-500 mb-6 px-4">
              Estás a punto de eliminar este contrato del sistema. Esta acción
              es irreversible. Por favor, revisa los detalles antes de
              continuar.
            </p>

            {/* DETALLES DEL CONTRATO */}
            <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-5 text-left mb-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <User size={18} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">
                    Colaborador
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {contratoData.colaborador?.nombre_colaborador}{" "}
                    {contratoData.colaborador?.apellidos_colaborador}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <Briefcase size={18} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">
                    Tipo de contrato
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {contratoData.tipo_contrato || "No especificado"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FileText size={18} className="text-slate-400" />
                <div className="flex-1 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-800">
                    Contrato adjunto
                  </p>
                  <a
                    href={`${import.meta.env.VITE_LARAVEL_URL}/contratos/${contratoData.documento_contrato}`}
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

              {/* MOTIVO DE ELIMINACIÓN */}
              {contratoData.motivo_eliminacion && (
                <>
                  <Divider className="my-4" />
                  <div className="bg-red-50/80 border border-red-100 rounded-lg p-3">
                    <p className="text-xs text-red-600 uppercase font-bold mb-1 flex items-center gap-1">
                      <AlertTriangle size={12} /> Motivo de la solicitud:
                    </p>
                    <p className="text-sm text-red-900 italic font-medium">
                      "{contratoData.motivo_eliminacion}"
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="w-full flex flex-col gap-3 mt-2">
              <Button
                color="danger"
                size="lg"
                className="w-full font-bold shadow-lg shadow-red-500/30"
                isLoading={loadingDelete}
                onPress={handleDeleteContrato}
              >
                Confirmar y Eliminar
              </Button>
              <Button
                variant="light"
                size="lg"
                className="w-full font-medium text-slate-600 hover:bg-slate-100"
                isDisabled={loadingDelete}
                onPress={() => navigate("/rrhh/colaboradores")}
              >
                Cancelar y Volver
              </Button>
            </div>
          </div>
        ) : (
          // ================= VISTA 4: ÉXITO =================
          <div className="p-10 flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-2 animate-appearance-in">
              <CheckCircle2 size={40} strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              ¡Contrato Eliminado!
            </h1>
            <p className="text-slate-500 text-sm mb-2">
              El contrato ha sido borrado exitosamente del sistema.
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
                    {contratoData.colaborador?.nombre_colaborador}{" "}
                    {contratoData.colaborador?.apellidos_colaborador}
                  </span>
                </p>
                <p className="text-sm text-slate-700 flex justify-between items-center">
                  <span className="font-semibold text-slate-500">
                    Documento:
                  </span>
                  <a
                    href={`${import.meta.env.VITE_LARAVEL_URL}/contratos/${contratoData.documento_contrato}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Chip
                      color="default"
                      variant="flat"
                      size="sm"
                      className="cursor-pointer"
                    >
                      Ver Respaldo
                    </Chip>
                  </a>
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

export default AdministrarEliminacionContrato;
