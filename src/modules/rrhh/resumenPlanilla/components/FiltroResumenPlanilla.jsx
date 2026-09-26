import React from "react";
import { Select, SelectItem, Button, useDisclosure } from "@nextui-org/react";
import { FileText } from "lucide-react";
import { selectClassNames } from "../../../../assets/classNames";
import ModalTxtPlanilla from "./ModalTxtPlanilla";

const FiltroResumenPlanilla = ({
  dataFiltros,
  setDataFiltros,
  colaboradores,
  selectDatosText,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <section className="flex items-end justify-between px-2 w-full">
      {/* Lado Izquierdo: Filtros */}
      <div className="flex gap-4">
        <Select
          className="w-60"
          selectionMode="multiple"
          isRequired
          classNames={selectClassNames}
          labelPlacement="outside"
          label="Empresa"
          placeholder="..."
          variant="bordered"
          radius="sm"
          size="sm"
          selectedKeys={dataFiltros.empresa}
          onSelectionChange={(keys) =>
            setDataFiltros({ ...dataFiltros, empresa: keys })
          }
        >
          <SelectItem key="Granjas Peruanas" textValue="GRANJAS PERUANAS">
            <p className="text-[11px]">GRANJAS PERUANAS</p>
          </SelectItem>
          <SelectItem
            key="Multinacional Services"
            textValue="MULTINACIONAL SERVICES"
          >
            <p className="text-[11px]">MULTINACIONAL SERVICES</p>
          </SelectItem>
          <SelectItem key="Diego Rosales" textValue="DIEGO ROSALES">
            <p className="text-[11px]">DIEGO ROSALES</p>
          </SelectItem>
        </Select>

        <Select
          className="w-60"
          selectionMode="multiple"
          isRequired
          classNames={selectClassNames}
          labelPlacement="outside"
          label="Regimen"
          placeholder="..."
          variant="bordered"
          radius="sm"
          size="sm"
          selectedKeys={dataFiltros.regimen}
          onSelectionChange={(keys) =>
            setDataFiltros({ ...dataFiltros, regimen: keys })
          }
        >
          <SelectItem
            key="TRABAJADOR EN PLANILLA"
            textValue="TRABAJADOR EN PLANILLA"
          >
            <p className="text-[11px]">TRABAJADOR EN PLANILLA</p>
          </SelectItem>
          <SelectItem key="LOCADORES" textValue="LOCADORES">
            <p className="text-[11px]">LOCADORES</p>
          </SelectItem>
        </Select>
      </div>

      {/* Lado Derecho: Botón TXT */}
      <div>
        <Button
          color="primary"
          variant="shadow"
          size="sm"
          className="font-bold tracking-wide flex items-center gap-2"
          onPress={onOpen}
        >
          <FileText size={16} />
          TXT BCP
        </Button>
      </div>

      <ModalTxtPlanilla
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        colaboradores={colaboradores}
        selectDatosText={selectDatosText}
      />
    </section>
  );
};

export default FiltroResumenPlanilla;
