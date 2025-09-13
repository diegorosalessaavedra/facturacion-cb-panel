import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../../../utils/getToken";
import ProductosDespacho from "./components/productos/ProductosDespacho";
import { useSocketContext } from "../../../../../context/SocketContext";

export default function DespachoGrid({ despacho }) {
  const socket = useSocketContext();
  const [focusInput, setFocusInput] = useState("_");

  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    vendedora_id: null,
    cliente: "",
    documento_cliente: "",
    numero_contacto: "",
    observacion: "",
    consignatario1_documento: "",
    consignatario1_nombre: "",
    consignatario2_documento: "",
    consignatario2_nombre: "",
    estado: "",
    total_cobrado: null,
    anticipo_aplicado: null,
  });

  console.log(formData);

  // Inicializar datos del despacho
  useEffect(() => {
    if (despacho) {
      setFormData((prevData) => ({
        ...prevData,
        vendedora_id: despacho.vendedora_id ?? null,
        cliente: despacho.cliente || null,
        documento_cliente: despacho.documento_cliente || null,
        numero_contacto: despacho.numero_contacto || null,
        observacion: despacho.observacion || null,
        consignatario1_documento: despacho.consignatario1_documento || null,
        consignatario1_nombre: despacho.consignatario1_nombre || null,
        consignatario2_documento: despacho.consignatario2_documento || null,
        consignatario2_nombre: despacho.consignatario2_nombre || null,
        estado: despacho.estado || null,
        total_cobrado: despacho.total_cobrado || null,
        anticipo_aplicado: despacho.anticipo_aplicado || null,
      }));
    }
  }, [despacho]);

  // Obtener productos del despacho
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

  // Socket para nuevos productos
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

    socket.on("productoDespacho:created", handleCreated);
    socket.on("productoDespacho:delete", handleDeleted);

    return () => {
      socket.off("productoDespacho:created", handleCreated);
      socket.off("productoDespacho:delete", handleDeleted);
    };
  }, [socket, despacho.id]);

  // Manejar cambios en los datos del despacho
  const handleDespachoChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

    // Aquí puedes agregar lógica para guardar en la base de datos
    // Por ejemplo, hacer un debounced API call
  };

  // Función para calcular el total de un producto específico
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

  useEffect(() => {
    if (focusInput !== "_") {
      console.log(focusInput);

      const url = `${import.meta.env.VITE_URL_API}/despacho/${despacho.id}`;

      axios.patch(url, formData, config).then((res) => {});
    }
  }, [focusInput]);

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
