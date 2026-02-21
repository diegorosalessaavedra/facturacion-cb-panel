import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@nextui-org/react";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import config from "../../../utils/getToken";
import { API } from "../../../utils/api";
import { handleAxiosError } from "../../../utils/handleAxiosError";

const AnularDesembolso = () => {
  const { id, codigo } = useParams();
  const navigate = useNavigate();

  const [desembolso, setDesembolso] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(7);

  const handleRemoveDesembolso = async () => {
    setLoading(true);
    const url = `${API}/caja-chica/desembolso/${id}`;

    try {
      const res = await axios.patch(url, { link_anular: codigo }, config);

      setDesembolso(res.data.desembolso);
      setIsSuccess(true);
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Efecto para manejar el contador y la redirección
  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer); // Limpieza del timer
    } else if (isSuccess && countdown === 0) {
      navigate("/caja-chica/desembolsos"); // Ruta a la que quieres redirigir
    }
  }, [isSuccess, countdown, navigate]);

  return (
    <main className="w-full h-full flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
        {!isSuccess ? (
          // VISTA 1: Confirmación de anulación
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-2">
              <AlertTriangle size={32} />
            </div>
            <h1 className="text-xl font-bold text-slate-800">
              ¿Confirmar Anulación?
            </h1>
            <p className="text-sm text-slate-500 mb-4">
              Estás a punto de anular este desembolso de caja chica. Esta acción
              requiere confirmación.
            </p>
            <Button
              color="danger"
              className="w-full font-bold shadow-lg shadow-red-500/30"
              isLoading={loading}
              onPress={handleRemoveDesembolso}
            >
              Sí, Anular Desembolso
            </Button>
          </div>
        ) : (
          // VISTA 2: Éxito y Contador
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 size={32} />
            </div>
            <h1 className="text-xl font-bold text-slate-800">
              Desembolso Anulado!
            </h1>

            {/* Mostrar detalles de la apertura de forma segura */}
            {desembolso && (
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 w-full text-left mt-2 mb-4">
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                  Detalles:
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Trabajador:</span>{" "}
                  {desembolso.trabajador?.nombre_trabajador || "N/A"}
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Importe:</span> S/{" "}
                  {desembolso.importe_desembolso || "0.00"}
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

export default AnularDesembolso;
