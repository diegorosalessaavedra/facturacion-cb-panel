import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Spinner } from "@nextui-org/react";
import { CheckCircle2, AlertTriangle, Loader2, Info } from "lucide-react";

import { toast } from "sonner";
import { API } from "../../../utils/api";
import config from "../../../utils/getToken";

const ReaperturarSemanaPlanilla = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [semana, setSemana] = useState(null);

    // Estados de carga
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loadingPatch, setLoadingPatch] = useState(false);

    // Estados de control de vista
    const [isAlreadyOpen, setIsAlreadyOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [countdown, setCountdown] = useState(7);

    // 1. Efecto inicial: Cargar la semana y verificar su estado
    useEffect(() => {
        const fetchSemana = async () => {
            setLoadingInitial(true);
            const url = `${API}/semanas-planilla/data/${id}`;
            try {
                const res = await axios.get(url, config);
                const dataSemana = res.data.semanaPlanilla;
                setSemana(dataSemana);

                // Si ya está "EN PROCESO", no permitimos hacer el PATCH nuevamente
                if (dataSemana.estado_planilla === "EN PROCESO") {
                    setIsAlreadyOpen(true);
                }
            } catch (err) {
                // Puedes cambiar handleAxiosError por un console.error temporal si no está importado
                console.error("Error al cargar la semana", err);
                toast.error("Error al obtener información de la planilla");
            } finally {
                setLoadingInitial(false);
            }
        };

        if (id) {
            fetchSemana();
        }
    }, [id]);

    // 2. Ejecutar la reapertura (PATCH)
    const handleReaperturar = async () => {
        setLoadingPatch(true);
        const toastId = toast.loading("Procesando reapertura...");
        const url = `${API}/semanas-planilla/reaperturar/${id}`; // Ajusta a tu endpoint PATCH real

        try {
            const res = await axios.patch(url, {}, config); // IMPORTANTE: Agregado objeto vacío {} para que config sea el 3er parámetro

            setSemana(res.data.semanaPlanilla);
            toast.success("Planilla reaperturada exitosamente", { id: toastId });
            setIsSuccess(true);
        } catch (err) {
            toast.error("Error al procesar", { id: toastId });
            console.error("Error al reaperturar", err);
        } finally {
            setLoadingPatch(false);
        }
    };

    // 3. Efecto para manejar el contador y la redirección
    useEffect(() => {
        // Si la acción fue exitosa O si ya estaba abierta desde el principio
        if ((isSuccess || isAlreadyOpen) && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if ((isSuccess || isAlreadyOpen) && countdown === 0) {
            navigate("/rrhh/planilla"); // Ruta a la que quieres redirigir
        }
    }, [isSuccess, isAlreadyOpen, countdown, navigate]);

    return (
        <main className="w-full min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">

                {/* VISTA 0: Cargando datos iniciales */}
                {loadingInitial ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center gap-4">
                        <Spinner size="lg" color="primary" />
                        <p className="text-sm text-slate-500 font-medium">Verificando información...</p>
                    </div>
                ) : isAlreadyOpen ? (
                    // VISTA 1: La semana ya estaba en proceso (No hacer nada)
                    <div className="p-8 flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-2">
                            <Info size={32} />
                        </div>
                        <h1 className="text-xl font-bold text-slate-800">
                            Planilla Ya Reaperturada
                        </h1>
                        <p className="text-sm text-slate-500 mb-4">
                            Esta semana de planilla ya se encuentra en estado "EN PROCESO" y no requiere ser reaperturada nuevamente.
                        </p>
                        <div className="flex items-center gap-2 text-slate-500 bg-slate-100 px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                            <Loader2 size={16} className="animate-spin" />
                            Redirigiendo en {countdown} segundos...
                        </div>
                    </div>
                ) : !isSuccess ? (
                    // VISTA 2: Confirmación de Reapertura
                    <div className="p-8 flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-2">
                            <AlertTriangle size={32} />
                        </div>
                        <h1 className="text-xl font-bold text-slate-800">
                            ¿Aprobar Reapertura de Planilla?
                        </h1>
                        <p className="text-sm text-slate-500 mb-4">
                            Estás a punto de autorizar la reapertura y devolver la planilla de esta semana a estado "EN PROCESO".
                        </p>

                        {semana && (
                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 w-full text-left mb-2">
                                <p className="text-sm text-slate-700">
                                    <span className="font-semibold">Semana:</span> N° {semana.numero_semana || "-"}
                                </p>
                                <p className="text-sm text-slate-700">
                                    <span className="font-semibold">Mes:</span> {semana.mes_planilla?.mes || "-"}
                                </p>
                                <p className="text-sm text-slate-700">
                                    <span className="font-semibold">Año:</span> {semana.year_planilla?.year || "-"}
                                </p>
                                <p className="text-sm text-slate-700 mt-2 pt-2 border-t border-slate-200">
                                    <span className="font-semibold">Estado Actual:</span> {semana.estado_planilla}
                                </p>
                            </div>
                        )}

                        <Button
                            color="danger"
                            className="w-full font-bold shadow-lg shadow-red-500/30 mt-2"
                            isLoading={loadingPatch}
                            onPress={handleReaperturar}
                        >
                            Sí, Autorizar Reapertura
                        </Button>
                    </div>
                ) : (
                    // VISTA 3: Éxito y Contador
                    <div className="p-8 flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle2 size={32} />
                        </div>
                        <h1 className="text-xl font-bold text-slate-800">
                            ¡Planilla Reaperturada!
                        </h1>

                        {semana && (
                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 w-full text-left mt-2 mb-4">
                                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                                    Detalles Actualizados:
                                </p>
                                <p className="text-sm text-slate-700">
                                    <span className="font-semibold">Periodo:</span> Semana {semana.numero_semana || "-"} - {semana.mes_planilla?.mes || "-"} {semana.year_planilla?.year || "-"}
                                </p>
                                <p className="text-sm text-slate-700 flex items-center gap-1 mt-2">
                                    <span className="font-semibold">Nuevo Estado:</span>
                                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-xs">{semana.estado_planilla}</span>
                                </p>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-slate-500 bg-slate-100 px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                            <Loader2 size={16} className="animate-spin" />
                            Redirigiendo en {countdown} segundos...
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ReaperturarSemanaPlanilla;