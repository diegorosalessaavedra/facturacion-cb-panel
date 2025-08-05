import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React from "react";
import { FaTrashAlt } from "react-icons/fa";

const TablaMetodosGastos = ({
  onOpen,
  setSelectModal,
  metodosGastos,
  setSelectGasto,
}) => {
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
        <TableColumn className=" text-xs text-white  bg-blue-700">
          #
        </TableColumn>

        <TableColumn className=" text-xs text-white  bg-blue-700">
          DESCRIPCIÓN
        </TableColumn>
        <TableColumn className=" text-xs text-white  bg-blue-700">
          ACCIONES{" "}
        </TableColumn>
      </TableHeader>
      <TableBody>
        {metodosGastos?.map((gasto, index) => (
          <TableRow key={gasto.id}>
            <TableCell className="text-xs py-2 min-w-10">{index + 1}</TableCell>
            <TableCell className="text-xs py-2 w-full">
              {gasto.descripcion}
            </TableCell>
            <TableCell className="text-xs py-2">
              <FaTrashAlt
                className="text-lg text-red-500 cursor-pointer"
                onClick={() => {
                  setSelectModal("eliminar");
                  setSelectGasto(gasto);
                  onOpen();
                }}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TablaMetodosGastos;
