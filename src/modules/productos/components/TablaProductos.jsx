import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@nextui-org/react";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";

const TablaProductos = ({
  productos,
  costos_gastos,
  setSelectModal,
  setSelectProducto,
  onOpen,
}) => {
  const columns = [
    { key: "index", label: "#" },
    { key: "nombre", label: "NOMBRE" },
    ...(costos_gastos
      ? []
      : [
          { key: "codUnidad", label: "CODIGO UNIDAD" },
          { key: "codigoSunat", label: "CODIGO SUNAT" },
        ]),
    { key: "codigoInterno", label: "CODIGO INTERNO" },
    ...(costos_gastos
      ? []
      : [
          { key: "codigoCompra", label: "CODIGO COMPRA" },
          { key: "codigoVenta", label: "CODIGO VENTA" },
        ]),
    { key: "precioUnitario", label: "P. UNITARIO" },
    ...(costos_gastos
      ? []
      : [
          { key: "conStock", label: "Con Stock" },
          { key: "stock", label: "STOCK" },
        ]),
    { key: "acciones", label: "ACCIONES" },
  ];

  return (
    <Table
      isStriped
      classNames={{
        base: "w-full  overflow-auto  px-4 ",
        wrapper: "p-0",
      }}
      aria-label="Tabla de productos"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key}
            className=" min-w-14 text-xs text-white bg-blue-700"
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>

      <TableBody>
        {productos.map((producto, index) => (
          <TableRow key={producto.id}>
            {(columnKey) => {
              switch (columnKey) {
                case "index":
                  return (
                    <TableCell className="text-xs py-2">{index + 1}</TableCell>
                  );
                case "nombre":
                  return (
                    <TableCell className="text-xs py-2">
                      {producto.nombre}
                    </TableCell>
                  );
                case "codUnidad":
                  return (
                    <TableCell className="text-xs py-2">
                      {producto.codUnidad}
                    </TableCell>
                  );
                case "codigoSunat":
                  return (
                    <TableCell className="text-xs py-2">
                      {producto.codigoSunat}
                    </TableCell>
                  );
                case "codigoInterno":
                  return (
                    <TableCell className="text-xs py-2">
                      {producto.codigoInterno}
                    </TableCell>
                  );
                case "codigoCompra":
                  return (
                    <TableCell className="text-xs py-2">
                      {producto.codigoCompra}
                    </TableCell>
                  );
                case "codigoVenta":
                  return (
                    <TableCell className="text-xs py-2">
                      {producto.codigoVenta}
                    </TableCell>
                  );
                case "precioUnitario":
                  return (
                    <TableCell className="text-xs py-2">
                      S/{producto.precioUnitario}
                    </TableCell>
                  );
                case "conStock":
                  return (
                    <TableCell className="text-xs py-2">
                      {producto.conStock === false ? "NO" : "SI"}
                    </TableCell>
                  );
                case "stock":
                  return (
                    <TableCell className="text-xs py-2">
                      {producto.stock}
                    </TableCell>
                  );
                case "acciones":
                  return (
                    <TableCell className="text-xs py-2">
                      <div className="flex gap-4 items-center">
                        <Tooltip content="Editar" showArrow={true}>
                          <span>
                            <MdEdit
                              className="text-xl text-orange-500 cursor-pointer"
                              onClick={() => {
                                setSelectModal("editar");
                                setSelectProducto(producto);
                                onOpen();
                              }}
                            />
                          </span>
                        </Tooltip>
                        <Tooltip content="Eliminar" showArrow={true}>
                          <span>
                            <FaTrashAlt
                              className="text-lg text-red-500 cursor-pointer"
                              onClick={() => {
                                setSelectModal("eliminar");
                                setSelectProducto(producto);
                                onOpen();
                              }}
                            />
                          </span>
                        </Tooltip>
                      </div>
                    </TableCell>
                  );
                default:
                  return <TableCell className="text-xs py-2">-</TableCell>;
              }
            }}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TablaProductos;
