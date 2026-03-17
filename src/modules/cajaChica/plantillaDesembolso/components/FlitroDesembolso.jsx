import { motion } from "framer-motion";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { PiUserFill } from "react-icons/pi";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../assets/classNames";
import { FiFileText } from "react-icons/fi";
import { FileText, Search } from "lucide-react";
import { onInputNumber } from "../../../../assets/onInputs";

const FlitroDesembolso = ({
  dataFiltros,
  setdataFiltros,
  handleFindDsembolsos,
  conceptos,
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <section className="w-fit flex gap-2 items-end">
      <motion.div variants={itemVariants} className="min-w-[250px]">
        <Input
          type="text"
          labelPlacement="outside"
          label="Nombre del Trabajador"
          variant="bordered"
          startContent={<PiUserFill className="text-default-400" size={16} />}
          classNames={inputClassNames}
          onChange={(e) =>
            setdataFiltros((prev) => ({
              ...prev,
              nombre: e.target.value,
            }))
          }
          value={dataFiltros?.nombre}
          size="sm"
        />
      </motion.div>
      <motion.div variants={itemVariants} className="min-w-[150px]">
        <Input
          type="date"
          labelPlacement="outside"
          label="Fecha Inicio"
          variant="bordered"
          classNames={inputClassNames}
          onChange={(e) =>
            setdataFiltros((prev) => ({
              ...prev,
              fecha_inicio: e.target.value,
            }))
          }
          value={dataFiltros?.fecha_inicio}
          size="sm"
        />
      </motion.div>{" "}
      <motion.div variants={itemVariants} className="min-w-[150px]">
        <Input
          type="date"
          labelPlacement="outside"
          label="Fecha Final"
          variant="bordered"
          classNames={inputClassNames}
          onChange={(e) =>
            setdataFiltros((prev) => ({
              ...prev,
              fecha_final: e.target.value,
            }))
          }
          value={dataFiltros?.fecha_final}
          size="sm"
        />
      </motion.div>
      <motion.div variants={itemVariants} className="min-w-[150px]">
        <Select
          label="Concepto Rendición"
          labelPlacement="outside"
          variant="bordered"
          startContent={<FileText className="text-default-400" size={16} />}
          classNames={selectClassNames}
          onChange={(e) =>
            setdataFiltros((prev) => ({
              ...prev,
              motivo: e.target.value,
            }))
          }
          selectedKeys={[dataFiltros?.motivo]}
          size="sm"
        >
          <SelectItem key="TODOS" textValue="TODOS">
            <p className="text-xs">TODOS</p>
          </SelectItem>
          {conceptos?.map((c) => (
            <SelectItem key={c.conceptos} textValue={c.conceptos}>
              <p className="text-xs">{c.conceptos}</p>
            </SelectItem>
          ))}
        </Select>
      </motion.div>
      <motion.div variants={itemVariants} className="min-w-[150px]">
        <Select
          label="Estado Desembolso"
          labelPlacement="outside"
          variant="bordered"
          startContent={<FiFileText className="text-default-400" size={16} />}
          classNames={selectClassNames}
          onChange={(e) =>
            setdataFiltros((prev) => ({
              ...prev,
              estado: e.target.value,
            }))
          }
          selectedKeys={[dataFiltros?.estado]}
          size="sm"
        >
          <SelectItem key="TODOS" value="TODOS">
            TODOS
          </SelectItem>
          <SelectItem key="POR RENDIR" value="POR RENDIR">
            POR RENDIR
          </SelectItem>
          <SelectItem key="RENDIDO" value="RENDIDO">
            RENDIDO
          </SelectItem>
          <SelectItem key="ANULADO" value="ANULADO">
            ANULADO
          </SelectItem>
        </Select>
      </motion.div>
      <motion.div variants={itemVariants} className="min-w-[50px]">
        <Input
          type="text"
          labelPlacement="outside"
          label="Demora Días Max."
          variant="bordered"
          classNames={inputClassNames}
          onChange={(e) =>
            setdataFiltros((prev) => ({
              ...prev,
              demora_dias: e.target.value,
            }))
          }
          value={dataFiltros?.demora_dias}
          onInput={onInputNumber}
          size="sm"
        />
      </motion.div>
      <Button
        className="bg-amber-400 text-black font-bold ml-2 shadow-xs shadow-amber-400"
        startContent={<Search size={16} />}
        onPress={handleFindDsembolsos}
      >
        Filtrar
      </Button>
    </section>
  );
};

export default FlitroDesembolso;
