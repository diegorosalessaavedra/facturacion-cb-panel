import React, { useMemo } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Chip,
} from "@nextui-org/react";
import { formatNumber } from "../../../../assets/formats";
import { Link } from "react-router-dom";
import formatDate from "../../../../hooks/FormatDate";
import { FaCheck } from "react-icons/fa";

const TablaOrdenCompras = ({
  ordenCompras,
  onOpen,
  setSelectModal,
  setSelectOrdenCompra,
  userData,
  filtros,
}) => {
  const ordenesFiltradas = useMemo(() => {
    if (!ordenCompras) return [];

    if (
      !filtros?.estado_saldo_proveedor ||
      filtros.estado_saldo_proveedor === "Todos"
    ) {
      return ordenCompras;
    }

    return ordenCompras.filter((orden) => {
      const saldoAcum = orden.proveedor?.saldo_acumulado || 0;

      switch (filtros.estado_saldo_proveedor) {
        case "DEBE":
          return saldoAcum > 0;
        case "A FAVOR":
          return saldoAcum < 0;
        case "SALDO CERO":
          return saldoAcum === 0;
        default:
          return true;
      }
    });
  }, [ordenCompras, filtros?.estado_saldo_proveedor]);

  // --- DEFINICIÓN DE PERMISOS ---
  const role = userData?.role;
  const isAdminContador = [
    "GERENTE",
    "CONTADOR",
    "PRACTICANTE CONTABLE",
  ].includes(role);
  const isCompradorVendedor = role === "COMPRADOR/VENDEDOR";
  const canEditOrAnular = isAdminContador || isCompradorVendedor;
  const isGerente = role === "GERENTE";

  return (
    <div className="w-full flex">
      <Table
        aria-label="Tabla de órdenes de compra"
        color="default"
        isStriped
        classNames={{
          base: "w-full h-[70vh] overflow-auto p-4",
          wrapper: "p-0",
          th: "bg-slate-900 text-white text-xs text-center",
          td: "text-xs",
        }}
        radius="sm"
        isCompact={true}
        isHeaderSticky
      >
        <TableHeader>
          <TableColumn>#</TableColumn>
          <TableColumn>
            Fecha <br /> Emisión
          </TableColumn>
          <TableColumn>Proveedor</TableColumn>
          <TableColumn>Tipos de Productos</TableColumn>
          <TableColumn>Forma de Pago</TableColumn>
          <TableColumn>Moneda</TableColumn>
          <TableColumn>Total FAC</TableColumn>
          <TableColumn>Saldo Dsct o Detrac</TableColumn>
          <TableColumn>
            Estado de <br /> Pago
          </TableColumn>
          <TableColumn>Banco</TableColumn>
          <TableColumn>Nro cuenta</TableColumn>
          <TableColumn>
            Saldo <br /> Acumulado
          </TableColumn>
          <TableColumn>
            Estado <br /> Saldo Acumulado
          </TableColumn>
          <TableColumn>Estado SOLPED</TableColumn>
          <TableColumn className="text-center">PDF</TableColumn>
          <TableColumn className="text-center">Acciones</TableColumn>
          <TableColumn className="text-center">Validacion</TableColumn>
          <TableColumn className="text-center">
            Enviar a Pago <br /> Masivo
          </TableColumn>
        </TableHeader>

        {/* Mapeamos 'ordenesFiltradas' en lugar de 'ordenCompras' */}
        <TableBody emptyContent={"No hay datos que coincidan con los filtros"}>
          {ordenesFiltradas.map((ordenCompra, index) => {
            const saldoAcum = ordenCompra.proveedor?.saldo_acumulado || 0;
            const tieneComprobante =
              ordenCompra.comprobanteOrdenCompraId !== null;

            return (
              <TableRow key={ordenCompra.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="min-w-[90px]">
                  {formatDate(ordenCompra.fechaEmision)}
                </TableCell>
                <TableCell className="min-w-[200px]">
                  {ordenCompra.proveedor.nombreApellidos ||
                    ordenCompra.proveedor.nombreComercial}
                </TableCell>
                <TableCell>{ordenCompra.tipo_productos}</TableCell>
                <TableCell>{ordenCompra.formaPago}</TableCell>
                <TableCell>{ordenCompra.moneda}</TableCell>

                <TableCell className="min-w-[110px] font-semibold">
                  S/. {formatNumber(ordenCompra.saldoInicial)}
                </TableCell>
                <TableCell className="min-w-[110px] font-semibold text-blue-600">
                  S/. {formatNumber(ordenCompra.saldo)}
                </TableCell>

                {/* Estado de Pago */}
                <TableCell className="text-center">
                  <Chip
                    size="sm"
                    variant="flat"
                    className="font-bold text-[10px]"
                    color={
                      ordenCompra.estadoPago === "ENVIADO A PAGO"
                        ? "warning"
                        : ordenCompra.estadoPago === "PENDIENTE" ||
                            ordenCompra.estadoPago === "ANULADO"
                          ? "danger"
                          : "primary"
                    }
                  >
                    {ordenCompra.estadoPago}
                  </Chip>
                </TableCell>

                <TableCell>{ordenCompra.banco_beneficiario || "-"}</TableCell>
                <TableCell>{ordenCompra.nro_cuenta_bco || "-"}</TableCell>

                <TableCell className="min-w-[110px] text-center font-semibold">
                  S/. {formatNumber(saldoAcum)}
                </TableCell>

                {/* Estado Saldo Acumulado */}
                <TableCell className="text-center">
                  <Chip
                    size="sm"
                    variant="dot"
                    className="font-bold border-none text-[10px]"
                    color={
                      saldoAcum < 0
                        ? "success"
                        : saldoAcum > 0
                          ? "danger"
                          : "default"
                    }
                  >
                    {saldoAcum < 0
                      ? "A FAVOR"
                      : saldoAcum > 0
                        ? "DEBE"
                        : "SALDO CERO"}
                  </Chip>
                </TableCell>

                {/* Estado SOLPED */}
                <TableCell className="text-center">
                  <Chip
                    size="sm"
                    variant="flat"
                    color={
                      ordenCompra.status === "Activo" ? "success" : "danger"
                    }
                  >
                    {ordenCompra.status}
                  </Chip>
                </TableCell>

                {/* PDF */}
                <TableCell>
                  <div className="flex gap-2 justify-center">
                    <Button
                      className={`scale-85 text-white ${
                        ordenCompra.prioridad_solped === "Alta"
                          ? "bg-red-500"
                          : ordenCompra.prioridad_solped === "Mediana"
                            ? "bg-amber-500"
                            : "bg-green-500"
                      }`}
                      size="sm"
                      onPress={() => {
                        setSelectOrdenCompra(ordenCompra);
                        setSelectModal("pdf");
                        onOpen();
                      }}
                    >
                      SOLPED
                    </Button>

                    {ordenCompra.solped_adjunto && (
                      <a
                        href={`${import.meta.env.VITE_LARAVEL_URL}/solped/${ordenCompra.solped_adjunto}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button
                          className="scale-85 shadow-sm"
                          size="sm"
                          color="danger"
                        >
                          Ver COMP. P
                        </Button>
                      </a>
                    )}
                  </div>
                </TableCell>

                {/* Acciones */}
                <TableCell>
                  <div className="flex flex-col items-center gap-1">
                    {!tieneComprobante
                      ? isAdminContador && (
                          <Link
                            to={`/compras/comprobante-orden-compra/${ordenCompra.id}`}
                          >
                            <Button
                              className="scale-85"
                              size="sm"
                              color="primary"
                            >
                              Generar Comprobante
                            </Button>
                          </Link>
                        )
                      : isAdminContador && (
                          <div className="flex">
                            <Button
                              className="scale-85 text-white"
                              size="sm"
                              color="success"
                              onPress={() => {
                                setSelectOrdenCompra(ordenCompra);
                                setSelectModal("verComprobante");
                                onOpen();
                              }}
                            >
                              Ver Comprobante
                            </Button>
                            <Button
                              className="scale-85 text-white"
                              size="sm"
                              color="warning"
                              onPress={() => {
                                setSelectOrdenCompra(ordenCompra);
                                setSelectModal("editarComprobante");
                                onOpen();
                              }}
                            >
                              Editar C.
                            </Button>
                          </div>
                        )}

                    {canEditOrAnular && (
                      <div className="flex">
                        <Link
                          to={`/compras/editar/orden-compra/${ordenCompra.id}`}
                        >
                          <Button
                            className="scale-85"
                            size="sm"
                            color="primary"
                          >
                            Editar
                          </Button>
                        </Link>

                        {tieneComprobante &&
                          ordenCompra.comprobante?.status === "Activo" && (
                            <Button
                              className="scale-85 text-white"
                              size="sm"
                              color="warning"
                              onPress={() => {
                                setSelectOrdenCompra(ordenCompra.comprobante);
                                setSelectModal("anular");
                                onOpen();
                              }}
                            >
                              Anular Comprobante
                            </Button>
                          )}

                        {ordenCompra.status === "Activo" && (
                          <Button
                            className="scale-85"
                            size="sm"
                            color="danger"
                            onPress={() => {
                              setSelectOrdenCompra(ordenCompra);
                              setSelectModal("anular_solped");
                              onOpen();
                            }}
                          >
                            Anular SOLPED
                          </Button>
                        )}
                      </div>
                    )}

                    {canEditOrAnular && (
                      <Button
                        className="scale-85 text-white"
                        size="sm"
                        color="danger"
                        onPress={() => {
                          setSelectOrdenCompra(ordenCompra);
                          setSelectModal("adjuntar_solped");
                          onOpen();
                        }}
                      >
                        Comprobante de Pago
                      </Button>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  {role !== "VENDEDOR" && (
                    <div
                      className={`m-auto w-5 h-5 border-2 p-0.5 flex items-center justify-center ${
                        ordenCompra.validacion_ingrid
                          ? "border-green-500 bg-green-50"
                          : "border-neutral-300"
                      } rounded-md`}
                    >
                      {ordenCompra.validacion_ingrid ? (
                        <FaCheck className="text-green-500 text-[10px]" />
                      ) : (
                        ""
                      )}
                    </div>
                  )}
                </TableCell>

                <TableCell className="text-center">
                  {isGerente && (
                    <button
                      className={`m-auto w-5 h-5 border-2 p-0.5 flex items-center justify-center ${
                        ordenCompra.validacion
                          ? "border-blue-500 bg-blue-50"
                          : "border-neutral-300"
                      } rounded-md`}
                      onClick={() => {
                        setSelectModal("cambiar_validacion");
                        setSelectOrdenCompra(ordenCompra);
                        onOpen();
                      }}
                    >
                      {ordenCompra.validacion ? (
                        <FaCheck className="text-blue-500 text-[10px]" />
                      ) : (
                        ""
                      )}
                    </button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TablaOrdenCompras;
