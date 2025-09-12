import { useState } from "react";
import NuevoProductoDespacho from "./NuevoProductoDespacho";
import { div } from "framer-motion/client";
import EliminarProductoDespacho from "./EliminarProductoDespacho";

export default function ProductosDespacho({
  producto,
  despachoData,
  isFirstProduct = false,
  onDespachoChange,
  onProductoChange,
  despacho,
}) {
  const [focusInput, setFocusInput] = useState("");

  const inputStyles = `
    w-full h-8 px-2 text-xs border-0 bg-transparent text-gray-900 
    focus:outline-none focus:bg-green-50 focus:ring-1 focus:ring-green-300
    placeholder-gray-400
  `;

  const readOnlyInputStyles = `
    w-full h-8 px-2 text-xs border-0  text-gray-600 
    cursor-not-allowed
  `;

  const cellStyles = `w-[150px] bg-white border-r border-gray-200`;

  const handleDespachoChange = (field, value) => {
    if (isFirstProduct && onDespachoChange) {
      onDespachoChange(field, value);
    }
  };

  const handleProductoChange = (field, value) => {
    if (onProductoChange) {
      onProductoChange(producto.id, field, value);
    }
  };

  return (
    <section className="grid grid-cols-[repeat(21,1fr)] gap-[1px] bg-gray-100 hover:bg-gray-100 transition-colors relative">
      {isFirstProduct && (
        <div className="absolute -left-8">
          <NuevoProductoDespacho depachoId={despacho.id} />{" "}
        </div>
      )}
      {!isFirstProduct && (
        <div className="absolute -left-8">
          <EliminarProductoDespacho productoId={producto.id} />{" "}
        </div>
      )}
      <article className={cellStyles}>
        <select
          value={despachoData.vendedora}
          onChange={(e) => handleDespachoChange("vendedora", e.target.value)}
          className={`${
            isFirstProduct ? inputStyles : readOnlyInputStyles
          } cursor-pointer`}
          disabled={!isFirstProduct}
        >
          <option value="">Seleccionar</option>
          <option value="IRIS">IRIS</option>
          <option value="MERY">MERY</option>
          <option value="JUDIT">JUDIT</option>
        </select>
      </article>

      {/* Cliente - Solo editable en el primer producto */}
      <article
        className={`w-[250px] flex bg-white items-center justify-center text-center text-xs`}
      >
        <input
          type="text"
          value={despachoData.cliente}
          onChange={(e) => handleDespachoChange("cliente", e.target.value)}
          className={isFirstProduct ? inputStyles : readOnlyInputStyles}
          placeholder="Cliente"
          onFocus={() => setFocusInput("Cliente")}
          readOnly={!isFirstProduct}
        />
      </article>

      {/* DNI/RUC Cliente - Solo editable en el primer producto */}
      <article className={cellStyles}>
        <input
          type="text"
          value={despachoData.dni_ruc_cliente}
          onChange={(e) =>
            handleDespachoChange("dni_ruc_cliente", e.target.value)
          }
          className={isFirstProduct ? inputStyles : readOnlyInputStyles}
          placeholder="DNI/RUC"
          onFocus={() => setFocusInput("Cliente")}
          readOnly={!isFirstProduct}
        />
      </article>

      {/* Número de contacto - Solo editable en el primer producto */}
      <article className={cellStyles}>
        <input
          type="tel"
          value={despachoData.numero_contacto}
          onChange={(e) =>
            handleDespachoChange("numero_contacto", e.target.value)
          }
          className={isFirstProduct ? inputStyles : readOnlyInputStyles}
          placeholder="Teléfono"
          onFocus={() => setFocusInput("Cliente")}
          readOnly={!isFirstProduct}
        />
      </article>

      {/* Observación - Solo editable en el primer producto */}
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

      {/* Consignatario 1 - DNI - Solo editable en el primer producto */}
      <article className={cellStyles}>
        <input
          type="text"
          value={despachoData.consignatario1_dni}
          onChange={(e) =>
            handleDespachoChange("consignatario1_dni", e.target.value)
          }
          className={isFirstProduct ? inputStyles : readOnlyInputStyles}
          placeholder="DNI/RUC"
          readOnly={!isFirstProduct}
        />
      </article>

      {/* Consignatario 1 - Nombre - Solo editable en el primer producto */}
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

      {/* Consignatario 2 - DNI - Solo editable en el primer producto */}
      <article className={cellStyles}>
        <input
          type="text"
          value={despachoData.consignatario2_dni}
          onChange={(e) =>
            handleDespachoChange("consignatario2_dni", e.target.value)
          }
          className={isFirstProduct ? inputStyles : readOnlyInputStyles}
          placeholder="DNI/RUC"
          readOnly={!isFirstProduct}
        />
      </article>

      {/* Consignatario 2 - Nombre - Solo editable en el primer producto */}
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

      {/* Cantidad - Siempre editable para cada producto */}
      <article className={cellStyles}>
        <input
          type="number"
          value={producto.cantidad || ""}
          onChange={(e) => handleProductoChange("cantidad", e.target.value)}
          className={inputStyles}
          placeholder="0"
          min="0"
          step="1"
        />
      </article>

      {/* Centro de costos - Siempre editable para cada producto */}
      <article className={cellStyles}>
        <input
          type="text"
          value={producto.centro_costos || ""}
          onChange={(e) =>
            handleProductoChange("centro_costos", e.target.value)
          }
          className={inputStyles}
          placeholder="Centro"
        />
      </article>

      {/* Línea - Siempre editable para cada producto */}
      <article className={cellStyles}>
        <input
          type="text"
          value={producto.linea || ""}
          onChange={(e) => handleProductoChange("linea", e.target.value)}
          className={inputStyles}
          placeholder="Línea"
        />
      </article>

      {/* Destino - Siempre editable para cada producto */}
      <article className={cellStyles}>
        <input
          type="text"
          value={producto.destino || ""}
          onChange={(e) => handleProductoChange("destino", e.target.value)}
          className={inputStyles}
          placeholder="Destino"
        />
      </article>

      {/* Tipo de envío - Siempre editable para cada producto */}
      <article className={cellStyles}>
        <select
          value={producto.tipo_envio || ""}
          onChange={(e) => handleProductoChange("tipo_envio", e.target.value)}
          className={`${inputStyles} cursor-pointer`}
        >
          <option value="">Seleccionar</option>
          <option value="express">Express</option>
          <option value="normal">Normal</option>
          <option value="economico">Económico</option>
        </select>
      </article>

      {/* OS/Transporte - Siempre editable para cada producto */}
      <article className={cellStyles}>
        <input
          type="text"
          value={producto.os_transporte || ""}
          onChange={(e) =>
            handleProductoChange("os_transporte", e.target.value)
          }
          className={inputStyles}
          placeholder="OS/Transport"
        />
      </article>

      {/* Precio unitario - Siempre editable para cada producto */}
      <article className={cellStyles}>
        <input
          type="number"
          value={producto.precio_unitario || ""}
          onChange={(e) =>
            handleProductoChange("precio_unitario", e.target.value)
          }
          className={inputStyles}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </article>

      {/* Agregado extra - Siempre editable para cada producto */}
      <article className={cellStyles}>
        <input
          type="number"
          value={producto.agregado_extra || ""}
          onChange={(e) =>
            handleProductoChange("agregado_extra", e.target.value)
          }
          className={inputStyles}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </article>

      {/* Total a cobrar - Siempre editable para cada producto */}
      <article className={`${cellStyles} bg-yellow-50`}>
        <input
          type="number"
          value={producto.total_cobrar || ""}
          onChange={(e) => handleProductoChange("total_cobrar", e.target.value)}
          className={`${inputStyles} bg-yellow-50 font-semibold`}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </article>

      {/* Estado - Solo editable en el primer producto */}
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

      {/* Total cobrado - Solo editable en el primer producto */}
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

      {/* Aplicación anticipo - Solo editable en el primer producto */}
      <article className={cellStyles}>
        <input
          type="number"
          value={despachoData.aplicacion_anticipo}
          onChange={(e) =>
            handleDespachoChange("aplicacion_anticipo", e.target.value)
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
