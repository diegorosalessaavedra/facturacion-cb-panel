import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@nextui-org/react";
import { numberPeru, onInputNumber } from "../../../../assets/onInputs";

const TIPOS_COMPROBANTE = [
  { value: "SIN SUSTENTO", label: "SIN SUSTENTO" },
  { value: "FACTURA", label: "FACTURA" },
  { value: "BOLETA", label: "BOLETA" },
];

const TablaRendicion = ({
  datosRendicion = [],
  setDatosRendicion,
  montoRendicion,
  categorias,
  setSelectCategoria,
}) => {
  const rows = datosRendicion;
  const setRows = setDatosRendicion;

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        fecha_uso: "",
        razon_social: "",
        ruc: "",
        fecha_emision: "",
        tipo_comprobante: "FACTURA",
        numero_comprobante: "",
        categoria: "",
        detalle: "",
        importe: "",
        observacion: "",
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);

    const findSelect = categorias.find((c) => c.categoria === value);
    setSelectCategoria(findSelect);
  };

  const stickyHeader = "sticky top-0 z-20";
  const stickySubHeader = "sticky top-[30px] z-20";

  const headerBase =
    "flex items-center justify-center font-bold text-[9px] uppercase tracking-wider py-2 px-1 text-center border-r border-b border-slate-400";

  const headerDark = `${headerBase} bg-slate-900 text-white`;

  const cellBase =
    "flex items-center justify-center text-[11px] border-r border-b border-slate-300 h-[40px] relative group";
  const cellInput = `${cellBase} bg-white hover: p-0`;

  const inputClass =
    "w-full h-full bg-transparent border-none outline-none text-center px-1 text-slate-700 font-medium text-[11px] focus:bg-blue-50 focus:ring-2 focus:ring-inset focus:ring-blue-500/50 transition-all";

  const totalGastos = rows
    .reduce((acc, item) => acc + (Number(item.importe) || 0), 0)
    .toFixed(2);

  const porReembolsar = totalGastos - montoRendicion;
  const porDevolver = montoRendicion - totalGastos;

  return (
    <div className="relative w-full h-full flex flex-col gap-2">
      <div className="flex-1 w-full overflow-auto shadow-md rounded-lg bg-white relative border border-slate-300">
        <div
          className="grid"
          style={{
            minWidth: "1600px",

            gridTemplateColumns:
              "40px 90px 1fr 100px 90px 110px 100px 140px 1fr 90px 150px 40px",
            gridAutoRows: "max-content",
          }}
        >
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>N°</div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            FECHA DE USO <br /> DE DINERO
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            RAZÓN SOCIAL DEL PROVEEDOR
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            RUC <br /> PROVEEDOR
          </div>

          <div
            className={`col-span-3 ${headerDark} ${stickyHeader} border-b-0`}
          >
            COMPROBANTE
          </div>

          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            CATEGORIA DEL GASTO
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            DETALLE DEL GASTO
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            IMPORTE S/
          </div>
          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}>
            OBSERVACIÓN
          </div>

          <div className={`row-span-2 ${headerDark} ${stickyHeader}`}></div>

          <div className={`${headerDark} ${stickySubHeader} `}>
            FECHA DE <br /> EMISIÓN CP
          </div>
          <div className={`${headerDark} ${stickySubHeader} `}>
            TIPO <br /> COMPROB.
          </div>
          <div className={`${headerDark} ${stickySubHeader} `}>
            NÚMERO <br /> COMP.
          </div>

          {rows.map((item, index) => (
            <React.Fragment key={index}>
              <div className={`${cellBase}font-bold text-slate-500`}>
                {index + 1}
              </div>

              <div className={cellInput}>
                <input
                  required
                  type="date"
                  className={inputClass}
                  value={item.fecha_uso}
                  onChange={(e) =>
                    handleChange(index, "fecha_uso", e.target.value)
                  }
                />
              </div>

              <div className={cellInput}>
                <input
                  required
                  type="text"
                  className={`${inputClass} text-left pl-2`}
                  placeholder="Ingrese proveedor..."
                  value={item.razon_social}
                  onChange={(e) =>
                    handleChange(index, "razon_social", e.target.value)
                  }
                />
              </div>

              <div className={cellInput}>
                <input
                  required
                  type="text"
                  maxLength={13}
                  className={inputClass}
                  placeholder="RUC"
                  value={item.ruc}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    handleChange(index, "ruc", val);
                  }}
                />
              </div>

              <div className={cellInput}>
                <input
                  required
                  type="date"
                  className={inputClass}
                  value={item.fecha_emision}
                  onChange={(e) =>
                    handleChange(index, "fecha_emision", e.target.value)
                  }
                />
              </div>

              <div className={cellInput}>
                <select
                  required
                  className={`${inputClass} text-[10px] appearance-none cursor-pointer`}
                  value={item.tipo_comprobante}
                  onChange={(e) =>
                    handleChange(index, "tipo_comprobante", e.target.value)
                  }
                >
                  {TIPOS_COMPROBANTE.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={cellInput}>
                <input
                  required
                  type="text"
                  className={inputClass}
                  placeholder="Ej: F001-123"
                  value={item.numero_comprobante}
                  onChange={(e) =>
                    handleChange(index, "numero_comprobante", e.target.value)
                  }
                />
              </div>

              <div className={cellInput}>
                <select
                  required
                  className={`${inputClass} text-[10px] appearance-none cursor-pointer`}
                  value={item.categoria}
                  onChange={(e) =>
                    handleChange(index, "categoria", e.target.value)
                  }
                >
                  {categorias.map((opt) => (
                    <option key={opt.categoria} value={opt.categoria}>
                      {opt.categoria}
                    </option>
                  ))}
                </select>
              </div>

              <div className={cellInput}>
                <input
                  required
                  type="text"
                  className={`${inputClass} text-left pl-2`}
                  placeholder="Descripción del gasto"
                  categoria={item.detalle}
                  onChange={(e) =>
                    handleChange(index, "detalle", e.target.value)
                  }
                />
              </div>

              <div className={cellInput}>
                <span className="text-slate-400 text-[10px] mr-1">S/</span>
                <input
                  required
                  type="text"
                  className={`${inputClass} text-right pr-2 font-bold`}
                  placeholder="0.00"
                  value={item.importe}
                  onChange={(e) =>
                    handleChange(index, "importe", e.target.value)
                  }
                  onInput={onInputNumber}
                />
              </div>

              <div className={cellInput}>
                <input
                  required
                  type="text"
                  className={`${inputClass} text-left pl-2`}
                  value={item.observacion}
                  onChange={(e) =>
                    handleChange(index, "observacion", e.target.value)
                  }
                  placeholder="Colocar Ruta"
                />
              </div>

              <div className={`${cellBase} bg-white`}>
                <button
                  onClick={() => handleRemoveRow(index)}
                  className="text-red-400 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <Button
        onPress={handleAddRow}
        className="absolute w-fit -top-9 left-0 flex items-center bg-slate-900 text-white font-bold"
        size="sm"
      >
        <Plus size={16} />
        Agregar Fila
      </Button>
      <div className="flex gap-6 justify-end items-center rounded-lg p-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-600 uppercase">
            Total Gastos:
          </span>
          <div className="bg-white border-b border-amber-500 px-4 py-1 rounded font-black text-slate-900 text-sm">
            S/ {numberPeru(totalGastos)}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-600 uppercase">
            Por Reembolsar:
          </span>
          <div className="bg-white border-b border-amber-500 px-4 py-1 rounded font-black text-slate-900 text-sm">
            S/ {porReembolsar > 0 ? numberPeru(Math.abs(porReembolsar)) : 0}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-600 uppercase">
            Por Devolver:
          </span>
          <div className="bg-white border-b border-amber-500 px-4 py-1 rounded font-black text-slate-900 text-sm">
            S/ {porDevolver > 0 ? numberPeru(porDevolver) : 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaRendicion;
