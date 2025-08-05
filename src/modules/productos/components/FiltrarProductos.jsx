import { selectClassNames } from "../../../assets/classNames";
import { Button, Select, SelectItem } from "@nextui-org/react";

const FiltrarProductos = ({
  selectStatus,
  setSelectStatus,
  handleFindProductos,
}) => {
  const handleSelectStatus = (e) => {
    setSelectStatus(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFindProductos();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 px-2 items-end">
      <Select
        className="w-[100%] max-w-[300px]"
        label="Filtrar por estado: "
        labelPlacement="outside"
        variant="bordered"
        selectedKeys={[selectStatus]}
        radius="sm"
        size="sm"
        onChange={handleSelectStatus}
        classNames={selectClassNames}
      >
        <SelectItem key="Activo" textValue="Activo">
          Activo
        </SelectItem>
        <SelectItem key="Inactivo" textValue="Inactivo">
          Inactivo
        </SelectItem>
        <SelectItem key="Todos" textValue="Todos">
          Todos
        </SelectItem>
      </Select>

      <Button color="primary" type="submit">
        Filtrar
      </Button>
    </form>
  );
};

export default FiltrarProductos;
