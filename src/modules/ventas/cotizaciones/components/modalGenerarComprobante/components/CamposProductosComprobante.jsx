import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Chip, // Importamos Chip para la etiqueta
} from "@nextui-org/react";
import React from "react";
import { formatNumber } from "../../../../../../assets/formats";

const CamposProductosComprobante = ({ selectCotizacion }) => {
  console.log(selectCotizacion?.productos);
  // 1. Modificamos la suma: Si es bono (true) suma 0, si es false suma el total
  const total = selectCotizacion.productos.reduce(
    (acc, producto) => acc + (producto.bono ? 0 : Number(producto.total)),
    0,
  );

  const opGravadas = total / 1.18;

  return (
    <div>
      <h3 className="text-slate-900 font-bold mb-2">Productos</h3>
      <Divider />

      <div className="mt-4">
        <Table
          aria-label="Tabla de productos del comprobante"
          color="default"
          isStriped
          classNames={{
            base: "min-w-full overflow-hidden p-2",
            wrapper: "p-0 shadow-none",
            // Aplicamos tu paleta: bg-slate-900
            th: "bg-slate-900 text-white font-bold text-xs uppercase tracking-wider py-3",
          }}
          radius="sm"
          isCompact={true}
        >
          <TableHeader>
            <TableColumn>#</TableColumn>
            <TableColumn>NOMBRE</TableColumn>
            <TableColumn align="left">CANTIDAD</TableColumn>
            <TableColumn align="left">COSTO U.</TableColumn>
            <TableColumn align="left">STOCK</TableColumn>
            <TableColumn align="left">SUB TOTAL</TableColumn>
          </TableHeader>
          <TableBody>
            {selectCotizacion?.productos?.map((producto, index) => (
              <TableRow key={producto.id} className="hover:bg-slate-50">
                <TableCell className="text-xs font-medium text-slate-500">
                  {index + 1}
                </TableCell>

                {/* Nombre del producto + Etiqueta de Bono */}
                <TableCell className="text-xs">
                  <div className="flex items-left gap-2">
                    <span className="font-semibold text-slate-800">
                      {producto?.producto?.nombre}
                    </span>
                    {producto.bono && (
                      <Chip
                        size="sm"
                        className="bg-amber-500 text-white font-bold h-5 px-2 text-[10px] uppercase tracking-wide border-none shadow-sm"
                      >
                        Bono
                      </Chip>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-xs text-left font-medium">
                  {producto.cantidad}
                </TableCell>

                <TableCell className="text-xs text-left text-slate-600">
                  S/ {formatNumber(producto.precioUnitario)}
                </TableCell>

                <TableCell className="text-xs text-left text-slate-600">
                  {producto?.producto?.stock}
                </TableCell>

                {/* Sub Total: Tachado si es Bono */}
                <TableCell className="text-xs text-right font-bold">
                  <span className="text-slate-900">
                    S/ {formatNumber(producto.total)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Totales Inferiores */}
        <div className="w-full flex flex-col items-end pr-6 mt-6">
          <div className="flex text-sm gap-4 justify-end font-medium text-slate-600">
            <p>OP. GRAVADAS:</p>
            <span className="min-w-28 text-right">
              S/ {formatNumber(opGravadas)}
            </span>
          </div>
          <div className="flex text-sm gap-4 justify-end font-medium text-slate-600 mt-1">
            <p>IGV (18%):</p>
            <span className="min-w-28 text-right">
              S/ {formatNumber(opGravadas * 0.18)}
            </span>
          </div>
          <div className="flex text-base gap-4 justify-end font-black text-slate-900 mt-2 border-t border-gray-200 pt-2">
            <p>TOTAL :</p>
            <span className="min-w-28 text-right text-green-600">
              S/ {formatNumber(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CamposProductosComprobante;
