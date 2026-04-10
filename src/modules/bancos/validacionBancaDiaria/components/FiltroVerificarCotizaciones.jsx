import axios from "axios";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../assets/classNames";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import config from "../../../../utils/getToken";
import { API } from "../../../../utils/api";

const FiltroVerificarCotizaciones = ({
  filtros,
  handleChangeFiltro,
  handleFindCotizaciones,
}) => {
  const [vendedores, setVendedores] = useState([]);

  const findvendedores = () => {
    const url = `${API}/ajustes/encargado?cargo=Vendedor`;

    axios.get(url, config).then((res) => setVendedores(res.data.encargados));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFindCotizaciones();
  };

  useEffect(() => {
    findvendedores();
  }, []);

  return (
    <motion.form
      layout
      onSubmit={handleSubmit}
      className="w-full bg-white py-3 border-b-1 border-slate-200 flex gap-3 items-end flex-wrap z-10 relative"
    >
      <Select
        isRequired
        className="min-w-60 max-w-[300px]"
        labelPlacement="outside"
        label="Vendedor"
        selectedKeys={[filtros.vendedor]}
        onChange={(e) => handleChangeFiltro("vendedor", e.target.value)}
        variant="bordered"
        radius="sm"
        size="sm"
        classNames={selectClassNames}
      >
        <SelectItem key="Todos" value="Todos" textValue="Todos">
          Todos
        </SelectItem>
        {vendedores.map((vendedor) => (
          <SelectItem
            key={vendedor.nombre}
            value={vendedor.nombre}
            textValue={vendedor.nombre}
          >
            {vendedor.nombre}
          </SelectItem>
        ))}
      </Select>
      <motion.div layout className="flex gap-3 w-full sm:w-auto">
        <Input
          className="w-full sm:max-w-[180px]"
          classNames={inputClassNames}
          value={filtros.fecha_inicio}
          onChange={(e) => handleChangeFiltro("fecha_inicio", e.target.value)}
          labelPlacement="outside"
          type="date"
          variant="bordered"
          label="Fecha inicial"
          radius="sm"
          size="sm"
        />
        <Input
          className="w-full sm:max-w-[180px]"
          classNames={inputClassNames}
          value={filtros.fecha_final}
          onChange={(e) => handleChangeFiltro("fecha_final", e.target.value)}
          labelPlacement="outside"
          type="date"
          variant="bordered"
          label="Fecha final"
          radius="sm"
          size="sm"
        />
      </motion.div>

      {/* Selectores de Estado Condicionales */}
      <motion.div layout className="w-full sm:max-w-[160px] flex-1">
        <Select
          label="Estado de pagos"
          labelPlacement="outside"
          variant="bordered"
          radius="sm"
          size="sm"
          selectedKeys={[filtros.estado_pago]}
          onChange={(e) => handleChangeFiltro("estado_pago", e.target.value)}
          classNames={selectClassNames}
        >
          <SelectItem key="Todos">Todos</SelectItem>
          <SelectItem key="Conforme">Validados</SelectItem>
          <SelectItem key="Observados">Observados</SelectItem>
          <SelectItem key="Rechazados">Rechazados</SelectItem>
        </Select>
      </motion.div>

      <motion.div layout>
        <Button
          color="primary"
          type="submit"
          radius="sm"
          className="font-medium bg-slate-900 shadow-sm shadow-slate-900/30"
          startContent={<FiSearch className="text-lg" />}
        >
          Buscar
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default FiltroVerificarCotizaciones;
