import React, { useEffect, useState, useMemo } from "react";
import { Spinner, Button } from "@nextui-org/react";
import axios from "axios";
import { API } from "../../../../utils/api";
import { handleAxiosError } from "../../../../utils/handleAxiosError";
import config from "../../../../utils/getToken";
import { formatWithLeadingZeros } from "../../../../assets/formats";
import formatDate from "../../../../hooks/FormatDate";
import { numberPeru } from "../../../../assets/onInputs";
import { descargarExcelProveedor } from "../../../../utils/plantillasExel/exportExcelProveedor";
import { SaveIcon } from "lucide-react";

const TablaEECCProvedores = ({
  selectProveedor,
  selectGastos,
  selectComercial,
}) => {
  const [dataProveedor, setDataProveedor] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- ESTADO PARA DETRACCIONES ---
  const [formDetracciones, setFormDetracciones] = useState({});

  // 1. Efecto para obtener datos del proveedor
  useEffect(() => {
    if (!selectProveedor) return;

    let isMounted = true;
    setLoading(true);

    const url = `${API}/proveedores/${selectProveedor}?${selectGastos && `gastos=${selectGastos}&${selectComercial && `comercial=${selectComercial}`}`}`;

    axios
      .get(url, config)
      .then((res) => {
        if (isMounted) setDataProveedor(res.data.proveedor);
      })
      .catch((err) => handleAxiosError(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectProveedor, selectGastos, selectComercial]);

  // 2. Efecto para inicializar el estado de los inputs de detracción
  useEffect(() => {
    if (dataProveedor?.ordenesCompra) {
      const initialData = {};
      dataProveedor.ordenesCompra.forEach((orden) => {
        const det = Array.isArray(orden.detraccion)
          ? orden.detraccion[0]
          : orden.detraccion;

        const fechaFormateada = det?.fecha_detraccion
          ? det.fecha_detraccion.split("T")[0]
          : "";

        initialData[orden.id] = {
          id: det?.id || 0,
          codigo_detraccion: det?.codigo_detraccion || "",
          fecha_detraccion: fechaFormateada,
          porcentaje_detraccion: det?.porcentaje_detraccion || "",
          monto_detraccion: det?.monto_detraccion || "",
          serie_correlativo: det?.serie_correlativo || "",
          isModified: false,
          isSaving: false,
        };
      });
      setFormDetracciones(initialData);
    }
  }, [dataProveedor]);

  // 3. Lógica para calcular filas y saldos
  const { rows, totalSaldo } = useMemo(() => {
    if (!dataProveedor?.ordenesCompra) return { rows: [], totalSaldo: 0 };

    let acumuladorFooter = 0;

    const allRows = dataProveedor.ordenesCompra
      .slice()
      .sort((a, b) => new Date(a.fechaEmision) - new Date(b.fechaEmision))
      .flatMap((orden) => {
        const productos = orden.productos || [];
        const pagos = orden.pagos || [];
        const maxRows = Math.max(1, productos.length, pagos.length);

        const montoDetraccion =
          parseFloat(formDetracciones[orden.id]?.monto_detraccion) || 0;

        return Array.from({ length: maxRows }, (_, i) => {
          const prod = productos[i];
          const pagoReal = pagos[i];

          const pago =
            pagoReal ||
            (prod ? { monto: 0, operacion: "-", ficticio: true } : undefined);

          // CORRECCIÓN: Saldo independiente por fila, no acumulado por orden
          let saldoFila = 0;

          if (prod) saldoFila += parseFloat(prod.total || 0);
          if (pago) saldoFila -= parseFloat(pago.monto || 0);
          if (i === 0) saldoFila -= montoDetraccion;

          // El acumulador general sí debe sumar todo
          if (prod) acumuladorFooter += parseFloat(prod.total || 0);
          if (pago) acumuladorFooter -= parseFloat(pago.monto || 0);
          if (i === 0) acumuladorFooter -= montoDetraccion;

          return {
            orden,
            prod,
            pago,
            pagoReal,
            isFirstRow: i === 0,
            maxRows,
            saldoActual: saldoFila, // Usamos el saldo calculado solo para esta fila
            key: `${orden.id}-${i}`,
          };
        });
      });

    return { rows: allRows, totalSaldo: acumuladorFooter };
  }, [dataProveedor, formDetracciones]);

  // --- MANEJADORES DE DETRACCIÓN ---
  const handleInputDetraccion = (ordenId, field, value) => {
    setFormDetracciones((prev) => {
      const currentForm = prev[ordenId] || {};
      let newMonto = currentForm.monto_detraccion;

      if (field === "porcentaje_detraccion") {
        const ordenOriginal = dataProveedor.ordenesCompra.find(
          (o) => o.id === ordenId,
        );
        const totalOrden =
          ordenOriginal?.productos?.reduce(
            (sum, p) => sum + parseFloat(p.total || 0),
            0,
          ) || 0;

        const porcentajeParsed = parseFloat(value);
        if (!isNaN(porcentajeParsed) && porcentajeParsed >= 0) {
          newMonto = Math.round(totalOrden * (porcentajeParsed / 100));
        } else {
          newMonto = "";
        }
      }

      return {
        ...prev,
        [ordenId]: {
          ...currentForm,
          [field]: value,
          ...(field === "porcentaje_detraccion"
            ? { monto_detraccion: newMonto }
            : {}),
          isModified: true,
        },
      };
    });
  };

  const saveDetraccion = async (ordenId) => {
    setFormDetracciones((prev) => ({
      ...prev,
      [ordenId]: { ...prev[ordenId], isSaving: true },
    }));

    try {
      const currentForm = formDetracciones[ordenId];
      const detraccionId = currentForm.id || 0;

      const payload = {
        proveedor_id: selectProveedor,
        orden_compra_id: ordenId,
        codigo_detraccion: currentForm.codigo_detraccion,
        fecha_detraccion: currentForm.fecha_detraccion,
        porcentaje_detraccion: currentForm.porcentaje_detraccion,
        monto_detraccion: currentForm.monto_detraccion,
        serie_correlativo: currentForm.serie_correlativo,
      };

      const response = await axios.post(
        `${API}/proveedores/detraccion/${detraccionId}`,
        payload,
        config,
      );

      const updatedDetraccionId = response.data?.data?.id || detraccionId;

      setFormDetracciones((prev) => ({
        ...prev,
        [ordenId]: {
          ...prev[ordenId],
          id: updatedDetraccionId,
          isSaving: false,
          isModified: false,
        },
      }));
    } catch (error) {
      handleAxiosError(error);
      setFormDetracciones((prev) => ({
        ...prev,
        [ordenId]: { ...prev[ordenId], isSaving: false },
      }));
    }
  };

  const renderStatusBadge = (saldo) => {
    const configBadge = {
      debe: { color: "bg-red-500", text: "Debe" },
      cancelado: { color: "bg-green-500", text: "Cancelado" },
      favor: { color: "bg-amber-500", text: "A favor" },
    };
    const status =
      saldo > 0
        ? configBadge.debe
        : saldo === 0
          ? configBadge.cancelado
          : configBadge.favor;
    return (
      <td
        colSpan="2"
        className={`${status.color} py-3 px-2 text-center font-bold text-white uppercase tracking-widest`}
      >
        {status.text}
      </td>
    );
  };

  const tieneDetraccion = Boolean(dataProveedor?.detraccion_activo);
  const colSpanPrevioTotales = tieneDetraccion ? 13 : 8;
  const totalColSpanVacio = tieneDetraccion ? 17 : 13;

  return (
    <div className="flex flex-col min-h-[90vh] max-h-[90vh] w-full max-w-[1800px] mx-auto bg-slate-50 shadow-xl rounded-lg overflow-hidden border border-slate-200">
      <header className="p-4 py-3 border-b border-slate-200 bg-slate-900 shrink-0">
        <h2 className="text-sm font-bold text-slate-50">
          Proveedor:{" "}
          <span className="font-normal text-slate-100">
            {dataProveedor?.nombreComercial ||
              dataProveedor?.nombreApellidos ||
              "Sin Nombre"}
          </span>
        </h2>
      </header>
      <section className="relative flex-1 min-h-0 flex flex-col p-2 bg-slate-50">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Spinner size="lg" />
            <p className="text-slate-500 animate-pulse">
              Procesando historial...
            </p>
          </div>
        ) : (
          <div className="flex-1 w-full overflow-auto bg-white border border-slate-300 rounded-lg shadow-sm relative">
            <table className="w-full text-left border-collapse text-[11px] whitespace-nowrap">
              <thead className="sticky top-0 z-20 shadow-sm">
                <tr>
                  <th
                    colSpan="8"
                    className="bg-blue-700 text-white font-bold text-center py-3 px-2 tracking-wider border-r border-blue-800"
                  >
                    DETALLE DE ENVÍO
                  </th>
                  {tieneDetraccion && (
                    <th
                      colSpan="4"
                      className="bg-amber-500 text-white font-bold text-center py-3 px-2 tracking-wider border-r border-amber-600"
                    >
                      DETRACCIONES
                    </th>
                  )}
                  <th
                    colSpan="5"
                    className="bg-green-600 text-white font-bold text-center py-3 px-2 tracking-wider"
                  >
                    DETALLE DE PAGO
                  </th>
                </tr>
                <tr>
                  {[
                    "-",
                    "Fecha",
                    "SOLPED",
                    "Serie Correlativo",
                    "Descripción",
                    "Cant.",
                    "P.U",
                    "Total",
                  ].map((title, i) => (
                    <th
                      key={`envio-${i}`}
                      className=" bg-blue-100 text-slate-900 font-bold text-center py-2 px-2 border-b border-r border-slate-300"
                    >
                      {title}
                    </th>
                  ))}

                  {tieneDetraccion &&
                    ["Cód Dr", "Fecha Dr", "Porcentaje Dr", "Monto Dr"].map(
                      (title, i) => (
                        <th
                          key={`detrac-${i}`}
                          className="bg-amber-50 text-amber-900 font-bold text-center py-2 px-2 border-b border-r border-slate-300"
                        >
                          {title}
                        </th>
                      ),
                    )}

                  {["Fecha Pago", "Monto", "Saldo", "Operación", "Banco"].map(
                    (title, i) => (
                      <th
                        key={`pago-${i}`}
                        className="bg-green-50 text-slate-800 font-bold text-center py-2 px-2 border-b border-r last:border-r-0 border-slate-300"
                      >
                        {title}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {rows.length > 0 ? (
                  rows.map((row) => {
                    const {
                      orden,
                      prod,
                      pago,
                      pagoReal,
                      isFirstRow,
                      maxRows,
                      saldoActual,
                      key,
                    } = row;

                    const bancoNombre =
                      pagoReal?.banco?.banco ||
                      pagoReal?.banco?.descripcion ||
                      pagoReal?.banco ||
                      "-";

                    return (
                      <tr
                        key={key}
                        className="hover:bg-blue-50/40 transition-colors"
                      >
                        {isFirstRow ? (
                          <>
                            <td
                              rowSpan={maxRows}
                              className=" py-2  text-center align-middle border-r border-slate-200 bg-slate-50 min-w-[50px]"
                            >
                              {formDetracciones[orden.id]?.isModified ? (
                                <Button
                                  size="sm"
                                  color="warning"
                                  variant="solid"
                                  className="h-7 text-[10px] min-w-fit font-bold shadow-sm"
                                  isLoading={
                                    formDetracciones[orden.id]?.isSaving
                                  }
                                  onClick={() => saveDetraccion(orden.id)}
                                >
                                  <SaveIcon size={18} />
                                </Button>
                              ) : null}
                            </td>

                            <td
                              rowSpan={maxRows}
                              className="py-2 px-2 text-center align-middle font-medium text-slate-700 border-r border-slate-200 bg-white"
                            >
                              {formatDate(orden.fechaEmision) || "-"}
                            </td>
                            <td
                              rowSpan={maxRows}
                              className="py-2 px-2 text-center align-middle font-bold text-slate-900 border-r border-slate-200 bg-white"
                            >
                              {`COD-000${formatWithLeadingZeros(orden?.id, 3)}`}
                            </td>
                            <td
                              rowSpan={maxRows}
                              className="max-w-20 p-2 text-center border-r border-slate-200 bg-amber-50/20 align-middle"
                            >
                              <input
                                type="text"
                                className="w-20 border border-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
                                value={
                                  formDetracciones[orden.id]
                                    ?.serie_correlativo || ""
                                }
                                placeholder="serie-001"
                                onChange={(e) =>
                                  handleInputDetraccion(
                                    orden.id,
                                    "serie_correlativo",
                                    e.target.value,
                                  )
                                }
                              />
                            </td>
                          </>
                        ) : null}

                        <td
                          className="py-2 px-2 text-left text-slate-800 min-w-[150px] truncate border-r border-slate-200 bg-white"
                          title={
                            (prod?.descripcion_producto &&
                              prod?.descripcion_producto !== "null" &&
                              prod.descripcion_producto) ||
                            prod?.producto?.nombre ||
                            "-"
                          }
                        >
                          {(prod?.descripcion_producto &&
                            prod?.descripcion_producto !== "null" &&
                            prod.descripcion_producto) ||
                            prod?.producto?.nombre ||
                            "-"}
                        </td>
                        <td className="py-2 px-2 text-center text-slate-700 border-r border-slate-200 bg-white">
                          {prod ? Number(prod.cantidad).toFixed(0) : "-"}
                        </td>
                        <td className="py-2 px-2 text-center font-medium text-slate-700 border-r border-slate-200 bg-white">
                          {prod ? `S/ ${numberPeru(prod.precioUnitario)}` : "-"}
                        </td>
                        <td className="py-2 px-2 text-center font-bold text-slate-900 border-r border-slate-300 bg-white">
                          {prod ? `S/ ${numberPeru(prod.total)}` : "-"}
                        </td>

                        {tieneDetraccion ? (
                          isFirstRow ? (
                            <>
                              <td
                                rowSpan={maxRows}
                                className="p-2 text-center border-r border-slate-200 bg-amber-50/20 align-middle"
                              >
                                <input
                                  className="w-[60px] border border-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
                                  placeholder="Ej: 020"
                                  value={
                                    formDetracciones[orden.id]
                                      ?.codigo_detraccion || ""
                                  }
                                  onChange={(e) =>
                                    handleInputDetraccion(
                                      orden.id,
                                      "codigo_detraccion",
                                      e.target.value,
                                    )
                                  }
                                />
                              </td>
                              <td
                                rowSpan={maxRows}
                                className="p-2 text-center border-r border-slate-200 bg-amber-50/20 align-middle"
                              >
                                <input
                                  type="date"
                                  className="w-[110px] border border-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
                                  value={
                                    formDetracciones[orden.id]
                                      ?.fecha_detraccion || ""
                                  }
                                  onChange={(e) =>
                                    handleInputDetraccion(
                                      orden.id,
                                      "fecha_detraccion",
                                      e.target.value,
                                    )
                                  }
                                />
                              </td>
                              <td
                                rowSpan={maxRows}
                                className="p-2 text-center border-r border-slate-200 bg-amber-50/20 align-middle"
                              >
                                <div className="flex items-center gap-1 justify-center">
                                  <input
                                    className="w-12 border border-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-center bg-white"
                                    placeholder="0"
                                    value={
                                      formDetracciones[orden.id]
                                        ?.porcentaje_detraccion || ""
                                    }
                                    onChange={(e) =>
                                      handleInputDetraccion(
                                        orden.id,
                                        "porcentaje_detraccion",
                                        e.target.value,
                                      )
                                    }
                                  />
                                  <span className="text-slate-500 font-bold">
                                    %
                                  </span>
                                </div>
                              </td>
                              <td
                                rowSpan={maxRows}
                                className="p-2 text-center border-r border-slate-300 bg-amber-50/40 align-middle relative"
                              >
                                <div className="flex flex-col gap-2 items-end ">
                                  <input
                                    readOnly
                                    className="w-[100px] border border-slate-200 rounded px-2 py-1.5 text-xs outline-none text-center font-bold bg-slate-100 text-slate-600 cursor-not-allowed"
                                    placeholder="S/ 0"
                                    value={
                                      formDetracciones[orden.id]
                                        ?.monto_detraccion || ""
                                    }
                                  />
                                </div>
                              </td>
                            </>
                          ) : null
                        ) : null}

                        <td className="py-2 px-2 text-center text-slate-700 border-r border-slate-200 bg-white">
                          {pagoReal ? formatDate(pagoReal.fecha) : "-"}
                        </td>
                        <td className="py-2 px-2 text-center font-bold text-slate-900 bg-slate-100/50 border-r border-slate-200">
                          {pago ? `S/ ${numberPeru(pago.monto)}` : "-"}
                        </td>
                        <td className="py-2 px-2 text-center font-bold text-red-600 bg-red-50/40 border-r border-slate-300">
                          S/ {numberPeru(saldoActual)}
                        </td>
                        <td className="py-2 px-2 text-center text-slate-700 bg-white border-r border-slate-200">
                          {pago ? pago.operacion : "-"}
                        </td>
                        <td className="py-2 px-2 text-center text-slate-700 bg-white">
                          {bancoNombre}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={totalColSpanVacio}
                      className="py-12 text-center text-slate-500 font-medium bg-white"
                    >
                      No hay órdenes de compra registradas para este proveedor.
                    </td>
                  </tr>
                )}
              </tbody>

              {rows.length > 0 && (
                <tfoot className="sticky bottom-0 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                  <tr className="bg-slate-900 border-t-2 border-slate-700 text-xs text-white">
                    <td
                      colSpan={colSpanPrevioTotales}
                      className="py-3 px-2 border-r border-slate-500 bg-white"
                    ></td>
                    <td className="py-3 px-2 text-center font-bold uppercase tracking-wide border-r border-slate-500">
                      TOTALES
                    </td>
                    <td className="py-3 px-2 text-center font-black border-r border-slate-500 text-[13px]">
                      S/ {numberPeru(totalSaldo)}
                    </td>
                    {renderStatusBadge(totalSaldo)}
                  </tr>
                </tfoot>
              )}
            </table>
            <footer className=" w-full p-4 flex justify-end gap-2 shrink-0">
              <Button
                color="success"
                variant="flat"
                isDisabled={rows.length === 0}
                onClick={() => {
                  descargarExcelProveedor(
                    rows,
                    totalSaldo,
                    dataProveedor?.nombreComercial ||
                      dataProveedor?.nombreApellidos ||
                      "Sin_Nombre",
                    formDetracciones,
                    tieneDetraccion,
                  );
                }}
              >
                Exportar Excel
              </Button>
            </footer>
          </div>
        )}
      </section>
    </div>
  );
};

export default TablaEECCProvedores;
