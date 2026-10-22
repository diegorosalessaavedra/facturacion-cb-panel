import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { selectClassNames } from "../../../../assets/classNames";

const FiltroPlanilla = ({
  yearPlanillas,
  selectYear,
  setSelectYear,
  mesesPlanillas,
  semanasPlanilla,
  selectMes,
  setSelectMes,
}) => {
  return (
    <section className="flex flex-col ">
      <div>
        <h2>Filtros</h2>
      </div>
      <div className="flex gap-4">
        <Select
          className="w-60"
          isRequired
          classNames={selectClassNames}
          labelPlacement="outside"
          label="Año"
          placeholder="..."
          variant="bordered"
          radius="sm"
          size="sm"
          // Solución 3: Controlar el componente para reflejar cambios externos
          selectedKeys={
            selectYear ? new Set([selectYear.toString()]) : new Set()
          }
          onChange={(e) => setSelectYear(e.target.value)}
        >
          {yearPlanillas.map((year) => (
            <SelectItem
              key={year.id.toString()}
              textValue={year.year?.toString()}
            >
              {year?.year}
            </SelectItem>
          ))}
        </Select>

        <Select
          className="w-60"
          isRequired
          classNames={selectClassNames}
          labelPlacement="outside"
          label="Mes"
          placeholder="..."
          variant="bordered"
          radius="sm"
          size="sm"
          selectedKeys={selectMes ? new Set([selectMes.toString()]) : new Set()}
          onChange={(e) => setSelectMes(e.target.value)}
        >
          {mesesPlanillas.map((mes) => (
            <SelectItem key={mes.id.toString()} textValue={mes.mes?.toString()}>
              {mes.mes}
            </SelectItem>
          ))}
        </Select>
      </div>
    </section>
  );
};

export default FiltroPlanilla;
