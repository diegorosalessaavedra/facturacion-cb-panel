import { useCallback, useMemo } from "react";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../assets/classNames";
import { Button, Input, Select, SelectItem } from "@nextui-org/react"; // <-- Importar Select

const FiltrarClientes = ({ dataFilter, setDataFilter, findClients }) => {
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      findClients();
    },
    [findClients],
  );

  const handleNumeroDocChange = useCallback(
    (e) => {
      setDataFilter((prev) => ({ ...prev, numeroDoc: e.target.value }));
    },
    [setDataFilter],
  );

  const handleNombreComercialChange = useCallback(
    (e) => {
      setDataFilter((prev) => ({ ...prev, nombreComercial: e.target.value }));
    },
    [setDataFilter],
  );

  // <-- Nuevo handler para el Select de crédito
  const handlePermisoCreditoChange = useCallback(
    (e) => {
      setDataFilter((prev) => ({ ...prev, permiso_credito: e.target.value }));
    },
    [setDataFilter],
  );

  const inputProps = useMemo(
    () => ({
      labelPlacement: "outside",
      variant: "bordered",
      radius: "sm",
      size: "sm",
      classNames: inputClassNames,
    }),
    [],
  );

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 px-2 items-end">
      <Input
        {...inputProps}
        className="w-[100%] max-w-[200px]"
        value={dataFilter.numeroDoc}
        onChange={handleNumeroDocChange}
        type="text"
        label="Número de Documento"
      />
      <Input
        {...inputProps}
        className="w-[100%] max-w-[250px]"
        value={dataFilter.nombreComercial}
        onChange={handleNombreComercialChange}
        type="text"
        label="Nombre Comercial / Apellidos"
      />

      {/* <-- Nuevo Select para filtrar por crédito */}
      <Select
        labelPlacement="outside"
        variant="bordered"
        radius="sm"
        size="sm"
        className="w-[100%] max-w-[150px]"
        label="Crédito"
        selectedKeys={[dataFilter.permiso_credito]}
        onChange={handlePermisoCreditoChange}
        classNames={selectClassNames}
      >
        <SelectItem key="todos" value="todos">
          Todos
        </SelectItem>
        <SelectItem key="true" value="true">
          Habilitado
        </SelectItem>
        <SelectItem key="false" value="false">
          Deshabilitado{" "}
        </SelectItem>
      </Select>

      <Button className="bg-slate-900" color="primary" type="submit">
        Buscar
      </Button>
    </form>
  );
};

export default FiltrarClientes;
