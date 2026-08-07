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
import TablaAsistenciasOperativos from "./components/TablaAsistenciasOperativos";

const AsistenciasOperativos = ({
  colaboradores,
  isOpen,
  onOpenChange,
  selectColaborador,
  setSelectColaborador,
  dias,
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
        <ModalBody className="min-h-[70vh] ">
          <section className="flex flex-col pt-4 ">
            <Select
              className="w-60"
              selectionMode="single"
              isRequired
              classNames={selectClassNames}
              labelPlacement="outside"
              label="Colaborador Seleccionado"
              placeholder="..."
              variant="bordered"
              radius="sm"
              size="sm"
              selectedKeys={[`${selectColaborador}`]}
              onChange={(e) => setSelectColaborador(e.target.value)}
            >
              {colaboradores.map((colaborador) => (
                <SelectItem
                  key={colaborador.id}
                  textValue={`${colaborador.nombre_colaborador} ${colaborador.apellidos_colaborador}`}
                >
                  <p className="text-[11px]">
                    {colaborador.nombre_colaborador}{" "}
                    {colaborador.apellidos_colaborador}
                  </p>
                </SelectItem>
              ))}
            </Select>
          </section>
          <TablaAsistenciasOperativos
            dias={dias}
            findColaborador={findColaborador}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AsistenciasOperativos;
