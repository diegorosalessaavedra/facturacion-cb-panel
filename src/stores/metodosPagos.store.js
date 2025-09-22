import { create } from "zustand";
import axios from "axios";
import config from "../utils/getToken";

const useMetodosPagosStore = create((set) => ({
  metodosPagos: [],
  isLoading: false,

  // Obtener metodosPago del backend
  fetchMetodosPagos: async () => {
    set({ isLoading: true });
    try {
      const url = `${import.meta.env.VITE_URL_API}/ajustes/metodos-pago`;
      const res = await axios.get(url, config);
      set({ metodosPagos: res.data.metodosPago, isLoading: false });
    } catch (error) {
      console.error("Error al cargar metodosPago:", error);
      set({ isLoading: false });
    }
  },

  // Opcional: agregar metodosPago locales
  addMetodoPago: (nuevo) =>
    set((state) => ({ metodosPagos: [...state.metodosPagos, nuevo] })),

  // Opcional: eliminar encargado
  removeMetodoPago: (id) =>
    set((state) => ({
      metodosPagos: state.metodosPagos.filter((e) => e.id !== id),
    })),
}));

export default useMetodosPagosStore;
