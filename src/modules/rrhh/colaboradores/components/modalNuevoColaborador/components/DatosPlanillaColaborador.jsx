import { Input, Select, SelectItem } from "@nextui-org/react";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../../../assets/classNames";
import { useEffect, useState } from "react";
import config from "../../../../../../utils/getToken";
import axios from "axios";
import { onInputNumber } from "../../../../../../assets/onInputs";

const DatosPlanillaColaborador = ({ register }) => {
  return (
    <div className="w-full flex flex-col gap-2 border-b-2 border-neutral-300 pb-4">
      <div className="w-full flex flex-col gap-4 pb-2">
        <h3 className="font-semibold text-sm text-neutral-900">
          Datos Planilla:
        </h3>

        {/* Fila 1: Régimen y Asignación Familiar */}
        <div className="w-full flex gap-2">
          <Select
            className="w-full"
            isRequired
            classNames={{
              ...selectClassNames,
            }}
            labelPlacement="outside"
            label="Régimen"
            placeholder="..."
            variant="bordered"
            {...register("regimen")}
            radius="sm"
            size="sm"
          >
            <SelectItem
              key="TRABAJADOR EN PLANILLA"
              value="TRABAJADOR EN PLANILLA"
            >
              TRABAJADOR EN PLANILLA
            </SelectItem>
            <SelectItem key="LOCADORES" value="LOCADORES">
              LOCADORES
            </SelectItem>
          </Select>
          <Input
            className="w-full"
            classNames={inputClassNames}
            labelPlacement="outside"
            type="text"
            variant="bordered"
            label="Asignación Familiar"
            placeholder="..."
            {...register("asignacion_familiar")}
            radius="sm"
            size="sm"
            onInput={onInputNumber}
          />
          <Input
            className="w-full"
            classNames={inputClassNames}
            labelPlacement="outside"
            type="text"
            variant="bordered"
            label="AFP Integra"
            placeholder="..."
            {...register("afp_integra")}
            radius="sm"
            size="sm"
            onInput={onInputNumber}
          />
        </div>

        {/* Fila 2: AFP Integra, Prima y Profuturo */}
        <div className="w-full flex gap-2">
          <Input
            className="w-full"
            classNames={inputClassNames}
            labelPlacement="outside"
            type="text"
            variant="bordered"
            label="AFP Prima"
            placeholder="..."
            {...register("afp_prima")}
            radius="sm"
            size="sm"
            onInput={onInputPrice}
          />
          <Input
            className="w-full"
            classNames={inputClassNames}
            labelPlacement="outside"
            type="text"
            variant="bordered"
            label="AFP Profuturo"
            placeholder="..."
            {...register("afp_profuturo")}
            radius="sm"
            size="sm"
            onInput={onInputPrice}
          />
          <Input
            className="w-full"
            classNames={inputClassNames}
            labelPlacement="outside"
            type="text"
            variant="bordered"
            label="AFP Habitat"
            placeholder="..."
            {...register("afp_habitat")}
            radius="sm"
            size="sm"
            onInput={onInputPrice}
          />
        </div>

        {/* Fila 3: AFP Habitat y ONP */}
        <div className="w-full flex gap-2">
          <Input
            className="w-full"
            classNames={inputClassNames}
            labelPlacement="outside"
            type="text"
            variant="bordered"
            label="ONP"
            placeholder="..."
            {...register("onp")}
            radius="sm"
            size="sm"
            onInput={onInputPrice}
          />
          <Input
            className="w-full"
            classNames={inputClassNames}
            labelPlacement="outside"
            type="text"
            variant="bordered"
            label="Banco"
            placeholder="Ej. BCP, BBVA, Interbank..."
            {...register("bco")}
            radius="sm"
            size="sm"
          />
          <Input
            className="w-full"
            classNames={inputClassNames}
            labelPlacement="outside"
            type="text"
            variant="bordered"
            label="Nro. Cuenta"
            placeholder="..."
            {...register("nro_cuenta")}
            radius="sm"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
};

export default DatosPlanillaColaborador;
