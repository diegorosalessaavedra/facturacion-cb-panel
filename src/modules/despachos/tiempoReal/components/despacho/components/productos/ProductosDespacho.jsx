import { useState, useEffect, useCallback } from "react";
import useEncargadosStore from "../../../../../../../stores/encargados.store";
import axios from "axios";
import config from "../../../../../../../utils/getToken";
import EliminarDespacho from "../EliminarDespacho";
import useClientesStore from "../../../../../../../stores/clientes.store";
import { Autocomplete, AutocompleteItem, Checkbox } from "@nextui-org/react";
import { lineaProducto } from "../../../../../../../jsons/lineaProducto";

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
  const { clientes } = useClientesStore();

  const [dataProducto, setDataProducto] = useState();

  useEffect(() => {
    setDataProducto(producto);
  }, [producto]);

  const inputStyles = `
    w-full h-8 px-2 text-[11px] border-0 bg-transparent text-gray-900  ${
      isFirstProduct ? "bg-amber-50" : "bg-white"
    }
    focus:outline-none focus:bg-green-50 focus:ring-1 focus:ring-green-300
    placeholder-gray-400
  `;

  const readOnlyInputStyles = `
    w-full h-8 px-2 text-[11px] border-0  text-gray-600   ${
      isFirstProduct ? "bg-amber-50" : "bg-white"
    }
    cursor-not-allowed
  `;

  const cellStyles = `w-[150px]  ${
    isFirstProduct ? "bg-amber-50" : "bg-white"
  } border-r border-gray-200`;

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

  useEffect(() => {
    setTimeout(() => {
      const cliente = clientes.find(
        (c) => c.numeroDoc === despacho.documento_cliente
      );

      handleDespachoChange(
        "cliente",
        cliente?.nombreApellidos || cliente?.nombreComercial
      );
    }, 200);
  }, [despacho.documento_cliente]);

  return (
    <section
      className={`grid grid-cols-[repeat(21,1fr)] border-t-1 gap-[1px] bg-gray-100 hover:bg-gray-100 transition-colors relative`}
    >
      {isFirstProduct && (
        <div className="absolute -left-8 flex">
          <EliminarDespacho despachoId={despacho.id} />
        </div>
      )}
      {/* {!isFirstProduct && (
        <div className="absolute -left-7">
          <EliminarProductoDespacho productoId={producto.id} />
        </div>
      )} */}

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
      <article
        className={`w-[250px] flex ${
          isFirstProduct ? "bg-green-100" : "bg-white"
        } items-center justify-center text-center text-xs`}
      >
        <input
          type="text"
          value={despachoData.cliente || ""}
          className={readOnlyInputStyles}
          placeholder="Cliente"
          readOnly
        />
      </article>

      {/* DNI/RUC Cliente */}
      <article className="w-[200px] flex bg-white items-center justify-center text-center text-xs">
        <Autocomplete
          isDisabled={!isFirstProduct}
          inputProps={{
            classNames: {
              input: "text-xs rounded-none",
              inputWrapper: `  border-0  ${
                isFirstProduct ? "bg-amber-50" : "bg-white"
              } rounded-none `,
              label: "hidden",
            },
          }}
          defaultItems={clientes}
          onSelectionChange={(key) => {
            // Aquí key será el numeroDoc porque lo ponemos en key
            const cliente = clientes.find((c) => c.numeroDoc === key);

            if (cliente) {
              handleDespachoChange("documento_cliente", cliente.numeroDoc);
            }
          }}
          selectedKey={despachoData.documento_cliente}
          size="sm"
          aria-labelledby=""
          maxListboxHeight={200}
        >
          {(item) => (
            <AutocompleteItem
              key={item.numeroDoc} // 👈 clave es numeroDoc, no id
              value={item.numeroDoc} // 👈 value también numeroDoc
              textValue={item.numeroDoc}
            >
              {item.numeroDoc}
            </AutocompleteItem>
          )}
        </Autocomplete>
      </article>

      {/* Número de contacto */}
      <article className={cellStyles}>
        <input
          type="tel"
          value={despachoData.numero_contacto || ""}
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
          value={despachoData.consignatario1_documento || ""}
          onChange={(e) =>
            handleDespachoChange("consignatario1_documento", e.target.value)
          }
          className={isFirstProduct ? inputStyles : readOnlyInputStyles}
          placeholder="DNI/RUC"
          readOnly={!isFirstProduct}
        />
      </article>

      {/* Consignatario 1 - Nombre */}
      <article className="w-[250px] flex bg-white items-center justify-center text-center text-xs">
        <input
          type="text"
          value={despachoData.consignatario1_nombre || ""}
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
          value={despachoData.consignatario2_documento || ""}
          onChange={(e) =>
            handleDespachoChange("consignatario2_documento", e.target.value)
          }
          className={isFirstProduct ? inputStyles : readOnlyInputStyles}
          placeholder="DNI/RUC"
          readOnly={!isFirstProduct}
        />
      </article>

      {/* Consignatario 2 - Nombre */}
      <article className="w-[250px] flex bg-white items-center justify-center text-center text-xs">
        <input
          type="text"
          value={despachoData.consignatario2_nombre || ""}
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
          className={readOnlyInputStyles}
          readOnly={true}
          placeholder="Centro"
        />
      </article>

      {/* Línea */}
      <article className={cellStyles}>
        <select
          value={dataProducto?.linea || ""}
          onChange={(e) => handleProductoChange("linea", e.target.value)}
          className={`${inputStyles} cursor-pointer`}
          disabled={!isFirstProduct}
        >
          <option value="">Seleccionar</option>
          {lineaProducto.map((linea) => (
            <option key={linea.id} value={linea.id}>
              {linea.descripcion}
            </option>
          ))}
        </select>
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
      <article
        className={`${cellStyles} flex gap-4 items-center justify-center`}
      >
        {isFirstProduct && (
          <>
            <Checkbox
              isSelected={despachoData.caja}
              onChange={(e) => handleDespachoChange("caja", e.target.checked)}
              size="sm"
              color="success"
            >
              <p className="text-xs text-gray-600">Caja</p>
            </Checkbox>

            <Checkbox
              isSelected={despachoData.vacuna}
              onChange={(e) => handleDespachoChange("vacuna", e.target.checked)}
              size="sm"
              color="success"
            >
              {" "}
              <p className="text-xs text-gray-600">Vacuna</p>
            </Checkbox>
          </>
        )}
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
          value={despachoData.anticipo_aplicado || ""}
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
