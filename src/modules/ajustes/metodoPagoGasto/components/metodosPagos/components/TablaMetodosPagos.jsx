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

const TablaMetodosPagos = ({
  onOpen,
  setSelectModal,
  metodosPagos,
  setSelectPago,
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
          CONDICIÓN DE PAGO
        </TableColumn>
        <TableColumn className=" text-xs text-white  bg-blue-700">
          ACCIONES{" "}
        </TableColumn>
      </TableHeader>
      <TableBody>
        {metodosPagos?.map((pago, index) => (
          <TableRow key={pago.id}>
            <TableCell className="text-xs py-2">{index + 1}</TableCell>
            <TableCell className="text-xs py-2">{pago.descripcion}</TableCell>
            <TableCell className="text-xs py-2">{pago.condicionPago}</TableCell>

            <TableCell className="text-xs py-2">
              <FaTrashAlt
                className="text-lg text-red-500 cursor-pointer"
                onClick={() => {
                  setSelectModal("eliminar");
                  setSelectPago(pago);
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

export default TablaMetodosPagos;
