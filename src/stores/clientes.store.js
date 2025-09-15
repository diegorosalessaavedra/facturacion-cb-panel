import { create } from "zustand";
import axios from "axios";
import config from "../utils/getToken";

const useClientesStore = create((set) => ({
  clientes: [],
  isLoading: false,

  fetchClientes: async () => {
    set({ isLoading: true });
    try {
      const url = `${import.meta.env.VITE_URL_API}/clientes`;
      const res = await axios.get(url, config);
      set({ clientes: res.data.clientes, isLoading: false });
    } catch (error) {
      console.error("Error al cargar clientes:", error);
      set({ isLoading: false });
    }
  },

  // Opcional: agregar clientes locales
  addEncargado: (nuevo) =>
    set((state) => ({ clientes: [...state.clientes, nuevo] })),

  // Opcional: eliminar encargado
  removeEncargado: (id) =>
    set((state) => ({
      clientes: state.clientes.filter((e) => e.id !== id),
    })),
}));

export default useClientesStore;
