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
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { IoDocumentTextSharp } from "react-icons/io5";
import { GoAlertFill } from "react-icons/go";
import { MdDangerous } from "react-icons/md";

const TablaColaboradores = ({
  onOpen,
  colaboradores,
  loading,
  setSelectColaborador,
  setSelectModal,
}) => {
  const parseFecha = (fecha) => {
    const [dia, mes, anio] = fecha.split("/");
    return new Date(`${anio}-${mes}-${dia}`);
  };

  const calcularDiasRestantes = (fechaInicio, fechaFinal) => {
    const inicio = parseFecha(fechaInicio);
    const fin = parseFecha(fechaFinal);
    const ahora = new Date();

    if (!inicio || !fin) return "Fecha inválida";

    return fin < ahora
      ? -Math.floor((ahora - fin) / (1000 * 60 * 60 * 24))
      : Math.ceil((fin - ahora) / (1000 * 60 * 60 * 24));
  };

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
              DIAS POR VENCER{" "}
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              CONTRATOS
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              MEMOS
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              VER MAS
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
                <TableCell
                  className={`"text-xs py-2" ${
                    colaborador.contratos.length > 0 &&
                    calcularDiasRestantes(
                      colaborador.contratos[0]?.fecha_inicio,
                      colaborador.contratos[0]?.fecha_final
                    ) < 16
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  {colaborador.contratos.length > 0 &&
                    calcularDiasRestantes(
                      colaborador.contratos[0]?.fecha_inicio,
                      colaborador.contratos[0]?.fecha_final
                    )}{" "}
                  días restantes
                </TableCell>
                <TableCell className="text-xs py-2">
                  <Button
                    onPress={() => {
                      setSelectModal("ver_contratos");
                      setSelectColaborador(colaborador);
                      onOpen();
                    }}
                    size="sm"
                    color="secondary"
                  >
                    Ver contratos
                  </Button>{" "}
                </TableCell>
                <TableCell className="text-xs py-2">
                  <Button
                    onPress={() => {
                      setSelectModal("ver_memos");
                      setSelectColaborador(colaborador);
                      onOpen();
                    }}
                    size="sm"
                    color="warning"
                  >
                    Ver memos
                  </Button>{" "}
                </TableCell>
                <TableCell className="text-xs py-2">
                  <Button
                    onPress={() => {
                      setSelectModal("verMas");
                      setSelectColaborador(colaborador);
                      onOpen();
                    }}
                    size="sm"
                    color="primary"
                    className="bg-neutral-900"
                  >
                    Ver mas
                  </Button>
                </TableCell>
                <TableCell className="text-xs py-2">
                  <div className="flex gap-4 items-center">
                    <Tooltip content="Editar" size="sm" showArrow={true}>
                      <span>
                        <FaEdit
                          className="text-xl text-blue-500 cursor-pointer"
                          onClick={() => {
                            setSelectModal("editar");
                            setSelectColaborador(colaborador);
                            onOpen();
                          }}
                        />
                      </span>
                    </Tooltip>
                    <Tooltip content="Eliminar" size="sm" showArrow={true}>
                      <span>
                        <FaTrashAlt
                          className="text-lg text-red-500 cursor-pointer"
                          onClick={() => {
                            setSelectModal("eliminar");
                            setSelectColaborador(colaborador);
                            onOpen();
                          }}
                        />
                      </span>
                    </Tooltip>
                    <Tooltip
                      content="Agregar Contrato"
                      size="sm"
                      showArrow={true}
                    >
                      <span>
                        <IoDocumentTextSharp
                          className="text-xl text-purple-600 cursor-pointer"
                          onClick={() => {
                            setSelectModal("agregar_contrato");
                            setSelectColaborador(colaborador);
                            onOpen();
                          }}
                        />
                      </span>
                    </Tooltip>
                    <Tooltip content="Agregar memo" size="sm" showArrow={true}>
                      <span>
                        <GoAlertFill
                          className="text-xl text-amber-400 cursor-pointer"
                          onClick={() => {
                            setSelectModal("agregar_memo");
                            setSelectColaborador(colaborador);
                            onOpen();
                          }}
                        />
                      </span>
                    </Tooltip>
                    <Tooltip
                      content="Dar de baja al colaborador"
                      size="sm"
                      showArrow={true}
                    >
                      <span>
                        <MdDangerous
                          className="text-xl text-red-600 cursor-pointer"
                          onClick={() => {
                            setSelectModal("dar_baja");
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

export default TablaColaboradores;
