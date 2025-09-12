import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../../../utils/getToken";
import ProductosDespacho from "./components/productos/ProductosDespacho";
import { useSocketContext } from "../../../../../context/SocketContext";

export default function DespachoGrid({ despacho }) {
  const socket = useSocketContext();
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    vendedora: "",
    cliente: "",
    dni_ruc_cliente: "",
    numero_contacto: "",
    observacion: "",
    consignatario1_dni: "",
    consignatario1_nombre: "",
    consignatario2_dni: "",
    consignatario2_nombre: "",
    estado: "",
    total_cobrado: "",
    aplicacion_anticipo: "",
  });

  // Inicializar datos del despacho
  useEffect(() => {
    if (despacho) {
      setFormData((prevData) => ({
        ...prevData,
        vendedora: despacho.vendedora || "",
        cliente: despacho.cliente || "",
        dni_ruc_cliente: despacho.dni_ruc_cliente || "",
        numero_contacto: despacho.numero_contacto || "",
        observacion: despacho.observacion || "",
        consignatario1_dni: despacho.consignatario1_dni || "",
        consignatario1_nombre: despacho.consignatario1_nombre || "",
        consignatario2_dni: despacho.consignatario2_dni || "",
        consignatario2_nombre: despacho.consignatario2_nombre || "",
        estado: despacho.estado || "",
        total_cobrado: despacho.total_cobrado || "",
        aplicacion_anticipo: despacho.aplicacion_anticipo || "",
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
  }, [despacho]);

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

    // Aquí puedes agregar lógica para guardar en la base de datos
    // Por ejemplo, hacer un debounced API call
  };

  // Manejar cambios en los datos de los productos
  const handleProductoChange = (productoId, field, value) => {
    setProductos((prev) =>
      prev.map((producto) =>
        producto.id === productoId ? { ...producto, [field]: value } : producto
      )
    );

    // Calcular totales automáticamente si es necesario
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
        />
      ))}
    </>
  );
}
