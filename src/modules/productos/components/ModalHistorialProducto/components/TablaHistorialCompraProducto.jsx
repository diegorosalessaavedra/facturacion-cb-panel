import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React from "react";
import formatDate from "../../../../../hooks/FormatDate";

const TablaHistorialCompraProducto = ({ ordenesCompra }) => {
  return (
    <div>
      {" "}
      <Table
        aria-label="Tabla de itinerarios"
        color="default"
        isStriped
        classNames={{
          base: "min-w-full  overflow-hidden  p-4 ",
          wrapper: "p-0",
        }}
        radius="sm"
        isCompact={true}
        isHeaderSticky
      >
        <TableHeader>
          <TableColumn className=" min-w-14 text-xs text-white  bg-blue-700">
            #
          </TableColumn>
          <TableColumn className="  text-xs text-white  bg-blue-700">
            Proveedor
          </TableColumn>
          <TableColumn className="  text-xs text-white  bg-blue-700">
            Autorizado Por{" "}
          </TableColumn>
          <TableColumn className=" text-xs text-white  bg-blue-700"></TableColumn>
          <TableColumn className=" text-xs text-white  bg-blue-700">
            Fecha Emision
          </TableColumn>
          <TableColumn className="  text-xs text-white  bg-blue-700">
            Cantidad
          </TableColumn>
          <TableColumn className="  text-xs text-white  bg-blue-700">
            Precio Unitario
          </TableColumn>
          <TableColumn className="  text-xs text-white  bg-blue-700">
            Stock
          </TableColumn>
        </TableHeader>
        <TableBody>
          {ordenesCompra?.map((ordenCompra, index) => (
            <TableRow key={ordenCompra?.id}>
              <TableCell className="text-xs py-2">{index + 1}</TableCell>
              <TableCell className="text-xs py-2">
                {ordenCompra?.ordenesCompra?.proveedor.nombreComercial ||
                  ordenCompra?.ordenesCompra?.proveedor.nombreApellidos}
              </TableCell>
              <TableCell className="text-xs py-2">
                {ordenCompra?.ordenesCompra?.autorizado}
              </TableCell>
              <TableCell className="text-xs py-2">
                {ordenCompra?.nombre}
              </TableCell>
              <TableCell className="text-xs py-2">
                {ordenCompra?.ordenesCompra?.fechaEmision
                  ? formatDate(ordenCompra?.ordenesCompra?.fechaEmision)
                  : ""}
              </TableCell>
              <TableCell className="text-xs py-2">
                {ordenCompra?.cantidad}
              </TableCell>
              <TableCell className="text-xs py-2">
                S/{ordenCompra?.precioUnitario}
              </TableCell>
              <TableCell className="text-xs py-2">
                {ordenCompra?.stock}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TablaHistorialCompraProducto;
