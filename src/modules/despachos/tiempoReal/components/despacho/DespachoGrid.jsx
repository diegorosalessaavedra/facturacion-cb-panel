import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import config from "../../../../../utils/getToken";
import ProductosDespacho from "./components/productos/ProductosDespacho";
import { useSocketContext } from "../../../../../context/SocketContext";

export default function DespachoGrid({ despacho }) {
  const socket = useSocketContext();
  const [focusInput, setFocusInput] = useState("_");

  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({});

  // Inicializar datos del despacho
  useEffect(() => {
    setFormData(despacho);
  }, [despacho]);

  const handleFindProductos = () => {
    if (despacho.id) {
      const url = `${import.meta.env.VITE_URL_API}/producto-despacho/${
        despacho.id
      }`;
      axios.get(url, config).then((res) => {
        setProductos(res.data.productosDespacho);
      });
    }
  };

  useEffect(() => {
    if (despacho.id) {
      handleFindProductos();
    }
  }, [despacho.id]);

  // Socket para productos
  useEffect(() => {
    if (!socket) return;

    const handleCreated = (productoDespacho) => {
      if (productoDespacho.despacho_id === despacho.id) {
        setProductos((prev) => [...prev, productoDespacho]);
      }
    };

    const handleDeleted = (productoDespacho) => {
      setProductos((prev) => prev.filter((p) => p.id !== productoDespacho.id));
    };

    const handleUpdated = (productoDespacho) => {
      setProductos((prev) =>
        prev.map((p) => (p.id === productoDespacho.id ? productoDespacho : p))
      );
    };

    socket.on("productoDespacho:created", handleCreated);
    socket.on("productoDespacho:delete", handleDeleted);
    socket.on("productoDespacho:update", handleUpdated);

    return () => {
      socket.off("productoDespacho:created", handleCreated);
      socket.off("productoDespacho:delete", handleDeleted);
      socket.off("productoDespacho:update", handleUpdated);
    };
  }, [socket, despacho.id]);

  // Guardar cambios del despacho con debounce
  const saveFieldChange = useCallback(
    debounce((id, field, value) => {
      const url = `${import.meta.env.VITE_URL_API}/despacho/${id}`;
      axios
        .patch(url, { [field]: value }, config)
        .catch((err) => console.error("Error guardando despacho:", err));
    }, 800), // espera 800ms antes de enviar
    []
  );

  const handleDespachoChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (despacho.id) {
      saveFieldChange(despacho.id, field, value);
    }
  };

  const handleProductoChange = (productoId, field, value) => {
    setProductos((prev) =>
      prev.map((producto) =>
        producto.id === productoId ? { ...producto, [field]: value } : producto
      )
    );

    if (
      field === "precio_unitario" ||
      field === "cantidad" ||
      field === "agregado_extra"
    ) {
      calculateTotalForProduct(productoId);
    }
  };

  const calculateTotalForProduct = (productoId) => {
    setProductos((prev) =>
      prev.map((producto) => {
        if (producto.id === productoId) {
          const cantidad = parseFloat(producto.cantidad) || 0;
          const precioUnitario = parseFloat(producto.precio_unitario) || 0;
          const agregadoExtra = parseFloat(producto.agregado_extra) || 0;
          const total = cantidad * precioUnitario + agregadoExtra;

          return {
            ...producto,
            total_cobrar: total.toFixed(2),
          };
        }
        return producto;
      })
    );
  };

  // No renderizar nada si no hay productos
  if (!productos || productos.length === 0) {
    return null;
  }

  return (
    <>
      {productos.map((producto, index) => (
        <ProductosDespacho
          key={producto.id}
          producto={producto}
          despachoData={formData}
          isFirstProduct={index === 0}
          onDespachoChange={handleDespachoChange}
          onProductoChange={handleProductoChange}
          despacho={despacho}
          focusInput={focusInput}
          setFocusInput={setFocusInput}
        />
      ))}
    </>
  );
}

// ---- Utilidad debounce ----
function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
