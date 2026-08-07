import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { selectClassNames } from "../../../../assets/classNames";

const FiltroResumenPlanilla = ({ dataFiltros, setDataFiltros }) => {
  return (
    <section className=" flex flex-col px-2 ">
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
    </section>
  );
};

export default FiltroResumenPlanilla;
