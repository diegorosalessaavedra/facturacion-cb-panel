import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";
import config from "../../../../../../../utils/getToken";
import useCuentasBancariasStore from "../../../../../../../stores/cuentasBancarias.store";
import useMetodosPagosStore from "../../../../../../../stores/metodosPagos.store";
import { onInputPrice } from "../../../../../../../assets/onInputs";

// --- Utilidad debounce ---
function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

const CobroDespacho = ({
  isFirstProduct = false,
  cobro,
  handleCobrosChange,
  despacho,
  cliente,
}) => {
  const { cuentasBancarias } = useCuentasBancariasStore();
  const { metodosPagos } = useMetodosPagosStore();

  const [dataCobro, setDataCobro] = useState({});

  // Sincronizar prop "cobro" con el estado local
  useEffect(() => {
    if (cobro) {
      setDataCobro(cobro);
    }
  }, [cobro]);

  const inputStyles = `
    w-full h-8 px-2 text-[11px] border-0 bg-transparent text-gray-900  
    ${isFirstProduct ? "bg-green-50" : "bg-white"}
    focus:outline-none focus:bg-green-50 focus:ring-1 focus:ring-green-300
    placeholder-gray-400
  `;

  const readOnlyInputStyles = `
    w-full h-8 px-2 text-[11px] border-0 text-gray-600   
    ${isFirstProduct ? "bg-green-50" : "bg-white"}
    cursor-not-allowed
  `;

  const cellStyles = `w-[150px] ${
    isFirstProduct ? "bg-green-50" : "bg-white"
  } border-r border-gray-200`;

  // Guardar cambios en backend con debounce (optimistic update)
  const saveCobroChange = useCallback(
    debounce(async (cobroId, updatedData) => {
      try {
        if (cobroId) {
          const url = `${
            import.meta.env.VITE_URL_API
          }/cobro-despacho/${cobroId}`;
          await axios.patch(
            url,
            { ...updatedData, cliente_id: cliente?.id || null },
            config
          );
        } else {
          const url = `${import.meta.env.VITE_URL_API}/cobro-despacho/${
            despacho.id
          }`;
          await axios.post(
            url,
            { ...updatedData, cliente_id: cliente?.id || null },
            config
          );
        }
      } catch (err) {
        console.error("Error guardando cobro:", err);
        // opcional: revertir cambios si quieres rollback
      }
    }, 800),
    [cliente, despacho?.id]
  );

  // Manejar cambios en inputs (optimistic update)
  const handleCobroChange = (field, value) => {
    const updatedCobro = {
      ...dataCobro,
      [field]: value,
    };

    // 1. Actualizar estado local inmediatamente
    setDataCobro(updatedCobro);

    // 2. Notificar al padre
    if (handleCobrosChange) {
      handleCobrosChange(cobro?.id, field, value);
    }

    // 3. Guardar en backend en segundo plano
    saveCobroChange(cobro?.id, updatedCobro);
  };

  return (
    <>
      <article className={cellStyles}>
        {isFirstProduct && (
          <select
            value={dataCobro?.metodoPagoId || dataCobro?.metodoPago?.id || ""}
            onChange={(e) => handleCobroChange("metodoPagoId", e.target.value)}
            className={`${
              isFirstProduct ? inputStyles : readOnlyInputStyles
            } cursor-pointer`}
            disabled={!isFirstProduct}
          >
            <option value="">Seleccionar</option>
            {metodosPagos.map((metodoPago) => (
              <option value={metodoPago.id} key={metodoPago.id}>
                {metodoPago.descripcion}
              </option>
            ))}
          </select>
        )}
      </article>

      <article className={cellStyles}>
        {isFirstProduct && (
          <select
            value={dataCobro?.bancoId || dataCobro?.banco?.id || ""}
            onChange={(e) => handleCobroChange("bancoId", e.target.value)}
            className={`${
              isFirstProduct ? inputStyles : readOnlyInputStyles
            } cursor-pointer`}
            disabled={!isFirstProduct}
          >
            <option value="">Seleccionar</option>
            {cuentasBancarias.map((cuentaBancaria) => (
              <option value={cuentaBancaria.id} key={cuentaBancaria.id}>
                {cuentaBancaria.descripcion} nro: {cuentaBancaria.numero}
              </option>
            ))}
          </select>
        )}
      </article>

      <article className={cellStyles}>
        {isFirstProduct && (
          <input
            type="date"
            value={dataCobro?.fecha || ""}
            onChange={(e) => handleCobroChange("fecha", e.target.value)}
            className={isFirstProduct ? inputStyles : readOnlyInputStyles}
            readOnly={!isFirstProduct}
          />
        )}
      </article>

      <article className={cellStyles}>
        {isFirstProduct && (
          <input
            type="text"
            value={dataCobro?.operacion || ""}
            onChange={(e) => handleCobroChange("operacion", e.target.value)}
            className={isFirstProduct ? inputStyles : readOnlyInputStyles}
            readOnly={!isFirstProduct}
          />
        )}
      </article>

      <article className={cellStyles}>
        {isFirstProduct && (
          <input
            type="text"
            value={dataCobro?.monto || ""}
            onChange={(e) => handleCobroChange("monto", e.target.value)}
            className={isFirstProduct ? inputStyles : readOnlyInputStyles}
            placeholder="0.00"
            onInput={onInputPrice}
            readOnly={!isFirstProduct}
          />
        )}
      </article>
    </>
  );
};

export default CobroDespacho;
