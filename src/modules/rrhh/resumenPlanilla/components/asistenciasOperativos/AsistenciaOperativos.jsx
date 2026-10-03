import React from "react";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import TablaAsistenciaOperativos from "./components/TablaAsistenciaOperativos";

const AsistenciaOperativos = ({
  colaboradores,
  isOpen,
  onOpenChange,
  selectColaborador,
  dias,
  totalSemanas,
  isFinalizado,
}) => {
  const findColaborador = colaboradores.find(
    (c) => c.id === Number(selectColaborador),
  );

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="5xl"
      classNames={{
        base: " w-full max-w-[1400px] min-h-[80vh] max-h-[90vh] flex flex-col rounded-[24px] overflow-hidden relative",
        header: "p-4 pb-0  bg-transparent z-20 flex-shrink-0",
        body: "p-4 pt-0 z-10 relative flex-1 min-h-0 overflow-hidden flex flex-col",
      }}
    >
      <ModalContent className="w-[1400px]">
        <ModalHeader className="flex flex-col gap-1 text-xs">
          TAREO DE ASISTENCIAS OPERATIVOS{" "}
        </ModalHeader>
        <ModalBody className="min-h-[70vh] overflow-y-auto ">
          <TablaAsistenciaOperativos
            dias={dias}
            findColaborador={findColaborador}
            totalSemanas={totalSemanas}
            isFinalizado={isFinalizado}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AsistenciaOperativos;
