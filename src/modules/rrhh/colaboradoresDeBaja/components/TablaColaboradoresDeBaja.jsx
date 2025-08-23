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
  Tooltip,
} from "@nextui-org/react";
import { FaCheckCircle } from "react-icons/fa";

const TablaColaboradoresDeBaja = ({
  onOpen,
  colaboradores,
  loading,
  setSelectColaborador,
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
            base: "min-w-full  h-[75vh]   p-4 ",
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
              NOMBRE Y APELLIDO
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              DNI
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              TELÉFONO
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              CORREO
            </TableColumn>
            {/* <TableColumn className=" text-xs text-white  bg-blue-700">
              DIRRECCIÓN DE DOMICILIO
            </TableColumn> */}
            <TableColumn className=" text-xs text-white  bg-blue-700">
              CARGO LABORAL
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              HISTORIAL
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              ACCIONES
            </TableColumn>
          </TableHeader>
          <TableBody>
            {colaboradores?.map((colaborador, index) => (
              <TableRow key={colaborador.id}>
                <TableCell className="text-xs py-2">{index + 1}</TableCell>
                <TableCell className="text-xs py-2">
                  {colaborador.apellidos_colaborador}{" "}
                  {colaborador.nombre_colaborador}
                </TableCell>
                <TableCell className="text-xs py-2">
                  {colaborador.dni_colaborador}
                </TableCell>
                <TableCell className="text-xs py-2">
                  {colaborador.telefono_colaborador}
                </TableCell>
                <TableCell className="text-xs py-2">
                  {colaborador.correo_colaborador}
                </TableCell>
                {/* <TableCell className="text-xs py-2">
                  {colaborador.direccion_colaborador}
                </TableCell> */}
                <TableCell className="text-xs py-2">
                  {colaborador.cargo_laboral?.cargo}
                </TableCell>
                <TableCell className="text-xs py-2">
                  <Button
                    onPress={() => {
                      setSelectModal("ver_historial");
                      setSelectColaborador(colaborador);
                      onOpen();
                    }}
                    size="sm"
                    color="secondary"
                  >
                    Ver historial
                  </Button>
                </TableCell>

                <TableCell className="text-xs py-2">
                  <div className="flex gap-4 items-center">
                    <Tooltip
                      content="Quitar de baja al colaborador"
                      size="sm"
                      showArrow={true}
                    >
                      <span>
                        <FaCheckCircle
                          className="text-2xl text-blue-600 cursor-pointer"
                          onClick={() => {
                            setSelectModal("quitar_baja");
                            setSelectColaborador(colaborador);
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

export default TablaColaboradoresDeBaja;
