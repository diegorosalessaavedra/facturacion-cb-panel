import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

const TablaReporteKardex = ({ productos }) => {
  function cantidadTotal(productos, item) {
    const total = productos.reduce(
      (acumulador, producto) => acumulador + Number(producto[item]),
      0
    );
    return total;
  }

  return (
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
        <TableColumn className=" text-xs text-white  bg-blue-700">
          NOMBRE
        </TableColumn>
        <TableColumn className="  text-xs text-white  bg-blue-700">
          CODIGO INTERNO
        </TableColumn>
        <TableColumn className="  text-xs text-white  bg-blue-700">
          CODIGO SUNAT
        </TableColumn>
        <TableColumn className="  text-xs text-white  bg-blue-700">
          CANT. ENTRADAS
        </TableColumn>
        <TableColumn className="  text-xs text-white  bg-blue-700">
          PT. ENTRADAS
        </TableColumn>
        <TableColumn className="  text-xs text-white  bg-blue-700">
          CANT. SALIDAS
        </TableColumn>
        <TableColumn className="  text-xs text-white  bg-blue-700">
          PT. SALIDAS
        </TableColumn>
      </TableHeader>
      <TableBody>
        {productos?.map((producto, index) => (
          <TableRow key={producto.id}>
            <TableCell className="text-xs py-2">{index + 1}</TableCell>
            <TableCell className="text-xs py-2">{producto.nombre}</TableCell>
            <TableCell className="text-xs py-2">
              {producto.codigoInterno}
            </TableCell>
            <TableCell className="text-xs py-2">
              {producto.codigoSunat}
            </TableCell>
            <TableCell className="text-xs py-2">
              {cantidadTotal(producto.productosOrdenCompras, "cantidad")}
            </TableCell>
            <TableCell className="text-xs py-2">
              {cantidadTotal(producto.productosOrdenCompras, "total")}
            </TableCell>
            <TableCell className="text-xs py-2">
              {cantidadTotal(producto.productosCotizaciones, "cantidad")}
            </TableCell>
            <TableCell className="text-xs py-2">
              {cantidadTotal(producto.productosCotizaciones, "total")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TablaReporteKardex;
