import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import useEncargadosStore from "../../../../../../../stores/encargados.store";
import useClientesStore from "../../../../../../../stores/clientes.store";
import axios from "axios";
import config from "../../../../../../../utils/getToken";
import EliminarDespacho from "../EliminarDespacho";
import { Autocomplete, AutocompleteItem, Checkbox } from "@nextui-org/react";
import { lineaProducto } from "../../../../../../../jsons/lineaProducto";
import { onInputPrice } from "../../../../../../../assets/onInputs";
import { useForm } from "react-hook-form";
import { IoSearchOutline } from "react-icons/io5";
import { toast } from "sonner";

// ✅ Hook personalizado para debounce optimizado
function useDebounce(callback, delay) {
  const timerRef = useRef();

  return useCallback(
    (...args) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );
}

// ✅ Hook para manejo de estado optimista
function useOptimisticState() {
  const [optimisticStates, setOptimisticStates] = useState({});
  const [pendingSaves, setPendingSaves] = useState(new Set());

  const getOptimisticValue = useCallback(
    (type, id, field, defaultValue) => {
      const fieldKey = `${type}_${id}_${field}`;
      return optimisticStates[fieldKey] !== undefined
        ? optimisticStates[fieldKey]
        : defaultValue;
    },
    [optimisticStates]
  );

  const setOptimisticValue = useCallback((type, id, field, value) => {
    const fieldKey = `${type}_${id}_${field}`;
    setOptimisticStates((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  }, []);

  const clearOptimisticValue = useCallback((type, id, field) => {
    const fieldKey = `${type}_${id}_${field}`;
    setOptimisticStates((prev) => {
      const newState = { ...prev };
      if (field) {
        delete newState[fieldKey];
      } else {
        // Limpiar todos los campos de un producto/despacho específico
        Object.keys(newState).forEach((key) => {
          if (key.startsWith(`${type}_${id}_`)) {
            delete newState[key];
          }
        });
      }
      return newState;
    });
  }, []);

  const isPending = useCallback(
    (type, id, field) => {
      const fieldKey = `${type}_${id}_${field}`;
      const completeKey = `${type}_${id}_complete`;
      return pendingSaves.has(fieldKey) || pendingSaves.has(completeKey);
    },
    [pendingSaves]
  );

  const setPending = useCallback((fieldKey, pending) => {
    setPendingSaves((prev) => {
      const newSet = new Set(prev);
      if (pending) {
        newSet.add(fieldKey);
      } else {
        newSet.delete(fieldKey);
      }
      return newSet;
    });
  }, []);

  return {
    getOptimisticValue,
    setOptimisticValue,
    clearOptimisticValue,
    isPending,
    setPending,
  };
}

export default function ProductosDespacho({
  producto,
  despachoData,
  isFirstProduct = false,
  onDespachoChange,
  onProductoChange,
  despacho,
  clienteDespacho,
  existCobros,
}) {
  const { register, handleSubmit } = useForm();
  const { encargados } = useEncargadosStore();
  const { clientes } = useClientesStore();

  const [dataProducto, setDataProducto] = useState(producto);
  const {
    getOptimisticValue,
    setOptimisticValue,
    clearOptimisticValue,
    isPending,
    setPending,
  } = useOptimisticState();

  // ✅ Memoización de estilos
  const styles = useMemo(
    () => ({
      inputStyles: `w-full h-8 px-2 text-[11px] border-0 bg-transparent text-gray-900 ${
        isFirstProduct ? "bg-green-50" : "bg-white"
      } focus:outline-none focus:bg-green-50 focus:ring-1 focus:ring-green-300 placeholder-gray-400`,

      readOnlyInputStyles: `w-full h-8 px-2 text-[11px] border-0 text-gray-600 ${
        isFirstProduct ? "bg-green-50" : "bg-white"
      } cursor-not-allowed`,

      cellStyles: `w-[150px] ${
        isFirstProduct ? "bg-green-50" : "bg-white"
      } border-r border-gray-200`,
    }),
    [isFirstProduct]
  );

  // ✅ Sincronización optimizada del producto
  useEffect(() => {
    if (producto !== dataProducto) {
      setDataProducto(producto);
    }
  }, [producto]);

  // ✅ API calls optimizadas con manejo de errores mejorado
  const saveProductChange = useDebounce(async (productoId, updatedProducto) => {
    const fieldKey = `producto_${productoId}_complete`;

    try {
      setPending(fieldKey, true);

      const payload = {
        cantidad: updatedProducto.cantidad,
        precio_unitario: updatedProducto.precio_unitario,
        agregado_extra: updatedProducto.agregado_extra,
        total_cobrar: updatedProducto.total_cobrar,
        linea: updatedProducto.linea,
      };

      const url = `${
        import.meta.env.VITE_URL_API
      }/producto-despacho/${productoId}`;
      await axios.patch(url, payload, config);

      // ✅ Limpiar estados optimistas exitosos
      clearOptimisticValue("producto", productoId);
    } catch (err) {
      console.error("Error guardando producto:", err);

      // ✅ Revertir a valores originales
      clearOptimisticValue("producto", productoId);
      setDataProducto(producto);

      toast.error("Error al guardar producto. Se revirtieron los cambios.");
    } finally {
      setPending(fieldKey, false);
    }
  }, 500);

  const saveDespachoChange = useDebounce(async (despachoId, field, value) => {
    const fieldKey = `despacho_${despachoId}_${field}`;

    try {
      setPending(fieldKey, true);

      const url = `${import.meta.env.VITE_URL_API}/despacho/${despachoId}`;
      await axios.patch(url, { [field]: value }, config);

      clearOptimisticValue("despacho", despachoId, field);
    } catch (err) {
      console.error(`Error guardando ${field}:`, err);
      clearOptimisticValue("despacho", despachoId, field);
      toast.error(`Error al guardar ${field}. Se revirtió el cambio.`);
    } finally {
      setPending(fieldKey, false);
    }
  }, 1000);

  // ✅ Handlers optimizados
  const handleDespachoChange = useCallback(
    (field, value) => {
      if (!isFirstProduct || !onDespachoChange) return;

      // Actualización optimista inmediata
      onDespachoChange(field, value);
      setOptimisticValue("despacho", despacho.id, field, value);

      // Guardar en backend
      if (despacho.id) {
        saveDespachoChange(despacho.id, field, value);
      }
    },
    [
      isFirstProduct,
      onDespachoChange,
      despacho.id,
      setOptimisticValue,
      saveDespachoChange,
    ]
  );

  const handleProductoChange = useCallback(
    (field, value) => {
      // ✅ Calcular valores dependientes de manera optimizada
      const updatedProducto = { ...dataProducto, [field]: value };

      if (["precio_unitario", "cantidad", "agregado_extra"].includes(field)) {
        const cantidad =
          parseFloat(field === "cantidad" ? value : updatedProducto.cantidad) ||
          0;
        const precioUnitario =
          parseFloat(
            field === "precio_unitario"
              ? value
              : updatedProducto.precio_unitario
          ) || 0;
        const agregadoExtra =
          parseFloat(
            field === "agregado_extra" ? value : updatedProducto.agregado_extra
          ) || 0;

        updatedProducto.total_cobrar = (
          cantidad * precioUnitario +
          agregadoExtra
        ).toFixed(2);
      }

      // Actualizaciones inmediatas
      setDataProducto(updatedProducto);
      setOptimisticValue("producto", producto.id, field, value);

      // Notificar al padre
      onProductoChange?.(producto.id, field, value);

      // Guardar en backend
      if (producto.id) {
        saveProductChange(producto.id, updatedProducto);
      }
    },
    [
      dataProducto,
      producto.id,
      setOptimisticValue,
      onProductoChange,
      saveProductChange,
    ]
  );

  // ✅ Búsquedas de DNI optimizadas
  const searchDNI = useCallback(
    async (dni, field) => {
      try {
        const url = `${import.meta.env.VITE_URL_API}/apiPeru/dni?dni=${dni}`;
        const res = await axios.get(url);

        if (res.data?.data?.nombre_completo) {
          setTimeout(() => {
            handleDespachoChange(field, res.data.data.nombre_completo);
          }, 200);
        } else {
          toast.error(`No se encontró ningún registro con el DNI ${dni}`);
          setTimeout(() => {
            handleDespachoChange(field, "");
          }, 200);
        }
      } catch (err) {
        toast.error(`No se encontró ningún registro con el DNI ${dni}`);
        setTimeout(() => {
          handleDespachoChange(field, "");
        }, 200);
      }
    },
    [handleDespachoChange]
  );

  const submit = useCallback(
    (data) => {
      searchDNI(data.dni, "consignatario1_nombre");
    },
    [searchDNI]
  );

  const submit2 = useCallback(
    (data) => {
      searchDNI(data.dni2, "consignatario2_nombre");
    },
    [searchDNI]
  );

  // ✅ Auto-completado de cliente optimizado
  useEffect(() => {
    if (!despacho.documento_cliente) return;

    const timer = setTimeout(() => {
      const cliente = clientes.find(
        (c) => c.numeroDoc === despacho.documento_cliente
      );
      if (cliente) {
        handleDespachoChange(
          "cliente",
          cliente?.nombreApellidos || cliente?.nombreComercial
        );
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [despacho.documento_cliente, clientes, handleDespachoChange]);

  // ✅ Handler para cambio de cliente con validaciones
  const handleClienteChange = useCallback(
    (key) => {
      const cliente = clientes.find((c) => c.numeroDoc === key);
      if (!cliente) return;

      const mismoCliente = String(cliente.id) === String(clienteDespacho);
      const totalCobrado = Number(despachoData.total_cobrado || 0);

      if (existCobros && !mismoCliente) {
        alert("Solo puedes cambiar de cliente si los cobros son 0.");
        return;
      }
      if (totalCobrado !== 0 && !mismoCliente) {
        alert("Solo puedes cambiar de cliente si el total cobrado son 0.");
        return;
      }

      handleDespachoChange("documento_cliente", cliente.numeroDoc);
    },
    [
      clientes,
      clienteDespacho,
      despachoData.total_cobrado,
      existCobros,
      handleDespachoChange,
    ]
  );

  // ✅ Handler para total cobrado con validación
  const handleTotalCobradoChange = useCallback(
    (e) => {
      const total = Number(e.target.value);
      const saldo = Number(clienteDespacho?.saldo || 0);

      if (isNaN(total)) return;

      if (total > saldo) {
        alert("El total cobrado no debe ser mayor al saldo");
        return;
      }

      handleDespachoChange("total_cobrado", e.target.value);
    },
    [clienteDespacho?.saldo, handleDespachoChange]
  );

  return (
    <>
      {isFirstProduct && (
        <div className="absolute -left-8 flex">
          <EliminarDespacho despachoId={despacho.id} />
        </div>
      )}

      {/* Vendedora */}
      <article className={styles.cellStyles}>
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
            className={`${styles.inputStyles} cursor-pointer ${
              isPending("despacho", despacho.id, "vendedora_id")
                ? "opacity-70"
                : ""
            }`}
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
            className={styles.readOnlyInputStyles}
            placeholder="Cliente"
            readOnly
          />
        )}
      </article>

      {/* DNI Cliente */}
      <article className="w-[200px] flex bg-white items-center justify-center text-center text-xs">
        {isFirstProduct && (
          <Autocomplete
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
            onSelectionChange={handleClienteChange}
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
      <article className={styles.cellStyles}>
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
            className={`${styles.inputStyles} ${
              isPending("despacho", despacho.id, "numero_contacto")
                ? "opacity-70"
                : ""
            }`}
            placeholder="Teléfono"
          />
        )}
      </article>

      {/* Consignatario 1 - DNI */}
      <article className={styles.cellStyles}>
        {isFirstProduct && (
          <form className="flex" onSubmit={handleSubmit(submit)}>
            <input
              type="text"
              {...register("dni")}
              value={getOptimisticValue(
                "despacho",
                despacho.id,
                "consignatario1_documento",
                despachoData.consignatario1_documento || ""
              )}
              onChange={(e) =>
                handleDespachoChange("consignatario1_documento", e.target.value)
              }
              className={`${styles.inputStyles} ${
                isPending("despacho", despacho.id, "consignatario1_documento")
                  ? "opacity-70"
                  : ""
              }`}
              minLength={8}
              maxLength={8}
              placeholder="DNI"
            />
            <button className="px-1" type="submit">
              <IoSearchOutline />
            </button>
          </form>
        )}
      </article>

      {/* Consignatario 1 - Nombre */}
      <article
        className={`w-[250px] ${
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
            className={`${styles.inputStyles} ${
              isPending("despacho", despacho.id, "consignatario1_nombre")
                ? "opacity-70"
                : ""
            }`}
            placeholder="Nombre"
          />
        )}
      </article>

      {/* Consignatario 2 - DNI */}
      <article className={styles.cellStyles}>
        {isFirstProduct && (
          <form className="flex" onSubmit={handleSubmit(submit2)}>
            <input
              type="text"
              {...register("dni2")}
              value={getOptimisticValue(
                "despacho",
                despacho.id,
                "consignatario2_documento",
                despachoData.consignatario2_documento || ""
              )}
              onChange={(e) =>
                handleDespachoChange("consignatario2_documento", e.target.value)
              }
              className={`${styles.inputStyles} ${
                isPending("despacho", despacho.id, "consignatario2_documento")
                  ? "opacity-70"
                  : ""
              }`}
              minLength={8}
              maxLength={8}
              placeholder="DNI"
            />
            <button className="px-1" type="submit">
              <IoSearchOutline />
            </button>
          </form>
        )}
      </article>

      {/* Consignatario 2 - Nombre */}
      <article
        className={`w-[250px] ${
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
            className={`${styles.inputStyles} ${
              isPending("despacho", despacho.id, "consignatario2_nombre")
                ? "opacity-70"
                : ""
            }`}
            placeholder="Nombre"
          />
        )}
      </article>

      {/* Cantidad */}
      <article className={styles.cellStyles}>
        <input
          type="text"
          value={getOptimisticValue(
            "producto",
            producto.id,
            "cantidad",
            dataProducto?.cantidad || ""
          )}
          onChange={(e) => handleProductoChange("cantidad", e.target.value)}
          className={`${styles.inputStyles} ${
            isPending("producto", producto.id, "cantidad") ? "opacity-70" : ""
          }`}
          placeholder="0.00"
          onInput={onInputPrice}
        />
      </article>

      {/* Centro de costos */}
      <article className={styles.cellStyles}>
        <input
          type="text"
          value={dataProducto?.centro_costos || ""}
          className={styles.readOnlyInputStyles}
          readOnly
          placeholder="Centro"
        />
      </article>

      {/* Línea */}
      <article className={styles.cellStyles}>
        <select
          value={getOptimisticValue(
            "producto",
            producto.id,
            "linea",
            dataProducto?.linea || ""
          )}
          onChange={(e) => handleProductoChange("linea", e.target.value)}
          className={`${styles.inputStyles} cursor-pointer ${
            isPending("producto", producto.id, "linea") ? "opacity-70" : ""
          }`}
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
      <article className={styles.cellStyles}>
        {isFirstProduct && (
          <input
            type="text"
            value={getOptimisticValue(
              "despacho",
              despacho.id,
              "destino",
              despachoData?.destino || ""
            )}
            onChange={(e) => handleDespachoChange("destino", e.target.value)}
            className={`${styles.inputStyles} ${
              isPending("despacho", despacho.id, "destino") ? "opacity-70" : ""
            }`}
            placeholder="Destino"
          />
        )}
      </article>

      {/* Tipo de envío */}
      <article className={styles.cellStyles}>
        {isFirstProduct && (
          <select
            value={getOptimisticValue(
              "despacho",
              despacho.id,
              "tipo_envio",
              despachoData?.tipo_envio || ""
            )}
            onChange={(e) => handleDespachoChange("tipo_envio", e.target.value)}
            className={`${styles.inputStyles} ${
              isPending("despacho", despacho.id, "tipo_envio")
                ? "opacity-70"
                : ""
            }`}
          >
            <option value="">Seleccionar</option>
            <option value="ALMACEN">ALMACEN</option>
            <option value="TERRESTRE">TERRESTRE</option>
            <option value="AEREO">AEREO</option>
          </select>
        )}
      </article>

      {/* OS/Transporte */}
      <article className={styles.cellStyles}>
        {isFirstProduct && (
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
            className={`${styles.inputStyles} ${
              isPending("despacho", despacho.id, "os_transporte")
                ? "opacity-70"
                : ""
            }`}
            placeholder="OS/Transport"
          />
        )}
      </article>

      {/* Precio unitario */}
      <article className={styles.cellStyles}>
        <input
          type="text"
          value={getOptimisticValue(
            "producto",
            producto.id,
            "precio_unitario",
            dataProducto?.precio_unitario || ""
          )}
          onChange={(e) =>
            handleProductoChange("precio_unitario", e.target.value)
          }
          className={`${styles.inputStyles} ${
            isPending("producto", producto.id, "precio_unitario")
              ? "opacity-70"
              : ""
          }`}
          placeholder="0.00"
          onInput={onInputPrice}
        />
      </article>

      {/* Observación */}
      <article className={styles.cellStyles}>
        {isFirstProduct && (
          <input
            type="text"
            value={getOptimisticValue(
              "despacho",
              despacho.id,
              "observacion",
              despachoData.observacion || ""
            )}
            onChange={(e) =>
              handleDespachoChange("observacion", e.target.value)
            }
            className={`${styles.inputStyles} ${
              isPending("despacho", despacho.id, "observacion")
                ? "opacity-70"
                : ""
            }`}
            placeholder="Observación"
          />
        )}
      </article>

      {/* Vacuna */}
      <article
        className={`${styles.cellStyles} flex gap-4 items-center justify-center`}
      >
        {isFirstProduct && (
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
        )}
      </article>

      {/* Total a cobrar */}
      <article className={`${styles.cellStyles} bg-green-50`}>
        {isFirstProduct && (
          <input
            type="text"
            className={`${styles.readOnlyInputStyles} text-green-700 font-bold`}
            value={despachoData.total}
            placeholder="0.00"
            disabled
          />
        )}
      </article>

      {/* Estado */}
      <article className={styles.cellStyles}>
        {isFirstProduct && (
          <select
            value={getOptimisticValue(
              "despacho",
              despacho.id,
              "estado",
              despachoData.estado
            )}
            onChange={(e) => handleDespachoChange("estado", e.target.value)}
            className={`${styles.inputStyles} cursor-pointer ${
              isPending("despacho", despacho.id, "estado") ? "opacity-70" : ""
            }`}
          >
            <option value="">Estado</option>
            <option value="CANCELADO">CANCELADO</option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="ANTICIPO">ANTICIPO</option>
          </select>
        )}
      </article>

      {/* Total cobrado */}
      <article className={`${styles.cellStyles} bg-green-50`}>
        {isFirstProduct && (
          <input
            type="text"
            value={getOptimisticValue(
              "despacho",
              despacho.id,
              "total_cobrado",
              despachoData.total_cobrado || ""
            )}
            onChange={handleTotalCobradoChange}
            className="w-full h-8 px-2 text-[11px] border-0 bg-transparent text-amber-600 font-semibold"
            placeholder="0.00"
            onInput={onInputPrice}
          />
        )}
      </article>

      {/* Saldo cliente */}
      <article className={styles.cellStyles}>
        {isFirstProduct && (
          <input
            type="text"
            value={clienteDespacho?.saldo || 0}
            className="w-full h-8 px-2 text-[11px] border-0 bg-transparent text-blue-600 font-semibold"
            placeholder="0.00"
            disabled
          />
        )}
      </article>
    </>
  );
}
