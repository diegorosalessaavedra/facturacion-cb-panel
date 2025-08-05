import { Input, Select, SelectItem } from "@nextui-org/react";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../../../assets/classNames";
import { useEffect, useState } from "react";
import config from "../../../../../../utils/getToken";
import axios from "axios";

const EducacionCargoLaboral = ({ register }) => {
  const [cargoLaborales, setCargoLaborales] = useState([]);

  const handleFindCargoLaboral = () => {
    const url = `${import.meta.env.VITE_URL_API}/rrhh/cargo-laboral`;

    axios.get(url, config).then((res) => {
      setCargoLaborales(res.data.cargoLaborales);
    });
  };

  useEffect(() => {
    handleFindCargoLaboral();
  }, []);

  return (
    <div className="w-full flex flex-col gap-2 border-b-2 border-neutral-300 pb-4">
      <div className="w-full flex flex-col gap-2  pb-2">
        <h3 className="font-semibold text-sm text-neutral-900">
          Cargo laboral:
        </h3>
        <div className="w-full flex gap-2">
          <Select
            className="w-full"
            isRequired
            classNames={{
              ...selectClassNames,
            }}
            labelPlacement="outside"
            label="Cargo laboral"
            placeholder="..."
            variant="bordered"
            {...register("cargo_laboral_id")}
            errorMessage="El  cargo laboral  es obligatorio."
            radius="sm"
            size="sm"
          >
            {cargoLaborales.map((cargoLaboral) => (
              <SelectItem key={cargoLaboral.id} value={cargoLaboral.id}>
                {cargoLaboral?.cargo}
              </SelectItem>
            ))}
          </Select>
          <Input
            className="w-full"
            classNames={inputClassNames}
            labelPlacement="outside"
            type="file"
            variant="bordered"
            label="Cargar cv"
            placeholder="..."
            {...register("cv_colaborador")}
            radius="sm"
            size="sm"
            errorMessage="El cv del colaborador  es obligatorio."
          />
        </div>
      </div>
    </div>
  );
};

export default EducacionCargoLaboral;
