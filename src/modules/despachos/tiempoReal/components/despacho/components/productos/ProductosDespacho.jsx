import { useState, useEffect, useCallback } from "react";
import useEncargadosStore from "../../../../../../../stores/encargados.store";
import axios from "axios";
import config from "../../../../../../../utils/getToken";
import EliminarDespacho from "../EliminarDespacho";
import useClientesStore from "../../../../../../../stores/clientes.store";
import { Autocomplete, AutocompleteItem, Checkbox } from "@nextui-org/react";
import { lineaProducto } from "../../../../../../../jsons/lineaProducto";
import { onInputPrice } from "../../../../../../../assets/onInputs";

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
  totalCobrar,
  clienteDespacho,
  existCobros,
}) {
  const { encargados } = useEncargadosStore();
  const { clientes } = useClientesStore();
  const [dataProducto, setDataProducto] = useState();
  const [optimisticStates, setOptimisticStates] = useState({}); // Estado para cambios optimistas
  const [pendingSaves, setPendingSaves] = useState(new Set()); // Campos con guardado pendiente

  useEffect(() => {
    setDataProducto(producto);
  }, [producto]);

  const inputStyles = `
    w-full h-8 px-2 text-[11px] border-0 bg-transparent text-gray-900  ${
      isFirstProduct ? "bg-green-50" : "bg-white"
    }
    focus:outline-none focus:bg-green-50 focus:ring-1 focus:ring-green-300
    placeholder-gray-400
  `;

  const readOnlyInputStyles = `
    w-full h-8 px-2 text-[11px] border-0  text-gray-600   ${
      isFirstProduct ? "bg-green-50" : "bg-white"
    }
    cursor-not-allowed
  `;

  const cellStyles = `w-[150px]  ${
    isFirstProduct ? "bg-green-50" : "bg-white"
  } border-r border-gray-200`;

  // Función optimizada para guardar cambios con objeto completo
  const saveProductChange = useCallback(
    debounce(async (productoId, updatedProducto) => {
      const fieldKey = `producto_${productoId}_complete`;

      try {
        setPendingSaves((prev) => new Set(prev).add(fieldKey));

        // Preparar el objeto completo del producto para enviar
        const productoCompleto = {
          cantidad: updatedProducto.cantidad,
          precio_unitario: updatedProducto.precio_unitario,
          agregado_extra: updatedProducto.agregado_extra,
          total_cobrar: updatedProducto.total_cobrar,
          linea: updatedProducto.linea,
          // Agregar otros campos del producto que necesites enviar
        };

        console.log("Enviando producto completo:", productoCompleto);

        const url = `${
          import.meta.env.VITE_URL_API
        }/producto-despacho/${productoId}`;
        await axios.patch(url, productoCompleto, config);

        // Limpiar estado optimista exitoso
        setOptimisticStates((prev) => {
          const newState = { ...prev };
          // Limpiar todos los estados optimistas relacionados con este producto
          Object.keys(newState).forEach((key) => {
            if (key.startsWith(`producto_${productoId}_`)) {
              delete newState[key];
            }
          });
          return newState;
        });
      } catch (err) {
        console.error("Error guardando producto:", err);

        // Revertir cambio optimista en caso de error
        setOptimisticStates((prev) => {
          const newState = { ...prev };
          // Limpiar estados optimistas del producto
          Object.keys(newState).forEach((key) => {
            if (key.startsWith(`producto_${productoId}_`)) {
              delete newState[key];
            }
          });
          return newState;
        });

        // Mostrar el valor original del servidor
        setDataProducto(producto); // Revertir al valor original completo

        // Opcional: mostrar notificación de error al usuario
        console.warn(`Error al guardar producto. Se revirtieron los cambios.`);
      } finally {
        setPendingSaves((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fieldKey);
          return newSet;
        });
      }
    }, 500),
    [producto]
  );

  const saveDespachoChange = useCallback(
    debounce(async (despachoId, field, value) => {
      const fieldKey = `despacho_${despachoId}_${field}`;

      try {
        setPendingSaves((prev) => new Set(prev).add(fieldKey));

        const url = `${import.meta.env.VITE_URL_API}/despacho/${despachoId}`;
        await axios.patch(url, { [field]: value }, config);

        // Limpiar estado optimista exitoso
        setOptimisticStates((prev) => {
          const newState = { ...prev };
          delete newState[fieldKey];
          return newState;
        });
      } catch (err) {
        console.error("Error guardando despacho:", err);

        // Revertir cambio optimista
        setOptimisticStates((prev) => {
          const newState = { ...prev };
          delete newState[fieldKey];
          return newState;
        });

        console.warn(`Error al guardar ${field}. Se revirtió el cambio.`);
      } finally {
        setPendingSaves((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fieldKey);
          return newSet;
        });
      }
    }, 1000),
    []
  );

  const handleDespachoChange = (field, value) => {
    if (isFirstProduct && onDespachoChange) {
      // 1. Actualización optimista inmediata en el padre
      onDespachoChange(field, value);

      // 2. Marcar como optimista
      const fieldKey = `despacho_${despacho.id}_${field}`;
      setOptimisticStates((prev) => ({
        ...prev,
        [fieldKey]: value,
      }));

      // 3. Guardar en backend con debounce
      if (despacho.id) {
        saveDespachoChange(despacho.id, field, value);
      }
    }
  };

  const handleProductoChange = (field, value) => {
    // 1. Actualización optimista inmediata
    const updatedProducto = {
      ...dataProducto,
      [field]: value,
    };

    // 2. Recalcular total si es necesario
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

    // 3. Actualizar estado local inmediatamente
    setDataProducto(updatedProducto);

    // 4. Marcar como optimista
    const fieldKey = `producto_${producto.id}_${field}`;
    setOptimisticStates((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));

    // 5. Notificar al componente padre
    if (onProductoChange) {
      onProductoChange(producto.id, field, value);
    }

    // 6. Guardar en el backend con debounce (AHORA ENVÍA EL OBJETO COMPLETO)
    if (producto.id) {
      saveProductChange(producto.id, updatedProducto);
    }
  };

  // Función helper para obtener el valor con estado optimista
  const getOptimisticValue = (type, id, field, defaultValue) => {
    const fieldKey = `${type}_${id}_${field}`;
    return optimisticStates[fieldKey] !== undefined
      ? optimisticStates[fieldKey]
      : defaultValue;
  };

  // Función helper para detectar si un campo tiene cambios pendientes
  const isPending = (type, id, field) => {
    const fieldKey = `${type}_${id}_${field}`;
    const completeKey = `${type}_${id}_complete`;
    return pendingSaves.has(fieldKey) || pendingSaves.has(completeKey);
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
    <>
      {isFirstProduct && (
        <div className="absolute -left-8 flex">
          <EliminarDespacho despachoId={despacho.id} />
        </div>
      )}

      {/* Vendedora */}
      <article className={cellStyles}>
        {isFirstProduct && (
          <select
            value={getOptimisticValue(
              "despacho",
              despacho.id,
              "vendedora_id",
              despachoData.vendedora_id || ""
            )}
            onChange={(e) =>
              handleDespachoChange("vendedora_id", e.target.value)
            }
            className={`${
              isFirstProduct ? inputStyles : readOnlyInputStyles
            } cursor-pointer ${
              isPending("despacho", despacho.id, "vendedora_id")
                ? "opacity-70"
                : ""
            }`}
            disabled={!isFirstProduct}
          >
            <option value="">Seleccionar</option>
            {encargados.map((encargado) => (
              <option value={encargado.id} key={encargado.id}>
                {encargado.nombre}
              </option>
            ))}
          </select>
        )}
      </article>

      {/* Cliente */}
      <article
        className={`w-[250px] flex ${
          isFirstProduct ? "bg-green-100" : "bg-white"
        } items-center justify-center text-center text-xs`}
      >
        {isFirstProduct && (
          <input
            type="text"
            value={getOptimisticValue(
              "despacho",
              despacho.id,
              "cliente",
              despachoData.cliente || ""
            )}
            className={readOnlyInputStyles}
            placeholder="Cliente"
            readOnly
          />
        )}
      </article>

      {/* DNI/RUC Cliente */}
      <article className="w-[200px] flex bg-white items-center justify-center text-center text-xs">
        {isFirstProduct && (
          <Autocomplete
            isDisabled={!isFirstProduct}
            aria-label="Seleccione un cliente"
            inputProps={{
              classNames: {
                input: "text-xs rounded-none",
                inputWrapper: `border-0 ${
                  isFirstProduct ? "bg-green-50" : "bg-white"
                } rounded-none ${
                  isPending("despacho", despacho.id, "documento_cliente")
                    ? "opacity-70"
                    : ""
                }`,
                label: "hidden",
              },
            }}
            defaultItems={clientes}
            onSelectionChange={(key) => {
              const cliente = clientes.find((c) => c.numeroDoc === key);

              if (!cliente) return; // Evitar errores si no existe

              const mismoCliente =
                String(cliente.id) === String(clienteDespacho);
              const totalCobrado = Number(despachoData.total_cobrado || 0);

              if (existCobros && !mismoCliente) {
                alert("Solo puedes cambiar de cliente si los cobros son 0.");
                return;
              }
              if (totalCobrado !== 0 && !mismoCliente) {
                alert(
                  "Solo puedes cambiar de cliente si el total cobrado son 0."
                );
                return;
              }
              handleDespachoChange("documento_cliente", cliente.numeroDoc);
            }}
            selectedKey={getOptimisticValue(
              "despacho",
              despacho.id,
              "documento_cliente",
              despachoData.documento_cliente
            )}
            size="sm"
            maxListboxHeight={200}
          >
            {(item) => (
              <AutocompleteItem
                key={item.numeroDoc}
                value={item.numeroDoc}
                textValue={item.numeroDoc}
              >
                {item.numeroDoc}
              </AutocompleteItem>
            )}
          </Autocomplete>
        )}
      </article>

      {/* Número de contacto */}
      <article className={cellStyles}>
        {isFirstProduct && (
          <input
            type="tel"
            maxLength={9}
            value={getOptimisticValue(
              "despacho",
              despacho.id,
              "numero_contacto",
              despachoData.numero_contacto || ""
            )}
            onChange={(e) =>
              handleDespachoChange("numero_contacto", e.target.value)
            }
            className={`${isFirstProduct ? inputStyles : readOnlyInputStyles} ${
              isPending("despacho", despacho.id, "numero_contacto")
                ? "opacity-70"
                : ""
            }`}
            placeholder="Teléfono"
            readOnly={!isFirstProduct}
          />
        )}
      </article>

      {/* Consignatario 1 - DNI */}
      <article className={cellStyles}>
        {isFirstProduct && (
          <input
            type="text"
            value={getOptimisticValue(
              "despacho",
              despacho.id,
              "consignatario1_documento",
              despachoData.consignatario1_documento || ""
            )}
            onChange={(e) =>
              handleDespachoChange("consignatario1_documento", e.target.value)
            }
            className={`${isFirstProduct ? inputStyles : readOnlyInputStyles} ${
              isPending("despacho", despacho.id, "consignatario1_documento")
                ? "opacity-70"
                : ""
            }`}
            placeholder="DNI/RUC"
            readOnly={!isFirstProduct}
          />
        )}
      </article>

      {/* Consignatario 1 - Nombre */}
      <article
        className={`w-[250px]  ${
          isFirstProduct ? "bg-green-50" : "bg-white"
        } border-r border-gray-200`}
      >
        {isFirstProduct && (
          <input
            type="text"
            value={getOptimisticValue(
              "despacho",
              despacho.id,
              "consignatario1_nombre",
              despachoData.consignatario1_nombre || ""
            )}
            onChange={(e) =>
              handleDespachoChange("consignatario1_nombre", e.target.value)
            }
            className={`${isFirstProduct ? inputStyles : readOnlyInputStyles} ${
              isPending("despacho", despacho.id, "consignatario2_documento")
                ? "opacity-70"
                : ""
            }`}
            placeholder="Nombre"
            readOnly={!isFirstProduct}
          />
        )}
      </article>

      {/* Consignatario 2 - DNI */}
      <article className={cellStyles}>
        {isFirstProduct && (
          <input
            type="text"
            value={getOptimisticValue(
              "despacho",
              despacho.id,
              "consignatario2_documento",
              despachoData.consignatario2_documento || ""
            )}
            onChange={(e) =>
              handleDespachoChange("consignatario2_documento", e.target.value)
            }
            className={`${isFirstProduct ? inputStyles : readOnlyInputStyles} ${
              isPending("despacho", despacho.id, "consignatario2_documento")
                ? "opacity-70"
                : ""
            }`}
            placeholder="DNI/RUC"
            readOnly={!isFirstProduct}
          />
        )}
      </article>

      {/* Consignatario 2 - Nombre */}
      <article
        className={`w-[250px]  ${
          isFirstProduct ? "bg-green-50" : "bg-white"
        } border-r border-gray-200`}
      >
        {isFirstProduct && (
          <input
            type="text"
            value={getOptimisticValue(
              "despacho",
              despacho.id,
              "consignatario2_nombre",
              despachoData.consignatario2_nombre || ""
            )}
            onChange={(e) =>
              handleDespachoChange("consignatario2_nombre", e.target.value)
            }
            className={`${isFirstProduct ? inputStyles : readOnlyInputStyles} ${
              isPending("despacho", despacho.id, "consignatario2_nombre")
                ? "opacity-70"
                : ""
            }`}
            placeholder="Nombre"
            readOnly={!isFirstProduct}
          />
        )}
      </article>

      {/* Cantidad */}
      <article className={cellStyles}>
        <input
          type="number"
          value={getOptimisticValue(
            "producto",
            producto.id,
            "cantidad",
            dataProducto?.cantidad || ""
          )}
          onChange={(e) => handleProductoChange("cantidad", e.target.value)}
          className={`${inputStyles} ${
            isPending("producto", producto.id, "cantidad") ? "opacity-70" : ""
          }`}
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
          value={getOptimisticValue(
            "producto",
            producto.id,
            "linea",
            dataProducto?.linea || ""
          )}
          onChange={(e) => handleProductoChange("linea", e.target.value)}
          className={`${inputStyles} cursor-pointer ${
            isPending("producto", producto.id, "linea") ? "opacity-70" : ""
          }`}
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
          value={getOptimisticValue(
            "despacho",
            despacho.id,
            "destino",
            despachoData?.destino || ""
          )}
          onChange={(e) => handleDespachoChange("destino", e.target.value)}
          className={`${isFirstProduct ? inputStyles : readOnlyInputStyles} ${
            isPending("despacho", despacho.id, "destino") ? "opacity-70" : ""
          }`}
          placeholder="Destino"
          readOnly={!isFirstProduct}
          disabled={!isFirstProduct}
        />
      </article>

      {/* Tipo de envío */}
      <article className={cellStyles}>
        <select
          value={getOptimisticValue(
            "despacho",
            despacho.id,
            "tipo_envio",
            despachoData?.tipo_envio || ""
          )}
          onChange={(e) => handleDespachoChange("tipo_envio", e.target.value)}
          className={`${isFirstProduct ? inputStyles : readOnlyInputStyles} ${
            isPending("despacho", despacho.id, "tipo_envio") ? "opacity-70" : ""
          }`}
          disabled={!isFirstProduct}
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
          value={getOptimisticValue(
            "despacho",
            despacho.id,
            "os_transporte",
            despachoData?.os_transporte || ""
          )}
          onChange={(e) =>
            handleDespachoChange("os_transporte", e.target.value)
          }
          className={`${isFirstProduct ? inputStyles : readOnlyInputStyles} ${
            isPending("despacho", despacho.id, "os_transporte")
              ? "opacity-70"
              : ""
          }`}
          placeholder="OS/Transport"
          readOnly={!isFirstProduct}
          disabled={!isFirstProduct}
        />
      </article>

      {/* Precio unitario */}
      <article className={cellStyles}>
        <input
          type="number"
          value={getOptimisticValue(
            "producto",
            producto.id,
            "precio_unitario",
            dataProducto?.precio_unitario || ""
          )}
          onChange={(e) =>
            handleProductoChange("precio_unitario", e.target.value)
          }
          className={`${inputStyles} ${
            isPending("producto", producto.id, "precio_unitario")
              ? "opacity-70"
              : ""
          }`}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </article>

      {/* Observación */}
      <article className={cellStyles}>
        <input
          type="text"
          value={getOptimisticValue(
            "despacho",
            despacho.id,
            "observacion",
            despachoData.observacion || ""
          )}
          onChange={(e) => handleDespachoChange("observacion", e.target.value)}
          className={`${isFirstProduct ? inputStyles : readOnlyInputStyles} ${
            isPending("despacho", despacho.id, "observacion")
              ? "opacity-70"
              : ""
          }`}
          placeholder="Observación"
          readOnly={!isFirstProduct}
        />
      </article>

      {/* Agregado extra */}
      <article
        className={`${cellStyles} flex gap-4 items-center justify-center`}
      >
        {isFirstProduct && (
          <>
            <Checkbox
              isSelected={getOptimisticValue(
                "despacho",
                despacho.id,
                "caja",
                despachoData.caja
              )}
              onChange={(e) => handleDespachoChange("caja", e.target.checked)}
              size="sm"
              color="success"
            >
              <p className="text-xs text-gray-600">Caja</p>
            </Checkbox>

            <Checkbox
              isSelected={getOptimisticValue(
                "despacho",
                despacho.id,
                "vacuna",
                despachoData.vacuna
              )}
              onChange={(e) => handleDespachoChange("vacuna", e.target.checked)}
              size="sm"
              color="success"
            >
              <p className="text-xs text-gray-600">Vacuna</p>
            </Checkbox>
          </>
        )}
      </article>

      {/* costo total */}
      <article className={`${cellStyles} bg-green-50`}>
        <input
          type="number"
          value={getOptimisticValue(
            "producto",
            producto.id,
            "total_cobrar",
            dataProducto?.total_cobrar || ""
          )}
          className={`${readOnlyInputStyles}`}
          placeholder="0.00"
          min="0"
          step="0.01"
          disabled={true}
        />
      </article>

      {/* Total a cobrar */}
      <article className={`${cellStyles} bg-green-50`}>
        {isFirstProduct && (
          <input
            type="number"
            className={`${readOnlyInputStyles} text-green-700 font-bold`}
            value={totalCobrar}
            placeholder="0.00"
            min="0"
            step="0.01"
            disabled={true}
          />
        )}
      </article>

      {/* Estado */}
      <article className={cellStyles}>
        {isFirstProduct && (
          <select
            value={getOptimisticValue(
              "despacho",
              despacho.id,
              "estado",
              despachoData.estado
            )}
            onChange={(e) => handleDespachoChange("estado", e.target.value)}
            className={`${
              isFirstProduct ? inputStyles : readOnlyInputStyles
            } cursor-pointer ${
              isPending("despacho", despacho.id, "estado") ? "opacity-70" : ""
            }`}
            disabled={!isFirstProduct}
          >
            <option value="">Estado</option>
            <option value="CANCELADO">CANCELADO</option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="ANTICIPO">ANTICIPO</option>
          </select>
        )}
      </article>

      {/* Total a cobrado */}
      <article className={`${cellStyles} bg-green-50`}>
        {isFirstProduct && (
          <input
            type="text"
            value={getOptimisticValue(
              "despacho",
              despacho.id,
              "total_cobrado",
              despachoData.total_cobrado || ""
            )}
            onChange={(e) => {
              const total = Number(e.target.value);
              const saldo = Number(clienteDespacho?.saldo || 0);

              if (isNaN(total)) return; // evitar NaN

              if (total > saldo) {
                alert("El total cobrado no debe ser mayor al saldo");
                return;
              }

              handleDespachoChange("total_cobrado", e.target.value);
            }}
            className={`   w-full h-8 px-2 text-[11px] border-0 bg-transparent  text-amber-600 font-semibold`}
            placeholder="0.00"
            onInput={onInputPrice}
            disabled={!isFirstProduct}
          />
        )}
      </article>

      {/* Aplicación anticipo */}
      <article className={cellStyles}>
        {isFirstProduct && (
          <input
            type="number"
            value={clienteDespacho?.saldo || 0}
            className={`   w-full h-8 px-2 text-[11px] border-0 bg-transparent  text-blue-600 font-semibold`}
            placeholder="0.00"
            min="0"
            step="0.01"
            disabled
          />
        )}
      </article>
    </>
  );
}
