import { create } from "zustand";
import axios from "axios";
import config from "../utils/getToken";

const useProveedoresStore = create((set) => ({
  proveedores: [],
  isLoading: false,

  fetchProveedores: async () => {
    set({ isLoading: true });
    try {
      const url = `${import.meta.env.VITE_URL_API}/proveedores`;
      const res = await axios.get(url, config);
      set({ proveedores: res.data.proveedores, isLoading: false });
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
      set({ isLoading: false });
    }
  },

  // Opcional: agregar proveedores locales
  addEncargado: (nuevo) =>
    set((state) => ({ proveedores: [...state.proveedores, nuevo] })),

  // Opcional: eliminar encargado
  removeEncargado: (id) =>
    set((state) => ({
      proveedores: state.proveedores.filter((e) => e.id !== id),
    })),
}));

export default useProveedoresStore;
