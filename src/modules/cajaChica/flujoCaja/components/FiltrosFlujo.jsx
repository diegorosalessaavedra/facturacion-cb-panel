import { motion } from "framer-motion";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../assets/classNames";
import { FiFileText } from "react-icons/fi";
import { Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { API } from "../../../../utils/api";
import config from "../../../../utils/getToken";
import axios from "axios";

const FiltrosFlujo = ({
  setDataFiltros,
  dataFiltros,
  handleFindTrabajadores,
  conceptos,
  categorias,
}) => {
  const [trabajadores, setTrabajadores] = useState([]);

  const handleFindTrabajadores2 = () => {
    const url = `${API}/caja-chica/trabajador`;
    axios
      .get(url, config)
      .then((res) => setTrabajadores(res.data.trabajadores))
      .catch((err) => handleAxiosError(err));
  };

  useEffect(() => {
    handleFindTrabajadores2();
  }, []);

  const months = [
    { value: "0", label: "ENERO" },
    { value: "1", label: "FEBRERO" },
    { value: "2", label: "MARZO" },
    { value: "3", label: "ABRIL" },
    { value: "4", label: "MAYO" },
    { value: "5", label: "JUNIO" },
    { value: "6", label: "JULIO" },
    { value: "7", label: "AGOSTO" },
    { value: "8", label: "SETIEMBRE" },
    { value: "9", label: "OCTUBRE" },
    { value: "10", label: "NOVIEMBRE" },
    { value: "11", label: "DICIEMBRE" },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDataFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submit = (e) => {
    e.preventDefault(); // CORREGIDO: Antes e.prevent()
    handleFindTrabajadores();
  };

  return (
    <form className="w-fit flex gap-2 items-end px-4 py-8" onSubmit={submit}>
      <motion.div
        className="flex gap-2 items-end"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
      >
        <motion.div variants={itemVariants} className="min-w-[250px]">
          <Select
            isRequired
            name="trabajador_id" // Usamos el name para la función genérica
            label="Trabajador"
            labelPlacement="outside"
            placeholder="Seleccionar..."
            variant="bordered"
            startContent={<User className="text-default-400" size={16} />}
            classNames={selectClassNames}
            onChange={handleInputChange}
            selectedKeys={
              dataFiltros?.trabajador_id
                ? [String(dataFiltros.trabajador_id)]
                : []
            }
            size="sm"
          >
            <SelectItem key="TODOS" value="TODOS" textValue="TODOS">
              <span className="text-xs">TODOS</span>
            </SelectItem>
            {trabajadores.map((t) => (
              <SelectItem
                key={t.id}
                value={t.id}
                textValue={t.nombre_trabajador}
              >
                <span className="text-xs">{t.nombre_trabajador}</span>
              </SelectItem>
            ))}
          </Select>
        </motion.div>

        <motion.div variants={itemVariants} className="min-w-[150px]">
          <Input
            isRequired
            name="year"
            type="date/year"
            label="Año"
            labelPlacement="outside"
            variant="bordered"
            classNames={inputClassNames}
            onChange={handleInputChange}
            value={dataFiltros?.year || ""}
            size="sm"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="min-w-[150px]">
          <Select
            isRequired
            name="mes"
            label="Mes"
            labelPlacement="outside"
            placeholder="Seleccionar..."
            variant="bordered"
            startContent={<User className="text-default-400" size={16} />}
            classNames={selectClassNames}
            onChange={handleInputChange}
            selectedKeys={dataFiltros?.mes ? [String(dataFiltros.mes)] : []}
            size="sm"
          >
            <SelectItem key="TODOS" value="TODOS" textValue="TODOS">
              <span className="text-xs">TODOS</span>
            </SelectItem>
            {months.map((t) => (
              <SelectItem key={t.value} value={t.value} textValue={t.label}>
                <span className="text-xs">{t.label}</span>
              </SelectItem>
            ))}
          </Select>
        </motion.div>
        <motion.div variants={itemVariants} className="min-w-[200px]">
          <Select
            isRequired
            name="concepto"
            label="Conceptos de Rendición"
            labelPlacement="outside"
            variant="bordered"
            startContent={<FiFileText className="text-default-400" size={16} />}
            classNames={selectClassNames}
            onChange={handleInputChange}
            selectedKeys={dataFiltros?.concepto ? [dataFiltros.concepto] : []}
            size="sm"
          >
            {" "}
            <SelectItem key="TODOS" value="TODOS" textValue="TODOS">
              <span className="text-xs">TODOS</span>
            </SelectItem>
            {conceptos.map((c) => (
              <SelectItem
                key={c.conceptos}
                value={c.conceptos}
                textValue={c.conceptos}
              >
                <span className="text-xs">{c.conceptos}</span>
              </SelectItem>
            ))}
          </Select>
        </motion.div>

        <motion.div variants={itemVariants} className="min-w-[200px]">
          <Select
            isRequired
            name="categoria"
            label="Categoría del Gasto"
            labelPlacement="outside"
            variant="bordered"
            startContent={<FiFileText className="text-default-400" size={16} />}
            classNames={selectClassNames}
            onChange={handleInputChange}
            selectedKeys={dataFiltros?.categoria ? [dataFiltros.categoria] : []}
            size="sm"
          >
            <SelectItem key="TODOS" value="TODOS" textValue="TODOS">
              <span className="text-xs">TODOS</span>
            </SelectItem>
            {categorias.map((c) => (
              <SelectItem key={c.categoria} textValue={c.categoria}>
                <span className="text-xs">{c.categoria}</span>
              </SelectItem>
            ))}
          </Select>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            className="bg-amber-400 text-black font-bold ml-4 shadow-md shadow-amber-400/20"
            startContent={<Search size={16} />}
            size="sm"
          >
            Filtrar
          </Button>
        </motion.div>
      </motion.div>
    </form>
  );
};

export default FiltrosFlujo;
