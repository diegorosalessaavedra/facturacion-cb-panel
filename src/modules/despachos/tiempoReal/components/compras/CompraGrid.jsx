import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import config from "../../../../../utils/getToken";
import { useSocketContext } from "../../../../../context/SocketContext";
import ProductosCompra from "./components/productos/ProductosCompra";
import PagoCompraDespacho from "./components/productos/PagoCompraDespacho";

const CompraGrid = ({ compra, pagosItem }) => {
  const socket = useSocketContext();

  const [productos, setProductos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [proveedor, setProveedor] = useState([]);
  const [formData, setFormData] = useState({});

  // Referencias para evitar conflictos entre actualizaciones optimistas y del socket
  const optimisticUpdatesRef = useRef(new Set());

  useEffect(() => {
    setFormData(compra);
  }, [compra]);

  const handleFindProductos = () => {
    if (compra.id) {
      const url = `${import.meta.env.VITE_URL_API}/producto-compra-despacho/${
        compra.id
      }`;
      axios.get(url, config).then((res) => {
        setProductos(res.data.productoCompraDespachos);
      });
    }
  };

  const handleFindProveedores = () => {
    if (formData.proveedor_id) {
      const url = `${import.meta.env.VITE_URL_API}/proveedores/${
        formData.proveedor_id
      }`;
      axios.get(url, config).then((res) => {
        setProveedor(res.data.proveedor);
      });
    }
  };

  useEffect(() => {
    handleFindProveedores();
  }, [formData.proveedor_id]);

  const handleFindPagos = () => {
    if (compra.id) {
      const url = `${import.meta.env.VITE_URL_API}/pago-compra-despacho/${
        compra.id
      }`;
      axios.get(url, config).then((res) => {
        setPagos(res.data.pagoCompraDespachos);
      });
    }
  };

  useEffect(() => {
    if (compra.id) {
      handleFindProductos();
      handleFindPagos();
      handleFindProveedores();
    }
  }, [compra.id]);

  // Socket para productos con manejo de conflictos optimistas
  useEffect(() => {
    if (!socket) return;

    const handleCreated = (productoCompraDespacho) => {
      if (productoCompraDespacho.compra_despacho_id === compra.id) {
        setProductos((prev) => {
          // Evitar duplicados
          if (prev.find((p) => p.id === productoCompraDespacho.id)) {
            return prev;
          }
          return [...prev, productoCompraDespacho];
        });
      }
    };

    const handleDeleted = (productoCompraDespacho) => {
      setProductos((prev) =>
        prev.filter((p) => p.id !== productoCompraDespacho.id)
      );
    };

    const handleUpdated = (productoCompraDespacho) => {
      setProductos((prev) =>
        prev.map((p) => {
          if (p.id === productoCompraDespacho.id) {
            const optimisticKey = `producto_${productoCompraDespacho.id}`;
            const hasRecentOptimistic = Array.from(
              optimisticUpdatesRef.current
            ).some((key) => key.startsWith(optimisticKey));

            if (hasRecentOptimistic) {
              return p;
            }

            return productoCompraDespacho;
          }
          return p;
        })
      );
    };

    const handleCreatedCobro = (pagoCompraDespacho) => {
      setPagos((prev) => {
        if (prev.find((c) => c.id === pagoCompraDespacho.id)) {
          return prev;
        }
        return [...prev, pagoCompraDespacho];
      });
    };

    const handleUpdateCobro = (pagoCompraDespacho) => {
      setPagos((prev) =>
        prev.map((p) =>
          p.id === pagoCompraDespacho.id ? pagoCompraDespacho : p
        )
      );
    };

    const handleUpdateProveedor = (proveedorIo) => {
      setProveedor(proveedorIo);
    };

    socket.on(`productoCompraDespacho:created:${compra.id}`, handleCreated);
    socket.on(`productoCompraDespacho:delete:${compra.id}`, handleDeleted);
    socket.on(`productoCompraDespacho:update:${compra.id}`, handleUpdated);

    socket.on(`pagoCompraDespacho:created:${compra.id}`, handleCreatedCobro);
    socket.on(`pagoCompraDespacho:update:${compra.id}`, handleUpdateCobro);

    socket.on(`proveedor:update:${proveedor?.id}`, handleUpdateProveedor);

    return () => {
      socket.off(`productoCompraDespacho:created:${compra.id}`, handleCreated);
      socket.off(`productoCompraDespacho:delete:${compra.id}`, handleDeleted);
      socket.off(`productoCompraDespacho:update:${compra.id}`, handleUpdated);

      socket.off(`pagoCompraDespacho:created:${compra.id}`, handleCreatedCobro);
      socket.off(`pagoCompraDespacho:update:${compra.id}`, handleUpdateCobro);

      socket.off(`proveedor:update:${proveedor?.id}`, handleUpdateProveedor);
    };
  }, [socket, compra.id, proveedor]);

  // Guardar cambios del compra con debounce y manejo optimista
  const saveFieldChange = useCallback(
    debounce(async (id, field, value) => {
      const updateKey = `compra_${id}_${field}`;

      try {
        optimisticUpdatesRef.current.add(updateKey);

        const url = `${import.meta.env.VITE_URL_API}/compra-despacho/${id}`;
        await axios.patch(url, { [field]: value }, config);

        // Limpiar actualización optimista después del éxito
        setTimeout(() => {
          optimisticUpdatesRef.current.delete(updateKey);
        }, 1000);
      } catch (err) {
        console.error("Error guardando compra:", err);

        // Revertir cambio optimista en caso de error
        setFormData((prev) => ({
          ...prev,
          [field]: compra[field], // Revertir al valor original
        }));

        optimisticUpdatesRef.current.delete(updateKey);
      }
    }, 1000),
    [compra]
  );

  const handleCompraChange = (field, value) => {
    // 1. Actualización optimista inmediata
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 2. Marcar como actualización optimista
    const updateKey = `compra_${compra.id}_${field}`;
    optimisticUpdatesRef.current.add(updateKey);

    // 3. Guardar en backend
    if (compra.id) {
      saveFieldChange(compra.id, field, value);
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

  const handlePagoChange = (cobroId, field, value) => {
    // Actualización optimista inmediata para pagos
    setPagos((prev) =>
      prev.map((cobro) =>
        cobro.id === cobroId ? { ...cobro, [field]: value } : cobro
      )
    );
  };

  // Función para limpiar actualizaciones optimistas antiguas
  useEffect(() => {
    const interval = setInterval(() => {
      // Limpiar actualizaciones optimistas que han estado activas por más de 5 segundos
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

  const existPagos =
    pagos.reduce((acc, p) => {
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
            <ProductosCompra
              producto={producto}
              compraData={formData}
              isFirstProduct={producto.tipo_producto === "PRODUCTO"}
              onCompraChange={handleCompraChange}
              onProductoChange={handleProductoChange}
              compra={compra}
              pagosItem={pagosItem}
              proveedorCompra={proveedor}
              existPagos={existPagos}
            />
            {pagosItem.map((pago, index) => (
              <PagoCompraDespacho
                key={pago.id}
                index={index}
                isFirstProduct={producto.tipo_producto === "PRODUCTO"}
                pago={pagos[index]}
                compra={compra}
                handlePagosChange={handlePagoChange}
                proveedor={proveedor}
              />
            ))}
          </section>
        ))}
    </>
  );
};

export default CompraGrid;

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
