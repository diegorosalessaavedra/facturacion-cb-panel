// src/utils/errorHandler.ts
import axios from "axios";
import { toast } from "sonner";

export const handleAxiosError = (err) => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Error inesperado";

    if (status === 401 || status === 410) {
      toast.error(message || "Tu sesión ha expirado, inicia sesión nuevamente");
      localStorage.clear();
      window.location.reload();
    } else {
      toast.error(message);
    }

    return message;
  } else {
    toast.error("Ocurrió un error inesperado");
    return "Ocurrió un error inesperado";
  }
};
