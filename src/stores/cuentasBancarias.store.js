import { create } from "zustand";
import axios from "axios";
import config from "../utils/getToken";

const useCuentasBancariasStore = create((set) => ({
  cuentasBancarias: [],
  isLoading: false,

  // Obtener cuentasBancarias del backend
  fetchCuentasBancarias: async () => {
    set({ isLoading: true });
    try {
      const url = `${import.meta.env.VITE_URL_API}/ajustes/cuentas-banco`;

      const res = await axios.get(url, config);
      set({ cuentasBancarias: res.data.cuentasBancarias, isLoading: false });
    } catch (error) {
      console.error("Error al cargar cuentasBancarias:", error);
      set({ isLoading: false });
    }
  },

  // Opcional: agregar cuentasBancarias locales
  addCuentasBancarias: (nuevo) =>
    set((state) => ({ cuentasBancarias: [...state.cuentasBancarias, nuevo] })),

  // Opcional: eliminar encargado
  removaCuentasBancarias: (id) =>
    set((state) => ({
      cuentasBancarias: state.cuentasBancarias.filter((e) => e.id !== id),
    })),
}));

export default useCuentasBancariasStore;
