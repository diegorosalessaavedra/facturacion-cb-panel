import { motion } from "framer-motion";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { PiUserFill } from "react-icons/pi";
import { FiFileText } from "react-icons/fi";
import { FileText, Search, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../assets/classNames";
import { onInputNumber } from "../../../../assets/onInputs";
import ExcelReporteDesembolsos from "../../../../utils/plantillasExel/ExcelReporteDesembolsos";

const FlitroDesembolso = ({
  dataFiltros,
  setdataFiltros,
  handleFindDsembolsos,
  conceptos,
  desembolsos = [],
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleExportar = () => {
    if (!desembolsos || desembolsos.length === 0) {
      toast.error("No hay datos para exportar.");
      return;
    }
    try {
      ExcelReporteDesembolsos.exportToExcel(desembolsos);
      toast.success("Excel generado correctamente.");
    } catch (error) {
      toast.error("Hubo un error al exportar la tabla.");
    }
  };

  return (
    // 1. Contenedor principal con w-full y justify-between
    <section className="w-full flex flex-wrap xl:flex-nowrap justify-between items-end gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      {/* 2. Contenedor izquierdo: Filtros y Botón de Buscar */}
      <div className="flex flex-wrap items-end gap-3 flex-1">
        <motion.div
          variants={itemVariants}
          className="min-w-[250px] flex-1 lg:flex-none"
        >
          <Input
            type="text"
            labelPlacement="outside"
            label="Nombre del Colaborador"
            variant="bordered"
            startContent={<PiUserFill className="text-slate-400" size={16} />}
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

        <motion.div variants={itemVariants} className="w-[140px]">
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
        </motion.div>

        <motion.div variants={itemVariants} className="w-[140px]">
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

        <motion.div variants={itemVariants} className="w-[160px]">
          <Select
            label="Concepto de Rendición"
            labelPlacement="outside"
            variant="bordered"
            startContent={<FileText className="text-slate-400" size={16} />}
            classNames={selectClassNames}
            onChange={(e) =>
              setdataFiltros((prev) => ({
                ...prev,
                motivo: e.target.value,
              }))
            }
            selectedKeys={[dataFiltros?.motivo || "TODOS"]}
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

        <motion.div variants={itemVariants} className="w-[160px]">
          <Select
            label="Estado de Desembolso"
            labelPlacement="outside"
            variant="bordered"
            startContent={<FiFileText className="text-slate-400" size={16} />}
            classNames={selectClassNames}
            onChange={(e) =>
              setdataFiltros((prev) => ({
                ...prev,
                estado: e.target.value,
              }))
            }
            selectedKeys={[dataFiltros?.estado || "TODOS"]}
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

        <motion.div variants={itemVariants} className="w-[100px]">
          <Input
            type="text"
            labelPlacement="outside"
            label="Demora Max."
            placeholder="Días"
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

        <motion.div variants={itemVariants}>
          <Button
            className="bg-slate-900 text-white font-semibold shadow-md hover:bg-slate-800 transition-colors"
            startContent={<Search size={16} />}
            onPress={handleFindDsembolsos}
            size="md"
          >
            Filtrar
          </Button>
        </motion.div>
      </div>

      {/* 3. Contenedor derecho: Botón de Excel */}
      <motion.div variants={itemVariants} className="flex-shrink-0">
        <Button
          className="bg-green-600 text-white font-bold shadow-md shadow-green-600/20 hover:bg-green-700 transition-colors"
          startContent={<FileSpreadsheet size={18} />}
          onPress={handleExportar}
          size="md"
        >
          Exportar a Excel
        </Button>
      </motion.div>
    </section>
  );
};

export default FlitroDesembolso;
