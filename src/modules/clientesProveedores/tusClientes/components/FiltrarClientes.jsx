import { useCallback, useMemo } from "react";
import { inputClassNames } from "../../../../assets/classNames";
import { Button, Input } from "@nextui-org/react";

const FiltrarClientes = ({ dataFilter, setDataFilter, findClients }) => {
  // Memoizar el handler del submit
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      findClients();
    },
    [findClients]
  );

  // Memoizar los handlers de onChange para evitar recreaciones
  const handleNumeroDocChange = useCallback(
    (e) => {
      setDataFilter((prev) => ({ ...prev, numeroDoc: e.target.value }));
    },
    [setDataFilter]
  );

  const handleNombreComercialChange = useCallback(
    (e) => {
      setDataFilter((prev) => ({ ...prev, nombreComercial: e.target.value }));
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
      className: "w-[100%] max-w-[300px]",
    }),
    []
  );

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 px-2 items-end">
      <Input
        {...inputProps}
        value={dataFilter.numeroDoc}
        onChange={handleNumeroDocChange}
        type="text"
        label="Número de Documento"
      />
      <Input
        {...inputProps}
        value={dataFilter.nombreComercial}
        onChange={handleNombreComercialChange}
        type="text"
        label="Nombre Comercial / Nombre Apellidos"
      />
      <Button color="primary" type="submit">
        Filtrar
      </Button>
    </form>
  );
};

export default FiltrarClientes;
