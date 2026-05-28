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
  Tooltip,
} from "@nextui-org/react";
import { useState } from "react";
import ModalSolicitarEliminarContrato from "./ModalElminarContrato";
import { FileText, Trash2, Clock, Briefcase, AlertCircle } from "lucide-react";
import formatDate from "../../../../../hooks/FormatDate";

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
    if (!fecha) return null;
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
        classNames={{
          base: "bg-white",
          header: "border-b border-slate-200",
          footer: "border-t border-slate-200",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Briefcase size={20} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-slate-800">
                Historial de Contratos
              </h2>
              <span className="text-sm font-normal text-slate-500">
                Colaborador:{" "}
                <span className="font-semibold text-slate-700">
                  {selectColaborador.nombre_colaborador}{" "}
                  {selectColaborador.apellidos_colaborador}
                </span>
              </span>
            </div>
          </ModalHeader>

          <ModalBody className="py-6 bg-slate-50/50">
            <Table
              aria-label="Tabla de contratos del colaborador"
              isStriped
              removeWrapper
              classNames={{
                base: "min-w-full max-h-[65vh] overflow-y-auto overflow-x-hidden border border-slate-200 rounded-xl bg-white shadow-sm",
                th: "bg-slate-900 text-slate-50 font-semibold text-[11px] uppercase tracking-wider py-3",
                td: "py-3 text-sm text-slate-700",
              }}
            >
              <TableHeader>
                <TableColumn width={40}>#</TableColumn>
                <TableColumn>TIPO DE CONTRATO</TableColumn>
                <TableColumn>INICIO</TableColumn>
                <TableColumn>FINAL</TableColumn>
                <TableColumn>ESTADO / VENCIMIENTO</TableColumn>
                <TableColumn align="center">DOCUMENTO</TableColumn>
                <TableColumn align="center">ACCIONES</TableColumn>
              </TableHeader>

              <TableBody
                emptyContent={
                  <div className="text-slate-500 py-4">
                    No hay contratos registrados para este colaborador.
                  </div>
                }
              >
                {selectColaborador.contratos?.map((contrato, index) => {
                  const diasRestantes = calcularDiasRestantes(
                    contrato.fecha_inicio,
                    contrato.fecha_final,
                  );
                  const isExpirado =
                    contrato.estado_contrato === "expirado" ||
                    diasRestantes < 0;
                  // Usamos trim() para evitar bugs por espacios ocultos como en el código original
                  const isPendiente =
                    contrato.estado_contrato?.trim() ===
                    "pendiente_eliminacion";

                  return (
                    <TableRow
                      key={contrato.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="font-medium text-slate-400">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium text-slate-800">
                        {contrato.tipo_contrato}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          {formatDate(contrato.fecha_inicio)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          {formaDate(contrato.fecha_final)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {isExpirado ? (
                          <Chip
                            size="sm"
                            color="danger"
                            variant="flat"
                            startContent={<AlertCircle size={14} />}
                            className="font-medium"
                          >
                            Expirado
                          </Chip>
                        ) : (
                          <Chip
                            size="sm"
                            color={diasRestantes <= 15 ? "warning" : "success"}
                            variant="flat"
                            startContent={<Clock size={14} />}
                            className="font-medium"
                          >
                            {diasRestantes} días restantes
                          </Chip>
                        )}
                      </TableCell>
                      <TableCell>
                        <a
                          href={`${import.meta.env.VITE_LARAVEL_URL}/contratos/${contrato.documento_contrato}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex justify-center"
                        >
                          <Tooltip content="Ver documento PDF">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              color="primary"
                              className="text-blue-600 hover:bg-blue-50"
                            >
                              <FileText size={18} />
                            </Button>
                          </Tooltip>
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          {!isPendiente ? (
                            <Tooltip
                              content="Solicitar eliminación"
                              color="danger"
                            >
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                color="danger"
                                onPress={() => {
                                  setSelectContrato(contrato);
                                  onOpenCon();
                                }}
                                className="hover:bg-red-50"
                              >
                                <Trash2 size={18} />
                              </Button>
                            </Tooltip>
                          ) : (
                            <Chip
                              size="sm"
                              color="warning"
                              variant="dot"
                              className="border-warning-200 text-warning-700 bg-warning-50"
                            >
                              Pendiente revisión
                            </Chip>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              className="text-slate-600 font-medium hover:bg-slate-100"
              onPress={() => onOpenChange(false)}
            >
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal para solicitar eliminación */}
      {isOpenCon && (
        <ModalSolicitarEliminarContrato
          isOpen={isOpenCon}
          onOpenChange={onOpenChangeCon}
          handleFindColaboradores={handleFindColaboradores}
          selectContrato={selectContrato}
          selectColaborador={selectColaborador}
        />
      )}
    </>
  );
};

export default ModalVerContratos;
