import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React from "react";

const CamposProductosComprobante = ({ selectCotizacion }) => {
  const total = selectCotizacion.productos.reduce(
    (acc, producto) => acc + producto.total,
    0
  );

  const formatNumber = (num) =>
    Number(num)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Formatear con separadores de miles

  return (
    <div>
      <h3>Productos</h3>
      <Divider />

      <div>
        <Table
          aria-label="Tabla de itinerarios"
          color="default"
          isStriped
          classNames={{
            base: "min-w-full  overflow-hidden  p-2 ",
            wrapper: "p-0",
          }}
          radius="sm"
          isCompact={true}
          isHeaderSticky
        >
          <TableHeader>
            <TableColumn className=" text-xs text-white  bg-blue-700 ">
              #
            </TableColumn>

            <TableColumn className=" text-xs text-white  bg-blue-700 ">
              Nombre
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700 ">
              Cantidad
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700 ">
              Stock
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700 ">
              Sub Total
            </TableColumn>
          </TableHeader>
          <TableBody>
            {selectCotizacion?.productos?.map((producto, index) => (
              <TableRow key={producto.id}>
                <TableCell className="min-w-[80px] text-xs sticky left-[0px] z-10 bg-white">
                  {index + 1}
                </TableCell>
                <TableCell className="min-w-[80px] text-xs sticky left-[0px] z-10 bg-white">
                  {producto?.producto.nombre}
                </TableCell>
                <TableCell className=" min-w-[80px]  text-xs sticky left-[80px] z-10 bg-white">
                  {producto.cantidad}
                </TableCell>
                <TableCell className=" min-w-[80px] text-xs sticky left-[160px] z-10 bg-white">
                  {producto.producto.stock}
                </TableCell>
                <TableCell className=" min-w-[80px] text-xs sticky left-[160px] z-10 bg-white">
                  {producto.total}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="w-full flex items-center justify-end gap-3 pr-16">
        <h3 className="text-sm font-semibold">Total:</h3>
        <h4 className="text-sm font-semibold">S/ {formatNumber(total)}</h4>
      </div>
    </div>
  );
};

export default CamposProductosComprobante;
