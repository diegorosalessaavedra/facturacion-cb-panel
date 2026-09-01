import { motion } from "framer-motion";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { PiUserFill } from "react-icons/pi";
import { FiFileText } from "react-icons/fi";
import { Search, FileSpreadsheet } from "lucide-react"; // Cambié Excel por FileSpreadsheet
import { toast } from "sonner";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../assets/classNames";
import ExcelReporteAperturas from "../../../../utils/plantillasExel/ExcelReporteAperturas";

// Asegúrate de importar tu función generadora de Excel

const FlitroApertura = ({
  dataFiltros,
  setdataFiltros,
  handleFindAperturas,
  aperturas = [],
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleExportar = () => {
    if (!aperturas || aperturas.length === 0) {
      toast.error("No hay datos para exportar.");
      return;
    }
    try {
      ExcelReporteAperturas.exportToExcel(aperturas);
      toast.success("Excel generado correctamente.");
    } catch (error) {
      toast.error("Hubo un error al exportar la tabla.");
    }
  };

  return (
    // 1. w-full y justify-between para separar los filtros del botón de Excel
    <section className="w-full flex flex-wrap xl:flex-nowrap justify-between items-end gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      {/* 2. Contenedor izquierdo: Filtros y Botón de Búsqueda */}
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
            isRequired
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
            isRequired
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
            isRequired
            size="sm"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="w-[160px]">
          <Select
            label="Motivo de Apertura"
            labelPlacement="outside"
            variant="bordered"
            startContent={<FiFileText className="text-slate-400" size={16} />}
            classNames={selectClassNames}
            onChange={(e) =>
              setdataFiltros((prev) => ({
                ...prev,
                motivo_apertura: e.target.value,
              }))
            }
            selectedKeys={[dataFiltros?.motivo_apertura || "TODOS"]}
            isRequired
            size="sm"
          >
            <SelectItem key="TODOS" value="TODOS">
              TODOS
            </SelectItem>
            <SelectItem key="REPOSICIÓN" value="REPOSICIÓN">
              REPOSICIÓN
            </SelectItem>
            <SelectItem key="DEVOLUCIÓN" value="DEVOLUCIÓN">
              DEVOLUCIÓN
            </SelectItem>
            <SelectItem key="COBRO CLIENTE" value="COBRO CLIENTE">
              COBRO CLIENTE
            </SelectItem>
          </Select>
        </motion.div>

        <motion.div variants={itemVariants} className="w-[150px]">
          <Select
            label="Estado"
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
            isRequired
            size="sm"
          >
            <SelectItem key="TODOS" value="TODOS">
              TODOS
            </SelectItem>
            <SelectItem key="APERTURADO" value="APERTURADO">
              APERTURADO
            </SelectItem>
            <SelectItem key="ANULADO" value="ANULADO">
              ANULADO
            </SelectItem>
          </Select>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            className="bg-slate-900 text-white font-semibold shadow-md hover:bg-slate-800 transition-colors"
            startContent={<Search size={16} />}
            onPress={handleFindAperturas}
            size="md"
          >
            Filtrar
          </Button>
        </motion.div>
      </div>

      {/* 3. Contenedor derecho: Botón de Excel empujado a la derecha */}
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

export default FlitroApertura;
