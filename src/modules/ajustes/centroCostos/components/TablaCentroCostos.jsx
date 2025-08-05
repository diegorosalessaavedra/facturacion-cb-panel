import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const TablaCentroCostos = ({
  onOpen,
  setSelectModal,
  centroCostos,
  setSelectedCentroCosto,
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
          CENTRO COSTOS
        </TableColumn>
        <TableColumn className=" text-xs text-white  bg-blue-700">
          GLOSA CENTRO COSTOS
        </TableColumn>
        <TableColumn className=" text-xs text-white  bg-blue-700">
          SUB CENTRO COSTOS
        </TableColumn>
        <TableColumn className=" text-xs text-white  bg-blue-700">
          SUB GLOSA CENTRO COSTOS
        </TableColumn>
        <TableColumn className=" text-xs text-white  bg-blue-700">
          ACCIONES
        </TableColumn>
      </TableHeader>
      <TableBody>
        {centroCostos?.map((centroCosto, index) => (
          <TableRow key={centroCosto.id}>
            <TableCell className="text-xs py-2">{index + 1}</TableCell>
            <TableCell className="text-xs py-2">
              {centroCosto.cod_centro_costos}
            </TableCell>
            <TableCell className="text-xs py-2">
              {centroCosto.glosa_centro_costos}
            </TableCell>

            <TableCell className="text-xs py-2">
              {centroCosto.cod_sub_centro_costo}
            </TableCell>
            <TableCell className="text-xs py-2">
              {centroCosto.glosa_sub_centro_costo}
            </TableCell>

            <TableCell className="text-xs py-2">
              <div className="flex items-center gap-2 ">
                <FaEdit
                  className="text-xl text-blue-500 cursor-pointer"
                  onClick={() => {
                    setSelectModal("editar");
                    setSelectedCentroCosto(centroCosto);
                    onOpen();
                  }}
                />

                <FaTrashAlt
                  className="text-lg text-red-500 cursor-pointer"
                  onClick={() => {
                    setSelectModal("eliminar");
                    setSelectedCentroCosto(centroCosto);
                    onOpen();
                  }}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TablaCentroCostos;
