import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const TablaTrabajadores = ({
  trabajadores,
  setSelectTrabajador,
  setSelectModal,
  onOpen,
}) => {
  return (
    <Table
      aria-label="Tabla de itinerarios"
      color="default"
      isStriped
      classNames={{
        base: "min-w-full min-h-full overflow-y-auto",
        wrapper: "p-0",
      }}
      radius="sm"
      isCompact={true}
      isHeaderSticky
      shadow="md"
    >
      <TableHeader>
        <TableColumn className=" text-xs text-white  bg-slate-900">
          Nº
        </TableColumn>
        <TableColumn className=" text-xs text-white  bg-slate-900">
          COD. DEL TRABAJADOR
        </TableColumn>
        <TableColumn className=" text-xs text-white  bg-slate-900">
          TRABAJADORES
        </TableColumn>

        <TableColumn className=" text-xs text-white  bg-slate-900">
          DNI
        </TableColumn>
        <TableColumn className=" text-xs text-white  bg-slate-900">
          CENTRO <br />
          DE COSTO
        </TableColumn>
        <TableColumn className=" text-xs text-white  bg-slate-900">
          ÁREA DE CENTRO DE COSTO
        </TableColumn>
        <TableColumn className=" text-xs text-white  bg-slate-900">
          ÁREA DE TRABAJO
        </TableColumn>
        <TableColumn className=" text-xs text-white  bg-slate-900">
          ACCIONES
        </TableColumn>
      </TableHeader>
      <TableBody>
        {trabajadores?.map((trabajador, index) => (
          <TableRow key={trabajador.id}>
            <TableCell className="text-[11px] py-2">{index + 1}</TableCell>
            <TableCell className="text-[11px] py-2 text-nowrap">
              {trabajador.codigo_trabajador}
            </TableCell>
            <TableCell className="text-[11px] py-2 text-nowrap">
              {trabajador.nombre_trabajador}
            </TableCell>
            <TableCell className="text-[11px] py-2 text-nowrap">
              {trabajador.dni_trabajador}
            </TableCell>
            <TableCell className="text-[11px] py-2 text-nowrap">
              {trabajador.centro_costo}
            </TableCell>
            <TableCell className="text-[11px] py-2 text-nowrap">
              {trabajador.area_centro_costo}
            </TableCell>
            <TableCell className="text-[11px] py-2">
              {trabajador.areas_asignadas?.join(" - ")}
            </TableCell>
            <TableCell className="text-[11px] py-2">
              <div className="flex gap-2 items-center">
                <FaEdit
                  className="text-xl text-blue-500 cursor-pointer"
                  onClick={() => {
                    setSelectModal("update");
                    setSelectTrabajador(trabajador);
                    onOpen();
                  }}
                />
                <FaTrashAlt
                  className="text-lg text-red-500 cursor-pointer"
                  onClick={() => {
                    setSelectModal("delete");
                    setSelectTrabajador(trabajador);
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

export default TablaTrabajadores;
