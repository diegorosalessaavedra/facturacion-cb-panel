import { Input } from "@nextui-org/react";
import React, { useEffect } from "react";
import { inputClassNames } from "../../../../../assets/classNames";

const CamposDetracciones = ({ detraccion, setDetraccion, productos }) => {
  // Auto-calcular el monto si cambia el porcentaje o los productos
  useEffect(() => {
    // 1. Protección contra estados iniciales undefined o nulos
    if (!productos || !detraccion) return;

    const totalOrden = productos.reduce(
      (sum, p) => sum + Number(p.total || 0),
      0,
    );
    const porcentaje = parseFloat(detraccion.porcentaje_detraccion);

    if (!isNaN(porcentaje) && porcentaje >= 0) {
      const nuevoMonto = Math.round(totalOrden * (porcentaje / 100));
      // Comparamos numéricamente para evitar bucles de renderizado
      if (nuevoMonto !== Number(detraccion.monto_detraccion)) {
        setDetraccion((prev) => ({ ...prev, monto_detraccion: nuevoMonto }));
      }
    } else {
      if (
        detraccion.monto_detraccion !== "" &&
        detraccion.monto_detraccion !== 0
      ) {
        setDetraccion((prev) => ({ ...prev, monto_detraccion: "" }));
      }
    }
  }, [detraccion?.porcentaje_detraccion, productos, setDetraccion]);

  const handleInputChange = (field, value) => {
    setDetraccion((prev) => ({ ...prev, [field]: value }));
  };

  // 2. Formatear la fecha para que funcione en Edit Mode
  // Si viene con formato "T00:00...", lo cortamos a "YYYY-MM-DD"
  const fechaFormateada = detraccion?.fecha_detraccion
    ? detraccion.fecha_detraccion.split("T")[0]
    : "";

  return (
    <div className="w-full flex flex-col border border-amber-200 rounded-lg shadow-sm overflow-hidden mt-2">
      {/* Cabecera */}
      <div className="w-full bg-slate-900 flex py-2.5 px-4 gap-4 items-center justify-between border-b border-amber-200">
        <span className="flex-1 font-semibold text-[13px] text-slate-50 ">
          Código Detracción
        </span>
        <span className="flex-1 font-semibold text-[13px] text-slate-50 ">
          Fecha Detracción
        </span>
        <span className="flex-1 font-semibold text-[13px] text-slate-50 ">
          Porcentaje (%)
        </span>
        <span className="flex-1 font-semibold text-[13px] text-slate-50 ">
          Monto (S/)
        </span>
      </div>

      {/* Fila de Inputs */}
      <div className="w-full bg-white flex py-4 px-4 gap-4 items-center justify-between">
        <Input
          className="flex-1"
          // 3. Fallback || "" para evitar errores si el backend devuelve null
          value={detraccion?.codigo_detraccion || ""}
          onChange={(e) =>
            handleInputChange("codigo_detraccion", e.target.value)
          }
          type="text"
          placeholder="Ej: 020"
          variant="bordered"
          color="warning"
          radius="sm"
          size="sm"
          aria-label="Código Detracción"
          classNames={inputClassNames}
        />

        <Input
          className="flex-1"
          value={fechaFormateada}
          onChange={(e) =>
            handleInputChange("fecha_detraccion", e.target.value)
          }
          type="date"
          variant="bordered"
          color="warning"
          radius="sm"
          size="sm"
          aria-label="Fecha Detracción"
          classNames={inputClassNames}
        />

        <Input
          className="flex-1"
          value={detraccion?.porcentaje_detraccion || ""}
          onChange={(e) =>
            handleInputChange("porcentaje_detraccion", e.target.value)
          }
          type="text"
          placeholder="0"
          variant="bordered"
          color="warning"
          radius="sm"
          size="sm"
          endContent={
            <span className="text-slate-400 font-bold text-sm">%</span>
          }
          aria-label="Porcentaje Detracción"
          classNames={inputClassNames}
        />

        <Input
          className="flex-1"
          value={detraccion?.monto_detraccion || ""}
          readOnly
          type="text"
          placeholder="S/ 0.00"
          variant="bordered"
          radius="sm"
          size="sm"
          aria-label="Monto Detracción"
          classNames={inputClassNames}
        />
      </div>
    </div>
  );
};

export default CamposDetracciones;
