import React from "react";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const TablaTusClientes = ({
  clientes,
  loading,
  onOpen,
  setSelectModal,
  setSelectProveedor,
}) => {
  return (
    <div className="w-full flex items-center">
      {loading ? (
        <Spinner className="m-auto" label="Cargando..." color="success" />
      ) : (
        <Table
          aria-label="Tabla de itinerarios"
          color="default"
          isStriped
          classNames={{
            base: "min-w-full h-[70vh]  overflow-auto  p-4 ",
            wrapper: "p-0",
          }}
          radius="sm"
          isCompact={true}
          isHeaderSticky
        >
          <TableHeader>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              #
            </TableColumn>

            <TableColumn className=" text-xs text-white  bg-blue-700">
              NOMBRE
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              TIPO DE DOCUMENTO
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              NUMERO DOC.
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              NUMERO TEL.
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              EECC
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              ACCIONES
            </TableColumn>
          </TableHeader>
          <TableBody>
            {clientes?.map((cliente, index) => (
              <TableRow key={cliente.id}>
                <TableCell className="text-xs py-2">{index + 1}</TableCell>
                <TableCell className="text-xs py-2">
                  {cliente.tipoDocIdentidad === "RUC"
                    ? cliente.nombreComercial
                    : cliente.nombreApellidos}
                </TableCell>
                <TableCell className="text-xs py-2">
                  {cliente.tipoDocIdentidad}
                </TableCell>
                <TableCell className="text-xs py-2">
                  {cliente.numeroDoc}
                </TableCell>
                <TableCell className="text-xs py-2">
                  {cliente.telefono || "-"}
                </TableCell>
                <TableCell
                  className={`text-xs py-2 ${
                    cliente.eecc === "Inactivo"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {cliente.eecc || "-"}
                </TableCell>
                <TableCell className="text-xs py-2">
                  <div className="flex gap-2 items-center">
                    <FaEdit
                      className="text-xl text-blue-500 cursor-pointer"
                      onClick={() => {
                        setSelectModal("editar");
                        setSelectProveedor(cliente);
                        onOpen();
                      }}
                    />
                    <FaTrashAlt
                      className="text-lg text-red-500 cursor-pointer"
                      onClick={() => {
                        setSelectModal("eliminar");
                        setSelectProveedor(cliente);
                        onOpen();
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TablaTusClientes;
