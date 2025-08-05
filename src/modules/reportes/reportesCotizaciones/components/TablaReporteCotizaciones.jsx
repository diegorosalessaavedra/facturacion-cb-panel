import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React from "react";
import { formatNumber } from "../../../../assets/formats";
import formatDate from "../../../../hooks/FormatDate";

const TablaReporteCotizaciones = ({ cotizaciones, loading }) => {
  return (
    <div className="w-full flex items-center">
      {loading ? (
        <Spinner className="m-auto" label="Cargando..." color="success" />
      ) : (
        <div className="w-full ">
          <Table
            aria-label="Tabla de itinerarios"
            color="default"
            isStriped
            classNames={{
              base: "min-w-full  max-h-[80vh] overflow-scroll  p-4 ",
              wrapper: "p-0",
            }}
            radius="sm"
            isCompact={true}
            isHeaderSticky
          >
            <TableHeader>
              <TableColumn className="text-xs text-white  bg-blue-700">
                #
              </TableColumn>

              <TableColumn className="text-xs text-white  bg-blue-700">
                Fecha <br />
                Emisión
              </TableColumn>
              <TableColumn className="text-xs text-white  bg-blue-700">
                Cliente
              </TableColumn>
              <TableColumn className="text-xs text-white  bg-blue-700">
                Vendedor
              </TableColumn>

              <TableColumn className="text-xs text-white  bg-blue-700">
                Estado
              </TableColumn>

              <TableColumn className="text-xs text-white  bg-blue-700">
                T.Gravado
              </TableColumn>
              <TableColumn className="text-xs text-white  bg-blue-700">
                T.Igv
              </TableColumn>
              <TableColumn className="text-xs text-white  bg-blue-700">
                Total
              </TableColumn>
              <TableColumn className="text-xs text-white  bg-blue-700">
                Saldo
              </TableColumn>
            </TableHeader>
            <TableBody>
              {cotizaciones?.map((ordenCompra, index) => (
                <TableRow key={ordenCompra.id}>
                  <TableCell className=" text-xs  ">{index + 1}</TableCell>
                  <TableCell className=" min-w-[90px]   text-xs  ">
                    {formatDate(ordenCompra.fechaEmision)}
                  </TableCell>
                  <TableCell className="  min-w-[200px]  text-xs  ">
                    {ordenCompra.cliente.nombreApellidos ||
                      ordenCompra.cliente.nombreComercial}
                  </TableCell>
                  <TableCell className="  min-w-[150px]  text-xs  ">
                    {ordenCompra.vendedor}
                  </TableCell>

                  <TableCell className="  text-xs  ">
                    {ordenCompra.estadoPago}
                  </TableCell>

                  <TableCell className=" min-w-[110px]  text-xs  ">
                    S/. {formatNumber(Number(ordenCompra?.saldoInicial) / 1.18)}
                  </TableCell>
                  <TableCell className=" min-w-[110px]  text-xs  ">
                    S/.{" "}
                    {formatNumber(
                      (Number(ordenCompra?.saldoInicial) / 1.18) * 0.18
                    )}
                  </TableCell>
                  <TableCell className=" min-w-[110px]  text-xs  ">
                    S/. {formatNumber(ordenCompra.saldoInicial)}
                  </TableCell>
                  <TableCell className="min-w-[110px]  text-xs  ">
                    S/. {formatNumber(ordenCompra.saldo)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TablaReporteCotizaciones;
