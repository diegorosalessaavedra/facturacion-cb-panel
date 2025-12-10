import { useCallback, useMemo } from "react";
import { inputClassNames } from "../../../../assets/classNames";
import { Button, Input } from "@nextui-org/react";

const FiltrarAgencias = ({ dataFilter, setDataFilter, findAgencias }) => {
  // Memoizar el handler del submit
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      findAgencias();
    },
    [findAgencias]
  );

  // Memoizar los handlers de onChange para evitar recreaciones
  const handleNumeroDocChange = useCallback(
    (e) => {
      setDataFilter((prev) => ({ ...prev, numeroDoc: e.target.value }));
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
        value={dataFilter.nombre_agencia}
        onChange={handleNumeroDocChange}
        type="text"
        label="Nombre Agencias"
      />

      <Button color="primary" type="submit">
        Buscar
      </Button>
    </form>
  );
};

export default FiltrarAgencias;
