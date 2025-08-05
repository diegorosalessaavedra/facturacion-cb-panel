import React from "react";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const TablaUsuarios = ({
  onOpen,
  usuarios,
  loading,
  setSelectUsuario,
  setSelectModal,
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
              NOMBRE
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              DNI
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              CORREO
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              TELÉFONO
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              ROL
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              ESTADO
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              ACCIONES
            </TableColumn>
          </TableHeader>
          <TableBody>
            {usuarios?.map((usuario, index) => (
              <TableRow key={usuario.id}>
                <TableCell className="text-xs py-2">{index + 1}</TableCell>
                <TableCell className="text-xs py-2">{usuario.nombre}</TableCell>
                <TableCell className="text-xs py-2">{usuario.dni}</TableCell>
                <TableCell className="text-xs py-2">{usuario.correo}</TableCell>
                <TableCell className="text-xs py-2">
                  {usuario.celular}
                </TableCell>
                <TableCell className="text-xs py-2">{usuario.role}</TableCell>
                <TableCell className="text-xs py-2">{usuario.status}</TableCell>
                <TableCell className="text-xs py-2">
                  <div className="flex gap-4 items-center">
                    <Tooltip content="Editar">
                      <span>
                        <FaEdit
                          className="text-xl text-blue-500 cursor-pointer"
                          onClick={() => {
                            setSelectModal("editar");
                            setSelectUsuario(usuario);
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
                            setSelectUsuario(usuario);
                            onOpen();
                          }}
                        />
                      </span>
                    </Tooltip>
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

export default TablaUsuarios;
