import React, { useEffect, useState, useMemo } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import axios from "axios";
import { handleAxiosError } from "../../../../utils/handleAxiosError";
import { API } from "../../../../utils/api";
import config from "../../../../utils/getToken";
import { numberPeru } from "../../../../assets/onInputs";
import { formatWithLeadingZeros } from "../../../../assets/formats";
import formatDate from "../../../../hooks/FormatDate";
import { descargarExcelProveedor } from "../../../../utils/plantillasExel/exportExcelProveedor";

const EEccProveedores = ({ isOpen, onOpenChange, selectProveedor }) => {
  const [loading, setLoading] = useState(true);
  const [dataProveedor, setDataProveedor] = useState(null);

  useEffect(() => {
    if (!selectProveedor?.id) return;

    let isMounted = true;
    setLoading(true);

    const url = `${API}/proveedores/${selectProveedor.id}`;

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
  }, [selectProveedor?.id]);

  // =========================================================================
  // LÓGICA CORREGIDA: Suma por producto y resta por pago, fila por fila
  // =========================================================================
  const { rows, totalSaldo } = useMemo(() => {
    if (!dataProveedor?.ordenesCompra) return { rows: [], totalSaldo: 0 };

    let saldoGlobal = 0;
    const allRows = [];

    // Opcional: Ordenamos por fecha de emisión para que el libro mayor tenga sentido cronológico
    const ordenesOrdenadas = [...dataProveedor.ordenesCompra].sort(
      (a, b) => new Date(a.fechaEmision) - new Date(b.fechaEmision),
    );

    ordenesOrdenadas.forEach((orden) => {
      const productos = orden.productos || [];
      const pagos = orden.pagos || [];

      const maxRows = Math.max(1, productos.length, pagos.length);

      for (let i = 0; i < maxRows; i++) {
        const prod = productos[i];
        const pago = pagos[i];
        const isFirstRow = i === 0;

        // 1. Si hay un producto en esta fila, SUMAMOS su total específico
        if (prod) {
          saldoGlobal += parseFloat(prod.total || 0);
        }
        // 2. Si hay un pago en esta fila, RESTAMOS su monto
        if (pago) {
          saldoGlobal -= parseFloat(pago.monto || 0);
        }

        allRows.push({
          orden,
          prod,
          pago,
          isFirstRow,
          maxRows,
          saldoActual: saldoGlobal,
          indexInOrder: i,
        });
      }
    });

    return { rows: allRows, totalSaldo: saldoGlobal };
  }, [dataProveedor?.ordenesCompra]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-w-[1400px] w-full max-h-[90vh]",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-xl font-bold text-slate-900 border-b border-slate-200">
              Estado de Cuenta:{" "}
              <span className="text-slate-700 tracking-tight">
                {selectProveedor?.nombreComercial ||
                  selectProveedor?.nombreApellidos}
              </span>
            </ModalHeader>

            <ModalBody className="p-4 bg-slate-50/80">
              {loading ? (
                <div className="w-full h-64 flex flex-col items-center justify-center gap-4">
                  <Spinner size="lg" color="primary" />
                  <p className="text-sm text-slate-600 font-medium animate-pulse">
                    Cargando información del proveedor...
                  </p>
                </div>
              ) : (
                <div className="w-full overflow-x-auto overflow-y-auto bg-white border border-slate-300 rounded-lg shadow-sm max-h-[65vh]">
                  <table className="w-full text-left border-collapse text-[11px] md:text-xs whitespace-nowrap">
                    <thead className="sticky top-0 z-20 shadow-sm">
                      <tr>
                        <th
                          colSpan="7"
                          className="bg-blue-700 text-white font-bold text-center py-2 px-3 tracking-wider border-r border-blue-800"
                        >
                          DETALLE DE ENVÍO
                        </th>
                        <th
                          colSpan="3"
                          className="bg-amber-500 text-white font-bold text-center py-2 px-3 tracking-wider border-r border-amber-600"
                        >
                          DETRACCIONES
                        </th>
                        <th
                          colSpan="5"
                          className="bg-green-600 text-white font-bold text-center py-2 px-3 tracking-wider"
                        >
                          DETALLE DE PAGO
                        </th>
                      </tr>
                      <tr>
                        {[
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
                            className="bg-blue-100 text-slate-900 font-bold text-center py-2 px-3 border-b border-r border-slate-300"
                          >
                            {title}
                          </th>
                        ))}
                        {["Cód Dr", "Fecha Dr", "12%"].map((title, i) => (
                          <th
                            key={`detrac-${i}`}
                            className="bg-amber-50 text-amber-900 font-bold text-center py-2 px-3 border-b border-r border-slate-300"
                          >
                            {title}
                          </th>
                        ))}
                        {[
                          "Fecha Pago",
                          "Monto",
                          "Saldo",
                          "Operación",
                          "Banco",
                        ].map((title, i) => (
                          <th
                            key={`pago-${i}`}
                            className="bg-green-50 text-slate-800 font-bold text-center py-2 px-3 border-b border-r last:border-r-0 border-slate-300"
                          >
                            {title}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200">
                      {rows.length > 0 ? (
                        rows.map((row) => {
                          const {
                            orden,
                            prod,
                            pago,
                            isFirstRow,
                            maxRows,
                            saldoActual,
                            indexInOrder,
                          } = row;

                          const bancoNombre =
                            pago?.banco?.banco ||
                            pago?.banco?.descripcion ||
                            pago?.banco ||
                            (isFirstRow ? orden.banco_beneficiario : "-");

                          return (
                            <tr
                              key={`${orden.id}-${indexInOrder}`}
                              className="hover:bg-blue-50/40 transition-colors"
                            >
                              {/* --- DATOS GENERALES DE LA ORDEN --- */}
                              {isFirstRow ? (
                                <>
                                  <td
                                    rowSpan={maxRows}
                                    className="py-2 px-3 text-center align-top font-medium text-slate-700 border-r border-slate-200 bg-white"
                                  >
                                    {formatDate(orden.fechaEmision) || "-"}
                                  </td>
                                  <td
                                    rowSpan={maxRows}
                                    className="py-2 px-3 text-center align-top font-bold text-slate-900 border-r border-slate-200 bg-white"
                                  >
                                    {`COD-000${formatWithLeadingZeros(orden?.id, 3)}`}
                                  </td>
                                  <td
                                    rowSpan={maxRows}
                                    className="py-2 px-3 text-center align-top italic text-slate-600 border-r border-slate-200 bg-white"
                                  >
                                    {orden.comprobante?.serie || "-"}
                                  </td>
                                </>
                              ) : null}

                              {/* --- DATOS DEL PRODUCTO INDIVIDUAL --- */}
                              <td
                                className="py-2 px-3 text-left text-slate-800 max-w-[150px] truncate border-r border-slate-200"
                                title={
                                  prod
                                    ? prod.producto?.nombre ||
                                      prod.descripcion_producto
                                    : ""
                                }
                              >
                                {prod
                                  ? prod.producto?.nombre ||
                                    prod.descripcion_producto
                                  : "-"}
                              </td>
                              <td className="py-2 px-3 text-center text-slate-700 border-r border-slate-200">
                                {prod ? numberPeru(prod.cantidad) : "-"}
                              </td>
                              <td className="py-2 px-3 text-right font-medium text-slate-700 border-r border-slate-200">
                                {prod
                                  ? `S/ ${numberPeru(prod.precioUnitario)}`
                                  : "-"}
                              </td>
                              <td className="py-2 px-3 text-right font-bold text-slate-900 border-r border-slate-300">
                                {prod ? `S/ ${numberPeru(prod.total)}` : "-"}
                              </td>

                              {/* --- DETRACCIONES --- */}
                              <td className="py-2 px-3 text-center text-slate-400 border-r border-slate-200">
                                -
                              </td>
                              <td className="py-2 px-3 text-center text-slate-400 border-r border-slate-200">
                                -
                              </td>
                              <td className="py-2 px-3 text-right font-medium text-slate-400 border-r border-slate-300">
                                S/ 0.00
                              </td>

                              {/* --- DATOS DEL PAGO INDIVIDUAL --- */}
                              <td className="py-2 px-3 text-center text-slate-700 border-r border-slate-200">
                                {pago ? pago.createdAt?.split("T")[0] : "-"}
                              </td>
                              <td className="py-2 px-3 text-right font-bold text-slate-900 bg-slate-100/50 border-r border-slate-200">
                                {pago ? `S/ ${numberPeru(pago.monto)}` : "-"}
                              </td>

                              {/* --- SALDO GLOBAL ACUMULADO (AQUÍ ESTÁ LA MAGIA) --- */}
                              <td className="py-2 px-3 text-right font-bold text-red-600 bg-red-50/40 border-r border-slate-300">
                                S/ {numberPeru(saldoActual)}
                              </td>

                              {/* --- MÁS DATOS DEL PAGO --- */}
                              <td className="py-2 px-3 text-center text-slate-700 border-r border-slate-200">
                                {pago ? pago.operacion : "-"}
                              </td>
                              <td className="py-2 px-3 text-center text-slate-700">
                                {bancoNombre}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan="15"
                            className="py-12 text-center text-slate-500 font-medium"
                          >
                            No hay órdenes de compra registradas para este
                            proveedor.
                          </td>
                        </tr>
                      )}
                    </tbody>

                    {/* ================= FOOTER (TOTALES) ================= */}
                    {rows.length > 0 && (
                      <tfoot className="sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <tr className="bg-slate-900 border-t-2 border-slate-700 text-sm text-white">
                          <td
                            colSpan="11"
                            className="py-3 px-3 border-r border-slate-500 bg-white"
                          ></td>
                          <td className="py-3 px-3 text-right font-bold uppercase tracking-wide border-r border-slate-500">
                            TOTALES
                          </td>
                          <td className="py-3 px-3 text-right font-black border-r border-slate-500 text-[13px]">
                            S/ {numberPeru(totalSaldo)}
                          </td>
                          <td
                            colSpan="2"
                            className={`    ${
                              totalSaldo > 0
                                ? "bg-red-500"
                                : totalSaldo === 0
                                  ? "bg-green-500"
                                  : "bg-amber-500"
                            } py-3 px-3 text-center font-bold uppercase tracking-widest`}
                          >
                            {totalSaldo > 0
                              ? "Debe"
                              : totalSaldo === 0
                                ? "Cancelado"
                                : "A favor"}
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              )}
            </ModalBody>

            <ModalFooter className="border-t border-slate-200 bg-slate-50">
              <Button
                color="success"
                variant="flat"
                onPress={() =>
                  descargarExcelProveedor(
                    rows,
                    totalSaldo,
                    selectProveedor?.nombreComercial ||
                      selectProveedor?.nombreApellidos,
                  )
                }
                isDisabled={rows.length === 0}
                className="font-medium text-green-700 bg-green-100 hover:bg-green-200"
              >
                Descargar en Excel
              </Button>
              <Button
                color="danger"
                variant="flat"
                onPress={onClose}
                className="font-medium"
              >
                Cerrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EEccProveedores;
