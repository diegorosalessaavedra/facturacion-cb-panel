import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../assets/classNames";
import axios from "axios";
import config from "../../../../utils/getToken";

const FiltrarColaboradores = ({
  dataFilter,
  setDataFilter,
  handleFindColaboradores,
}) => {
  const [cargoLaborales, setCargoLaborales] = useState([]);

  // Memoizar el handler del submit
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      handleFindColaboradores();
    },
    [handleFindColaboradores]
  );

  // Memoizar los handlers de onChange para evitar recreaciones
  const handleNombreNumeroDocChange = useCallback(
    (e) => {
      setDataFilter((prev) => ({ ...prev, nombreNumeroDoc: e.target.value }));
    },
    [setDataFilter]
  );

  // --- FIX: Corrected onChange for Select ---
  const handleCargoLaboralChange = useCallback(
    (value) => {
      // NextUI Select's onChange provides the value directly for single selection
      setDataFilter((prev) => ({ ...prev, cargoLaboral: value.target.value }));
    },
    [setDataFilter]
  );

  // Memoizar props que no cambian
  const inputProps = useMemo(
    () => ({
      labelPlacement: "outside",
      variant: "bordered",
      radius: "sm",
      size: "sm",
      classNames: inputClassNames,
      className: "w-60",
    }),
    []
  );

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
    <form onSubmit={handleSubmit} className="flex gap-2 px-2 items-end">
      <Input
        {...inputProps}
        value={dataFilter.nombreNumeroDoc}
        onChange={handleNombreNumeroDocChange}
        type="text"
        label="Nombre / DNI / TELEFONO"
        placeholder="..."
        size="sm"
      />
      {cargoLaborales.length > 0 && (
        <Select
          className="w-60"
          isRequired
          classNames={selectClassNames}
          labelPlacement="outside"
          label="Cargo laboral"
          placeholder="..."
          variant="bordered"
          selectedKeys={
            dataFilter.cargoLaboral ? [dataFilter.cargoLaboral] : ["todos"]
          }
          onChange={handleCargoLaboralChange}
          radius="sm"
          size="sm"
        >
          <SelectItem key="todos" value="todos">
            Todos
          </SelectItem>
          {cargoLaborales.map((cargoLaboral) => (
            <SelectItem key={cargoLaboral.id} value={cargoLaboral.id}>
              {cargoLaboral?.cargo}
            </SelectItem>
          ))}
        </Select>
      )}

      <Button color="primary" type="submit">
        Filtrar
      </Button>
    </form>
  );
};

export default FiltrarColaboradores;
