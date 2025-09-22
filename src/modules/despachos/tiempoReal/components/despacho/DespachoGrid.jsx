import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import config from "../../../../../utils/getToken";
import ProductosDespacho from "./components/productos/ProductosDespacho";
import { useSocketContext } from "../../../../../context/SocketContext";
import CobroDespacho from "./components/productos/CobroDespacho";

const DespachoGrid = ({ despacho, cobrosItem }) => {
  const socket = useSocketContext();

  const [productos, setProductos] = useState([]);
  const [cobros, setCobros] = useState([]);
  const [cliente, setCliente] = useState();
  const [formData, setFormData] = useState({});

  // Referencias para evitar conflictos entre actualizaciones optimistas y del socket
  const optimisticUpdatesRef = useRef(new Set());

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

  const handleFindCliente = () => {
    if (formData.cliente_id) {
      const url = `${import.meta.env.VITE_URL_API}/clientes/${
        formData.cliente_id
      }`;
      axios.get(url, config).then((res) => {
        setCliente(res.data.cliente);
      });
    }
  };

  useEffect(() => {
    handleFindCliente();
  }, [formData.cliente_id]);

  const handleFindCobros = () => {
    if (despacho.id) {
      const url = `${import.meta.env.VITE_URL_API}/cobro-despacho/${
        despacho.id
      }`;
      axios.get(url, config).then((res) => {
        setCobros(res.data.cobroDespachos);
      });
    }
  };

  useEffect(() => {
    if (despacho.id) {
      handleFindProductos();
      handleFindCobros();
      handleFindCliente();
    }
  }, [despacho.id]);

  // Socket para productos con manejo de conflictos optimistas
  useEffect(() => {
    if (!socket) return;

    const handleCreated = (productoDespacho) => {
      if (productoDespacho.despacho_id === despacho.id) {
        setProductos((prev) => {
          // Evitar duplicados
          if (prev.find((p) => p.id === productoDespacho.id)) {
            return prev;
          }
          return [...prev, productoDespacho];
        });
      }
    };

    const handleDeleted = (productoDespacho) => {
      setProductos((prev) => prev.filter((p) => p.id !== productoDespacho.id));
    };

    const handleUpdated = (productoDespacho) => {
      setProductos((prev) =>
        prev.map((p) => {
          if (p.id === productoDespacho.id) {
            const optimisticKey = `producto_${productoDespacho.id}`;
            const hasRecentOptimistic = Array.from(
              optimisticUpdatesRef.current
            ).some((key) => key.startsWith(optimisticKey));

            if (hasRecentOptimistic) {
              // Hay actualizaciones optimistas, mantener los valores locales
              return p;
            }

            return productoDespacho;
          }
          return p;
        })
      );
    };

    const handleCreatedCobro = (cobroDespacho) => {
      setCobros((prev) => {
        if (prev.find((c) => c.id === cobroDespacho.id)) {
          return prev;
        }
        return [...prev, cobroDespacho];
      });
    };

    const handleUpdateCobro = (cobroDespacho) => {
      setCobros((prev) =>
        prev.map((p) => (p.id === cobroDespacho.id ? cobroDespacho : p))
      );
    };

    const handleUpdateCliente = (clienteIo) => {
      setCliente(clienteIo);
    };

    socket.on(`productoDespacho:created:${despacho.id}`, handleCreated);
    socket.on(`productoDespacho:delete:${despacho.id}`, handleDeleted);
    socket.on(`productoDespacho:update:${despacho.id}`, handleUpdated);

    socket.on(`cobroDespacho:created:${despacho.id}`, handleCreatedCobro);
    socket.on(`cobroDespacho:update:${despacho.id}`, handleUpdateCobro);

    socket.on(`cliente:update:${cliente?.id}`, handleUpdateCliente);

    return () => {
      socket.off(`productoDespacho:created:${despacho.id}`, handleCreated);
      socket.off(`productoDespacho:delete:${despacho.id}`, handleDeleted);
      socket.off(`productoDespacho:update:${despacho.id}`, handleUpdated);

      socket.off(`cobroDespacho:created:${despacho.id}`, handleCreatedCobro);
      socket.off(`cobroDespacho:update:${despacho.id}`, handleUpdateCobro);

      socket.off(`cliente:update:${cliente?.id}`, handleUpdateCliente);
    };
  }, [socket, despacho.id, cliente]);

  // Guardar cambios del despacho con debounce y manejo optimista
  const saveFieldChange = useCallback(
    debounce(async (id, field, value) => {
      const updateKey = `despacho_${id}_${field}`;

      try {
        optimisticUpdatesRef.current.add(updateKey);

        const url = `${import.meta.env.VITE_URL_API}/despacho/${id}`;
        await axios.patch(url, { [field]: value }, config);

        // Limpiar actualización optimista después del éxito
        setTimeout(() => {
          optimisticUpdatesRef.current.delete(updateKey);
        }, 1000);
      } catch (err) {
        console.error("Error guardando despacho:", err);

        // Revertir cambio optimista en caso de error
        setFormData((prev) => ({
          ...prev,
          [field]: despacho[field], // Revertir al valor original
        }));

        optimisticUpdatesRef.current.delete(updateKey);
      }
    }, 1000),
    [despacho]
  );

  const handleDespachoChange = (field, value) => {
    // 1. Actualización optimista inmediata
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 2. Marcar como actualización optimista
    const updateKey = `despacho_${despacho.id}_${field}`;
    optimisticUpdatesRef.current.add(updateKey);

    // 3. Guardar en backend
    if (despacho.id) {
      saveFieldChange(despacho.id, field, value);
    }
  };

  const handleProductoChange = (productoId, field, value) => {
    // 1. Actualización optimista inmediata
    setProductos((prev) =>
      prev.map((producto) => {
        if (producto.id === productoId) {
          const updatedProducto = { ...producto, [field]: value };

          // Recalcular total si es necesario
          if (
            field === "precio_unitario" ||
            field === "cantidad" ||
            field === "agregado_extra"
          ) {
            const cantidad =
              parseFloat(
                field === "cantidad" ? value : updatedProducto.cantidad
              ) || 0;
            const precioUnitario =
              parseFloat(
                field === "precio_unitario"
                  ? value
                  : updatedProducto.precio_unitario
              ) || 0;
            const agregadoExtra =
              parseFloat(
                field === "agregado_extra"
                  ? value
                  : updatedProducto.agregado_extra
              ) || 0;

            const total = cantidad * precioUnitario + agregadoExtra;
            updatedProducto.total_cobrar = total.toFixed(2);
          }

          return updatedProducto;
        }
        return producto;
      })
    );

    // 2. Marcar como actualización optimista
    const updateKey = `producto_${productoId}_${field}`;
    optimisticUpdatesRef.current.add(updateKey);

    // Limpiar la marca después de un tiempo
    setTimeout(() => {
      optimisticUpdatesRef.current.delete(updateKey);
    }, 2000);
  };

  const handleCobroChange = (cobroId, field, value) => {
    // Actualización optimista inmediata para cobros
    setCobros((prev) =>
      prev.map((cobro) =>
        cobro.id === cobroId ? { ...cobro, [field]: value } : cobro
      )
    );
  };

  // Función para limpiar actualizaciones optimistas antiguas
  useEffect(() => {
    const interval = setInterval(() => {
      // Limpiar actualizaciones optimistas que han estado activas por más de 5 segundos
      const now = Date.now();
      const keysToDelete = [];

      optimisticUpdatesRef.current.forEach((key) => {
        // Aquí podrías implementar una lógica más sofisticada para determinar
        // cuándo limpiar las actualizaciones optimistas
      });

      keysToDelete.forEach((key) => {
        optimisticUpdatesRef.current.delete(key);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // No renderizar nada si no hay productos
  if (!productos || productos.length === 0) {
    return null;
  }

  const totalCobrar = productos.reduce((acc, p) => {
    return acc + Number(p.total_cobrar || 0);
  }, 0);

  const existCobros =
    cobros.reduce((acc, p) => {
      return acc + Number(p.monto || 0);
    }, 0) > 0;

  return (
    <>
      {productos
        .slice() // para no mutar el array original
        .sort((a, b) => {
          const orden = {
            PRODUCTO: 0,
            CAJA: 1,
            VACUNA: 2,
          };
          return (
            (orden[a.tipo_producto] ?? 99) - (orden[b.tipo_producto] ?? 99)
          );
        })
        .map((producto) => (
          <section
            key={producto.id}
            className="grid grid-flow-col border-t-1 gap-[1px] bg-gray-100 hover:bg-gray-100 transition-colors relative"
          >
            <ProductosDespacho
              producto={producto}
              despachoData={formData}
              isFirstProduct={producto.tipo_producto === "PRODUCTO"}
              onDespachoChange={handleDespachoChange}
              onProductoChange={handleProductoChange}
              despacho={despacho}
              cobrosItem={cobrosItem}
              totalCobrar={totalCobrar}
              clienteDespacho={cliente}
              existCobros={existCobros}
            />
            {cobrosItem.map((cobro, index) => (
              <CobroDespacho
                key={cobro.id}
                index={index}
                isFirstProduct={producto.tipo_producto === "PRODUCTO"}
                cobro={cobros[index]}
                despacho={despacho}
                handleCobrosChange={handleCobroChange}
                cliente={cliente}
              />
            ))}
          </section>
        ))}
    </>
  );
};

export default DespachoGrid;

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
