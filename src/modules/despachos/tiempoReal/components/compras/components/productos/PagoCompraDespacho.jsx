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

const PagoCompraDespacho = ({
  pago,
  compra,
  isFirstProduct = false,
  handlePagosChange,
  proveedor,
}) => {
  const { cuentasBancarias } = useCuentasBancariasStore();
  const { metodosPagos } = useMetodosPagosStore();

  const [dataPago, setDataPago] = useState({});

  // Sincronizar prop "pago" con el estado local
  useEffect(() => {
    if (pago) {
      setDataPago(pago);
    }
  }, [pago]);

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
  const savePagoChange = useCallback(
    debounce(async (pagoId, updatedData) => {
      try {
        if (pagoId) {
          const url = `${
            import.meta.env.VITE_URL_API
          }/pago-compra-despacho/${pagoId}`;
          await axios.patch(
            url,
            { ...updatedData, proveedor_id: proveedor?.id || null },
            config
          );
        } else {
          const url = `${import.meta.env.VITE_URL_API}/pago-compra-despacho/${
            compra.id
          }`;
          await axios.post(
            url,
            { ...updatedData, proveedor_id: proveedor?.id || null },
            config
          );
        }
      } catch (err) {
        console.error("Error guardando pago:", err);
        // opcional: revertir cambios si quieres rollback
      }
    }, 800),
    [proveedor, compra?.id]
  );

  // Manejar cambios en inputs (optimistic update)
  const handlePagoChange = (field, value) => {
    const updatedPago = {
      ...dataPago,
      [field]: value,
    };

    // 1. Actualizar estado local inmediatamente
    setDataPago(updatedPago);

    // 2. Notificar al padre
    if (handlePagosChange) {
      handlePagosChange(pago?.id, field, value);
    }

    // 3. Guardar en backend en segundo plano
    savePagoChange(pago?.id, updatedPago);
  };

  return (
    <>
      <article className={cellStyles}>
        {isFirstProduct && (
          <select
            value={dataPago?.metodoPagoId || dataPago?.metodoPago?.id || ""}
            onChange={(e) => handlePagoChange("metodoPagoId", e.target.value)}
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
            value={dataPago?.bancoId || dataPago?.banco?.id || ""}
            onChange={(e) => handlePagoChange("bancoId", e.target.value)}
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
            value={dataPago?.fecha || ""}
            onChange={(e) => handlePagoChange("fecha", e.target.value)}
            className={isFirstProduct ? inputStyles : readOnlyInputStyles}
            readOnly={!isFirstProduct}
          />
        )}
      </article>

      <article className={cellStyles}>
        {isFirstProduct && (
          <input
            type="text"
            value={dataPago?.operacion || ""}
            onChange={(e) => handlePagoChange("operacion", e.target.value)}
            className={isFirstProduct ? inputStyles : readOnlyInputStyles}
            readOnly={!isFirstProduct}
          />
        )}
      </article>

      <article className={cellStyles}>
        {isFirstProduct && (
          <input
            type="text"
            value={dataPago?.monto || ""}
            onChange={(e) => handlePagoChange("monto", e.target.value)}
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

export default PagoCompraDespacho;
