import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { selectClassNames } from "../../../../../assets/classNames";
import TablaAsistenciaAdministrativos from "./components/TablaAsistenciaAdministrativos";

const AsistenciaAdministrativos = ({
  colaboradores,
  isOpen,
  onOpenChange,
  selectColaborador,
  setSelectColaborador,
  dias,
  totalSemanas,
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
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-xs">
              TAREO DE ASISTENCIAS ADMINISTRATIVOS{" "}
            </ModalHeader>
            <ModalBody className="min-h-[70vh] ">
              <TablaAsistenciaAdministrativos
                dias={dias}
                findColaborador={findColaborador}
                totalSemanas={totalSemanas}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AsistenciaAdministrativos;
