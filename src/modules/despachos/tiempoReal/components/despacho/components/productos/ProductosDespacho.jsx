import { useState, useEffect, useCallback } from "react";
import NuevoProductoDespacho from "./NuevoProductoDespacho";
import EliminarProductoDespacho from "./EliminarProductoDespacho";
import useEncargadosStore from "../../../../../../../stores/encargados.store";
import axios from "axios";
import config from "../../../../../../../utils/getToken";
import EliminarDespacho from "../EliminarDespacho";

// Función debounce fuera del componente
function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export default function ProductosDespacho({
  producto,
  despachoData,
  isFirstProduct = false,
  onDespachoChange,
  onProductoChange,
  despacho,
}) {
  const { encargados } = useEncargadosStore();
  const { clientes } = useEncargadosStore();

  const [dataProducto, setDataProducto] = useState();

  useEffect(() => {
    setDataProducto(producto);
  }, [producto]);

  const inputStyles = `
    w-full h-8 px-2 text-[11px] border-0 bg-transparent text-gray-900 
    focus:outline-none focus:bg-green-50 focus:ring-1 focus:ring-green-300
    placeholder-gray-400
  `;

  const readOnlyInputStyles = `
    w-full h-8 px-2 text-[11px] border-0  text-gray-600 
    cursor-not-allowed
  `;

  const cellStyles = `w-[150px] bg-white border-r border-gray-200`;

  // Guardar cambios del producto con debounce
  const saveProductChange = useCallback(
    debounce((productoId, updatedData) => {
      const url = `${
        import.meta.env.VITE_URL_API
      }/producto-despacho/${productoId}`;
      axios
        .patch(url, updatedData, config)
        .catch((err) => console.error("Error guardando producto:", err));
    }, 800), // espera 800ms antes de enviar
    []
  );

  const handleDespachoChange = (field, value) => {
    if (isFirstProduct && onDespachoChange) {
      onDespachoChange(field, value);
    }
  };

  const handleProductoChange = (field, value) => {
    // Crear el objeto con los datos actualizados
    const updatedProducto = {
      ...dataProducto,
      [field]: value,
    };

    // Si es un campo que afecta al total, calcularlo
    if (
      field === "precio_unitario" ||
      field === "cantidad" ||
      field === "agregado_extra"
    ) {
      const cantidad =
        parseFloat(field === "cantidad" ? value : updatedProducto.cantidad) ||
        0;
      const precioUnitario =
        parseFloat(
          field === "precio_unitario" ? value : updatedProducto.precio_unitario
        ) || 0;
      const agregadoExtra =
        parseFloat(
          field === "agregado_extra" ? value : updatedProducto.agregado_extra
        ) || 0;

      const total = cantidad * precioUnitario + agregadoExtra;
      updatedProducto.total_cobrar = total.toFixed(2);
    }

    // Actualizar el estado local
    setDataProducto(updatedProducto);

    // Llamar al callback del padre
    if (onProductoChange) {
      onProductoChange(producto.id, field, value);
    }

    // Guardar en el backend con debounce
    if (producto.id) {
      saveProductChange(producto.id, updatedProducto);
    }
  };

  return (
    <section className="grid grid-cols-[repeat(21,1fr)] border-t-1 gap-[1px] bg-gray-100 hover:bg-gray-100 transition-colors relative">
      {isFirstProduct && (
        <div className="absolute -left-8 flex">
          <EliminarDespacho despachoId={despacho.id} />
        </div>
      )}
      {!isFirstProduct && (
        <div className="absolute -left-7">
          <EliminarProductoDespacho productoId={producto.id} />
        </div>
      )}

      {/* Vendedora */}
      <article className={cellStyles}>
        <select
          value={despachoData.vendedora_id}
          onChange={(e) => handleDespachoChange("vendedora_id", e.target.value)}
          className={`${
            isFirstProduct ? inputStyles : readOnlyInputStyles
          } cursor-pointer`}
          disabled={!isFirstProduct}
        >
          <option value="">Seleccionar</option>
          {encargados.map((encargado) => (
            <option value={encargado.id} key={encargado.id}>
              {encargado.nombre}
            </option>
          ))}
        </select>
      </article>

      {/* Cliente */}
      <article className="w-[250px] flex bg-white items-center justify-center text-center text-xs">
        <input
          type="text"
          value={despachoData.cliente}
          onChange={(e) => handleDespachoChange("cliente", e.target.value)}
          className={readOnlyInputStyles}
          placeholder="Cliente"
          readOnly={true}
        />
      </article>

      {/* DNI/RUC Cliente */}
      <article className={cellStyles}>
        <select
          value={despachoData.vendedora_id}
          onChange={(e) =>
            handleDespachoChange("documento_cliente", e.target.value)
          }
          className={`${
            isFirstProduct ? inputStyles : readOnlyInputStyles
          } cursor-pointer`}
          disabled={!isFirstProduct}
        >
          <option value="">Seleccionar</option>
          {clientes.map((cliente) => (
            <option value={cliente.id} key={cliente.id}>
              {cliente.numeroDoc}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={despachoData.documento_cliente}
          onChange={(e) =>
            handleDespachoChange("documento_cliente", e.target.value)
          }
          className={isFirstProduct ? inputStyles : readOnlyInputStyles}
          placeholder="DNI/RUC"
          readOnly={!isFirstProduct}
        />
      </article>

      {/* Número de contacto */}
      <article className={cellStyles}>
        <input
          type="tel"
          value={despachoData.numero_contacto}
          onChange={(e) =>
            handleDespachoChange("numero_contacto", e.target.value)
          }
          className={isFirstProduct ? inputStyles : readOnlyInputStyles}
          placeholder="Teléfono"
          readOnly={!isFirstProduct}
        />
      </article>

      {/* Observación */}
      <article className={cellStyles}>
        <input
          type="text"
          value={despachoData.observacion}
          onChange={(e) => handleDespachoChange("observacion", e.target.value)}
          className={isFirstProduct ? inputStyles : readOnlyInputStyles}
          placeholder="Observación"
          readOnly={!isFirstProduct}
        />
      </article>

      {/* Consignatario 1 - DNI */}
      <article className={cellStyles}>
        <input
          type="text"
          value={despachoData.consignatario1_documento}
          onChange={(e) =>
            handleDespachoChange("consignatario1_documento", e.target.value)
          }
          className={isFirstProduct ? inputStyles : readOnlyInputStyles}
          placeholder="DNI/RUC"
          readOnly={!isFirstProduct}
        />
      </article>

      {/* Consignatario 1 - Nombre */}
      <article className={cellStyles}>
        <input
          type="text"
          value={despachoData.consignatario1_nombre}
          onChange={(e) =>
            handleDespachoChange("consignatario1_nombre", e.target.value)
          }
          className={isFirstProduct ? inputStyles : readOnlyInputStyles}
          placeholder="Nombre"
          readOnly={!isFirstProduct}
        />
      </article>

      {/* Consignatario 2 - DNI */}
      <article className={cellStyles}>
        <input
          type="text"
          value={despachoData.consignatario2_documento}
          onChange={(e) =>
            handleDespachoChange("consignatario2_documento", e.target.value)
          }
          className={isFirstProduct ? inputStyles : readOnlyInputStyles}
          placeholder="DNI/RUC"
          readOnly={!isFirstProduct}
        />
      </article>

      {/* Consignatario 2 - Nombre */}
      <article className={cellStyles}>
        <input
          type="text"
          value={despachoData.consignatario2_nombre}
          onChange={(e) =>
            handleDespachoChange("consignatario2_nombre", e.target.value)
          }
          className={isFirstProduct ? inputStyles : readOnlyInputStyles}
          placeholder="Nombre"
          readOnly={!isFirstProduct}
        />
      </article>

      {/* Cantidad */}
      <article className={cellStyles}>
        <input
          type="number"
          value={dataProducto?.cantidad || ""}
          onChange={(e) => handleProductoChange("cantidad", e.target.value)}
          className={inputStyles}
          placeholder="0"
          min="0"
          step="1"
        />
      </article>

      {/* Centro de costos */}
      <article className={cellStyles}>
        <input
          type="text"
          value={dataProducto?.centro_costos || ""}
          onChange={(e) =>
            handleProductoChange("centro_costos", e.target.value)
          }
          className={inputStyles}
          placeholder="Centro"
        />
      </article>

      {/* Línea */}
      <article className={cellStyles}>
        <input
          type="text"
          value={dataProducto?.linea || ""}
          onChange={(e) => handleProductoChange("linea", e.target.value)}
          className={inputStyles}
          placeholder="Línea"
        />
      </article>

      {/* Destino */}
      <article className={cellStyles}>
        <input
          type="text"
          value={dataProducto?.destino || ""}
          onChange={(e) => handleProductoChange("destino", e.target.value)}
          className={inputStyles}
          placeholder="Destino"
        />
      </article>

      {/* Tipo de envío */}
      <article className={cellStyles}>
        <select
          value={dataProducto?.tipo_envio || ""}
          onChange={(e) => handleProductoChange("tipo_envio", e.target.value)}
          className={`${inputStyles} cursor-pointer`}
        >
          <option value="">Seleccionar</option>
          <option value="ALMACEN">ALMACEN</option>
          <option value="TERRESTRE">TERRESTRE</option>
          <option value="AEREO">AEREO</option>
        </select>
      </article>

      {/* OS/Transporte */}
      <article className={cellStyles}>
        <input
          type="text"
          value={dataProducto?.os_transporte || ""}
          onChange={(e) =>
            handleProductoChange("os_transporte", e.target.value)
          }
          className={inputStyles}
          placeholder="OS/Transport"
        />
      </article>

      {/* Precio unitario */}
      <article className={cellStyles}>
        <input
          type="number"
          value={dataProducto?.precio_unitario || ""}
          onChange={(e) =>
            handleProductoChange("precio_unitario", e.target.value)
          }
          className={inputStyles}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </article>

      {/* Agregado extra */}
      <article className={cellStyles}>
        <input
          type="number"
          value={dataProducto?.agregado_extra || ""}
          onChange={(e) =>
            handleProductoChange("agregado_extra", e.target.value)
          }
          className={inputStyles}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </article>

      {/* Total a cobrar */}
      <article className={`${cellStyles} bg-yellow-50`}>
        <input
          type="number"
          value={dataProducto?.total_cobrar || ""}
          onChange={(e) => handleProductoChange("total_cobrar", e.target.value)}
          className={`${inputStyles} bg-yellow-50 font-semibold`}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </article>

      {/* Estado */}
      <article className={cellStyles}>
        <select
          value={despachoData.estado}
          onChange={(e) => handleDespachoChange("estado", e.target.value)}
          className={`${
            isFirstProduct ? inputStyles : readOnlyInputStyles
          } cursor-pointer`}
          disabled={!isFirstProduct}
        >
          <option value="">Estado</option>
          <option value="pendiente">Pendiente</option>
          <option value="procesando">Procesando</option>
          <option value="enviado">Enviado</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </article>

      {/* Total cobrado */}
      <article className={`${cellStyles} bg-green-50`}>
        <input
          type="number"
          value={despachoData.total_cobrado}
          onChange={(e) =>
            handleDespachoChange("total_cobrado", e.target.value)
          }
          className={`${
            isFirstProduct ? inputStyles : readOnlyInputStyles
          } bg-green-50`}
          placeholder="0.00"
          min="0"
          step="0.01"
          readOnly={!isFirstProduct}
        />
      </article>

      {/* Aplicación anticipo */}
      <article className={cellStyles}>
        <input
          type="number"
          value={despachoData.anticipo_aplicado}
          onChange={(e) =>
            handleDespachoChange("anticipo_aplicado", e.target.value)
          }
          className={isFirstProduct ? inputStyles : readOnlyInputStyles}
          placeholder="0.00"
          min="0"
          step="0.01"
          readOnly={!isFirstProduct}
        />
      </article>
    </section>
  );
}
