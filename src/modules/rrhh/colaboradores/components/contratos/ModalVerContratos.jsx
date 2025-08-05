import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  useDisclosure,
} from "@nextui-org/react";
import ModalElminarContrato from "./ModalElminarContrato";
import { useState } from "react";

const ModalVerContratos = ({
  isOpen,
  onOpenChange,
  selectColaborador,
  handleFindColaboradores,
}) => {
  const {
    isOpen: isOpenCon,
    onOpen: onOpenCon,
    onOpenChange: onOpenChangeCon,
  } = useDisclosure();
  const [selectContrato, setSelectContrato] = useState();

  const parseFecha = (fecha) => {
    const [dia, mes, anio] = fecha.split("/");
    return new Date(`${anio}-${mes}-${dia}`); // formato aceptado por Date
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
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        size="4xl"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-base">
            Contratos del colaborador {selectColaborador.nombre_colaborador}
          </ModalHeader>
          <ModalBody>
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
                  TIPO DE CONTRATO
                </TableColumn>
                <TableColumn className=" text-xs text-white  bg-blue-700">
                  FECHA DE INICIO
                </TableColumn>
                <TableColumn className=" text-xs text-white  bg-blue-700">
                  FECHA FINAL
                </TableColumn>
                <TableColumn className=" text-xs text-white  bg-blue-700">
                  DIAS POR <br />
                  VENCER
                </TableColumn>
                <TableColumn className=" text-xs text-white  bg-blue-700">
                  ARCHIVO ADJUNTO
                </TableColumn>
                <TableColumn className=" text-xs text-white  bg-blue-700">
                  ELIMINAR CONTRATO
                </TableColumn>
              </TableHeader>
              <TableBody>
                {selectColaborador.contratos?.map((contrato, index) => (
                  <TableRow key={contrato.id}>
                    <TableCell className="text-xs py-2">{index + 1}</TableCell>
                    <TableCell className="text-xs py-2">
                      {contrato.tipo_contrato}
                    </TableCell>
                    <TableCell className="text-xs py-2">
                      {contrato.fecha_inicio}
                    </TableCell>
                    <TableCell className="text-xs py-2">
                      {contrato.fecha_final}
                    </TableCell>
                    <TableCell className="text-xs py-2">
                      {calcularDiasRestantes(
                        contrato.fecha_inicio,
                        contrato.fecha_final
                      )}{" "}
                      días restantes
                    </TableCell>
                    <TableCell className="text-xs py-2">
                      <a
                        href={`${import.meta.env.VITE_LARAVEL_URL}/contratos/${
                          contrato.documento_contrato
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Chip color="danger" size="sm">
                          Ver Archivo{" "}
                        </Chip>
                      </a>
                    </TableCell>
                    <TableCell className="text-xs py-2">
                      <Button
                        onPress={() => {
                          setSelectContrato(contrato);
                          onOpenCon();
                        }}
                        size="sm"
                        color="danger"
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              type="button"
              onPress={() => {
                onOpenChange();
                reset();
              }}
            >
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {
        <ModalElminarContrato
          isOpen={isOpenCon}
          onOpenChange={onOpenChangeCon}
          handleFindColaboradores={handleFindColaboradores}
          selectContrato={selectContrato}
          selectColaborador={selectColaborador}
        />
      }
    </>
  );
};

export default ModalVerContratos;
