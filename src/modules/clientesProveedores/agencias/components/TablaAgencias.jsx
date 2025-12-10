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

const TablaAgencias = ({
  agencias,
  loading,
  onOpen,
  setSelectModal,
  setSelectAgencia,
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
              DIRECCION 1
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              DIRECCION 2
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              ACCIONES
            </TableColumn>
          </TableHeader>
          <TableBody>
            {agencias?.map((agencia, index) => (
              <TableRow key={agencia.id}>
                <TableCell className="text-xs py-2">{index + 1}</TableCell>
                <TableCell className="text-xs py-2">
                  {agencia.nombre_agencia || "-"}
                </TableCell>
                <TableCell className="text-xs py-2">
                  {agencia.direccion_1 || "-"}
                </TableCell>
                <TableCell className="text-xs py-2">
                  {agencia.direccion_2 || "-"}
                </TableCell>

                <TableCell className="text-xs py-2">
                  <div className="flex gap-2 items-center">
                    <FaEdit
                      className="text-xl text-blue-500 cursor-pointer"
                      onClick={() => {
                        setSelectModal("editar");
                        setSelectAgencia(agencia);
                        onOpen();
                      }}
                    />
                    <FaTrashAlt
                      className="text-lg text-red-500 cursor-pointer"
                      onClick={() => {
                        setSelectModal("eliminar");
                        setSelectAgencia(agencia);
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

export default TablaAgencias;
