import React from "react";
import { Select, SelectItem, Button, useDisclosure } from "@nextui-org/react";
import { FileText } from "lucide-react";
import { selectClassNames } from "../../../../assets/classNames";
import ModalTxtPlanilla from "./ModalTxtPlanilla";

const FiltroResumenPlanilla = ({
  dataFiltros,
  setDataFiltros,
  colaboradores,
  selectDatosText,
  dataSemana,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // 1. Cálculos seguros para el total y la suma
  const totalSeleccionados = selectDatosText?.length || 0;
  
  const sumaTotal = (selectDatosText || []).reduce((acumulador, item) => {
    return acumulador + Number(item?.dataValidacionTxt?.monto || 0);
  }, 0);

  // Formateador de moneda para que se vea profesional (ej: S/ 1,500.00)
  const formatMoney = (monto) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(monto);
  };

  return (
    <section className="flex flex-wrap items-end justify-between px-2 w-full gap-4">
      {/* Lado Izquierdo: Filtros */}
      <div className="flex gap-4">
        <Select
          className="w-60"
          selectionMode="multiple"
          isRequired
          classNames={selectClassNames}
          labelPlacement="outside"
          label="Empresa"
          placeholder="..."
          variant="bordered"
          radius="sm"
          size="sm"
          selectedKeys={dataFiltros.empresa}
          onSelectionChange={(keys) =>
            setDataFiltros({ ...dataFiltros, empresa: keys })
          }
        >
          <SelectItem key="Granjas Peruanas" textValue="GRANJAS PERUANAS">
            <p className="text-[11px]">GRANJAS PERUANAS</p>
          </SelectItem>
          <SelectItem
            key="Multinacional Services"
            textValue="MULTINACIONAL SERVICES"
          >
            <p className="text-[11px]">MULTINACIONAL SERVICES</p>
          </SelectItem>
          <SelectItem key="Diego Rosales" textValue="DIEGO ROSALES">
            <p className="text-[11px]">DIEGO ROSALES</p>
          </SelectItem>
        </Select>

        <Select
          className="w-60"
          selectionMode="multiple"
          isRequired
          classNames={selectClassNames}
          labelPlacement="outside"
          label="Regimen"
          placeholder="..."
          variant="bordered"
          radius="sm"
          size="sm"
          selectedKeys={dataFiltros.regimen}
          onSelectionChange={(keys) =>
            setDataFiltros({ ...dataFiltros, regimen: keys })
          }
        >
          <SelectItem
            key="TRABAJADOR EN PLANILLA"
            textValue="TRABAJADOR EN PLANILLA"
          >
            <p className="text-[11px]">TRABAJADOR EN PLANILLA</p>
          </SelectItem>
          <SelectItem key="LOCADORES" textValue="LOCADORES">
            <p className="text-[11px]">LOCADORES</p>
          </SelectItem>
        </Select>
      </div>

      {/* Lado Derecho: Resumen y Botón TXT */}
      <div className="flex items-center gap-4">
        
        {/* Tarjeta de Resumen con Indicativos */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm h-[40px] overflow-hidden">
          {/* Indicativo de TOTAL */}
          <div className="flex items-center gap-1.5 px-3 border-r border-slate-200 bg-slate-50 h-full">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total:
            </span>
            <span className="text-xs font-extrabold text-slate-700">
              {totalSeleccionados}
            </span>
          </div>
          
          {/* Indicativo de MONTO */}
          <div className="flex items-center gap-1.5 px-3 h-full">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Monto:
            </span>
            <span className="text-xs font-extrabold text-emerald-600">
              {formatMoney(sumaTotal)}
            </span>
          </div>
        </div>

        {/* Botón TXT */}
        <Button
          color="primary"
          variant="shadow"
          size="sm"
          className="font-bold tracking-wide flex items-center gap-2 h-[35px]"
          onPress={onOpen}
          isDisabled={totalSeleccionados === 0} 
        >
          <FileText size={16} />
          TXT BCP
        </Button>
      </div>

      {/* Modal para generar TXT */}
      <ModalTxtPlanilla
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        colaboradores={colaboradores}
        selectDatosText={selectDatosText}
        dataSemana={dataSemana}
      />
    </section>
  );
};

export default FiltroResumenPlanilla;