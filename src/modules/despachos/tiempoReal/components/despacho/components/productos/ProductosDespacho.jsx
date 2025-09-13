import NuevoProductoDespacho from "./NuevoProductoDespacho";
import EliminarProductoDespacho from "./EliminarProductoDespacho";
import useEncargadosStore from "../../../../../../../stores/encargados.store";

export default function ProductosDespacho({
  producto,
  despachoData,
  isFirstProduct = false,
  onDespachoChange,
  onProductoChange,
  despacho,
  setFocusInput,
}) {
  const { encargados } = useEncargadosStore();

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
          <NuevoProductoDespacho depachoId={despacho.id} />
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
          onFocus={() => setFocusInput("vendedora_id")}
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
          className={isFirstProduct ? inputStyles : readOnlyInputStyles}
          placeholder="Cliente"
          onFocus={() => setFocusInput("cliente")}
          readOnly={!isFirstProduct}
        />
      </article>

      {/* DNI/RUC Cliente */}
      <article className={cellStyles}>
        <input
          type="text"
          value={despachoData.documento_cliente}
          onChange={(e) =>
            handleDespachoChange("documento_cliente", e.target.value)
          }
          className={isFirstProduct ? inputStyles : readOnlyInputStyles}
          placeholder="DNI/RUC"
          onFocus={() => setFocusInput("documento_cliente")}
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
          onFocus={() => setFocusInput("numero_contacto")}
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
          onFocus={() => setFocusInput("observacion")}
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
          onFocus={() => setFocusInput("consignatario1_documento")}
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
          onFocus={() => setFocusInput("consignatario1_nombre")}
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
          onFocus={() => setFocusInput("consignatario2_documento")}
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
          onFocus={() => setFocusInput("consignatario2_nombre")}
          readOnly={!isFirstProduct}
        />
      </article>

      {/* Cantidad */}
      <article className={cellStyles}>
        <input
          type="number"
          value={producto.cantidad || ""}
          onChange={(e) => handleProductoChange("cantidad", e.target.value)}
          className={inputStyles}
          placeholder="0"
          min="0"
          step="1"
          onFocus={() => setFocusInput("cantidad")}
        />
      </article>

      {/* Centro de costos */}
      <article className={cellStyles}>
        <input
          type="text"
          value={producto.centro_costos || ""}
          onChange={(e) =>
            handleProductoChange("centro_costos", e.target.value)
          }
          className={inputStyles}
          placeholder="Centro"
          onFocus={() => setFocusInput("centro_costos")}
        />
      </article>

      {/* Línea */}
      <article className={cellStyles}>
        <input
          type="text"
          value={producto.linea || ""}
          onChange={(e) => handleProductoChange("linea", e.target.value)}
          className={inputStyles}
          placeholder="Línea"
          onFocus={() => setFocusInput("linea")}
        />
      </article>

      {/* Destino */}
      <article className={cellStyles}>
        <input
          type="text"
          value={producto.destino || ""}
          onChange={(e) => handleProductoChange("destino", e.target.value)}
          className={inputStyles}
          placeholder="Destino"
          onFocus={() => setFocusInput("destino")}
        />
      </article>

      {/* Tipo de envío */}
      <article className={cellStyles}>
        <select
          value={producto.tipo_envio || ""}
          onChange={(e) => handleProductoChange("tipo_envio", e.target.value)}
          onFocus={() => setFocusInput("tipo_envio")}
          className={`${inputStyles} cursor-pointer`}
        >
          <option value="">Seleccionar</option>
          <option value="express">Express</option>
          <option value="normal">Normal</option>
          <option value="economico">Económico</option>
        </select>
      </article>

      {/* OS/Transporte */}
      <article className={cellStyles}>
        <input
          type="text"
          value={producto.os_transporte || ""}
          onChange={(e) =>
            handleProductoChange("os_transporte", e.target.value)
          }
          className={inputStyles}
          placeholder="OS/Transport"
          onFocus={() => setFocusInput("os_transporte")}
        />
      </article>

      {/* Precio unitario */}
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
          onFocus={() => setFocusInput("precio_unitario")}
        />
      </article>

      {/* Agregado extra */}
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
          onFocus={() => setFocusInput("agregado_extra")}
        />
      </article>

      {/* Total a cobrar */}
      <article className={`${cellStyles} bg-yellow-50`}>
        <input
          type="number"
          value={producto.total_cobrar || ""}
          onChange={(e) => handleProductoChange("total_cobrar", e.target.value)}
          className={`${inputStyles} bg-yellow-50 font-semibold`}
          placeholder="0.00"
          min="0"
          step="0.01"
          onFocus={() => setFocusInput("total_cobrar")}
        />
      </article>

      {/* Estado */}
      <article className={cellStyles}>
        <select
          value={despachoData.estado}
          onChange={(e) => handleDespachoChange("estado", e.target.value)}
          onFocus={() => setFocusInput("estado")}
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
          onFocus={() => setFocusInput("total_cobrado")}
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
          onFocus={() => setFocusInput("anticipo_aplicado")}
          readOnly={!isFirstProduct}
        />
      </article>
    </section>
  );
}
