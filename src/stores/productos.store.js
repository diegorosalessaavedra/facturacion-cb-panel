import { create } from "zustand";
import axios from "axios";
import config from "../utils/getToken";

const useProductosStore = create((set) => ({
  productos: [],
  isLoading: false,

  fetchProductos: async () => {
    set({ isLoading: true });
    try {
      const url = `${import.meta.env.VITE_URL_API}/productos/mis-productos`;
      const res = await axios.get(url, config);
      set({ productos: res.data.misProductos, isLoading: false });
    } catch (error) {
      console.error("Error al cargar productos:", error);
      set({ isLoading: false });
    }
  },

  // Opcional: agregar productos locales
  addProducto: (nuevo) =>
    set((state) => ({ productos: [...state.productos, nuevo] })),

  // Opcional: eliminar encargado
  removeProducto: (id) =>
    set((state) => ({
      productos: state.productos.filter((e) => e.id !== id),
    })),
}));

export default useProductosStore;
