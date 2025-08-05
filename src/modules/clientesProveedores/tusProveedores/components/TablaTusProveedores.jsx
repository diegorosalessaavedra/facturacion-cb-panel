import React from "react";
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
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const TablaTusProveedores = ({
  proveedores,
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
            base: "min-w-full  h-[70vh]   overflow-auto  p-4 ",
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
              BANCO DEL BENEFICIARIO
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              NRO CUENTA BCO
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              TIPO DE DOCUMENTO
            </TableColumn>

            <TableColumn className=" text-xs text-white  bg-blue-700">
              NUMERO
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              ACCIONES
            </TableColumn>
          </TableHeader>
          <TableBody>
            {proveedores?.map((proveedor, index) => (
              <TableRow key={proveedor.id}>
                <TableCell className="text-xs py-2">{index + 1}</TableCell>
                <TableCell className="text-xs py-2">
                  {proveedor.tipoDocIdentidad === "RUC"
                    ? proveedor.nombreComercial
                    : proveedor.nombreApellidos}
                </TableCell>
                <TableCell className="text-xs py-2">
                  {proveedor.banco_beneficiario || "-"}
                </TableCell>
                <TableCell className="text-xs py-2">
                  {proveedor.nro_cuenta_bco || "-"}
                </TableCell>
                <TableCell className="text-xs py-2">
                  {proveedor.tipoDocIdentidad}
                </TableCell>
                <TableCell className="text-xs py-2">
                  {proveedor.numeroDoc}
                </TableCell>
                <TableCell className="text-xs py-2">
                  <div className="flex gap-2 items-center">
                    <FaEdit
                      className="text-xl text-blue-500 cursor-pointer"
                      onClick={() => {
                        setSelectModal("editar");
                        setSelectProveedor(proveedor);
                        onOpen();
                      }}
                    />
                    <FaTrashAlt
                      className="text-lg text-red-500 cursor-pointer"
                      onClick={() => {
                        setSelectModal("eliminar");
                        setSelectProveedor(proveedor);
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

export default TablaTusProveedores;
