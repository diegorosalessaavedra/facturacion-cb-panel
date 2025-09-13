import { create } from "zustand";
import axios from "axios";
import config from "../utils/getToken";

const useEncargadosStore = create((set) => ({
  encargados: [],
  isLoading: false,

  // Obtener encargados del backend
  fetchEncargados: async () => {
    set({ isLoading: true });
    try {
      const url = `${
        import.meta.env.VITE_URL_API
      }/ajustes/encargado?cargo=Vendedor`;
      const res = await axios.get(url, config);
      set({ encargados: res.data.encargados, isLoading: false });
    } catch (error) {
      console.error("Error al cargar encargados:", error);
      set({ isLoading: false });
    }
  },

  // Opcional: agregar encargados locales
  addEncargado: (nuevo) =>
    set((state) => ({ encargados: [...state.encargados, nuevo] })),

  // Opcional: eliminar encargado
  removeEncargado: (id) =>
    set((state) => ({
      encargados: state.encargados.filter((e) => e.id !== id),
    })),
}));

export default useEncargadosStore;
