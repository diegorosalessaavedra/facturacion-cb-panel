import React from "react";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Chip,
} from "@nextui-org/react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const TablaTusClientes = ({
  clientes,
  loading,
  onOpen,
  setSelectModal,
  setSelectProveedor,
}) => {
  return (
    <div className="w-full flex items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      {loading ? (
        <div className="m-auto flex flex-col items-center gap-4 py-20">
          {/* Spinner en tono Amber usando Tailwind */}
          <div className="w-10 h-10 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin"></div>
          <span className="text-slate-900 font-medium animate-pulse">
            Cargando clientes...
          </span>
        </div>
      ) : (
        <Table
          aria-label="Tabla de tus clientes"
          color="primary"
          isStriped
          isHeaderSticky
          classNames={{
            base: "min-w-full h-[70vh] overflow-auto",
            // Estilos globales para el encabezado (Slate-900 y texto Blanco)
            th: "bg-slate-900 text-white font-bold text-xs uppercase tracking-wider py-4 first:rounded-tl-lg last:rounded-tr-lg",
            // Estilos para las celdas
            td: "py-3 text-sm text-slate-800 border-b border-gray-100",
          }}
          isHeaderSticky
        >
          <TableHeader>
            <TableColumn width={50}>#</TableColumn>
            <TableColumn>NOMBRE</TableColumn>
            <TableColumn>TIPO DOC.</TableColumn>
            <TableColumn>NÚMERO DOC.</TableColumn>
            <TableColumn>TELÉFONO</TableColumn>
            <TableColumn align="center">CRÉDITO</TableColumn>
            <TableColumn align="center">EECC</TableColumn>
            <TableColumn align="center">ACCIONES</TableColumn>
          </TableHeader>

          <TableBody emptyContent={"No se encontraron clientes."}>
            {clientes?.map((cliente, index) => (
              <TableRow
                key={cliente.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <TableCell className="font-semibold text-slate-500">
                  {index + 1}
                </TableCell>

                <TableCell className="font-medium text-slate-900">
                  {cliente.tipoDocIdentidad === "RUC"
                    ? cliente.nombreComercial
                    : cliente.nombreApellidos}
                </TableCell>

                <TableCell>
                  <Chip
                    size="sm"
                    variant="flat"
                    className="bg-slate-100 text-slate-600 font-medium"
                  >
                    {cliente.tipoDocIdentidad}
                  </Chip>
                </TableCell>

                <TableCell>{cliente.numeroDoc}</TableCell>

                <TableCell>{cliente.telefono || "—"}</TableCell>

                {/* PERMISO CRÉDITO: Verde / Rojo */}
                <TableCell>
                  <Chip
                    size="sm"
                    color={cliente.permiso_credito ? "success" : "danger"}
                    variant="flat"
                    className="font-bold border border-transparent"
                  >
                    {cliente.permiso_credito ? "Autorizado" : "Sin permiso"}
                  </Chip>
                </TableCell>

                {/* EECC: Verde / Rojo */}
                <TableCell>
                  <span
                    className={`flex items-center justify-center gap-1.5 font-bold text-xs uppercase tracking-wide ${
                      cliente.eecc === "Inactivo"
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${cliente.eecc === "Inactivo" ? "bg-red-500" : "bg-green-500"}`}
                    ></span>
                    {cliente.eecc || "—"}
                  </span>
                </TableCell>

                {/* ACCIONES: Amber / Rojo */}
                <TableCell>
                  <div className="flex gap-3 items-center justify-center">
                    <button
                      onClick={() => {
                        setSelectModal("editar");
                        setSelectProveedor(cliente);
                        onOpen();
                      }}
                      className="p-2 bg-amber-50 text-amber-500 rounded-lg hover:bg-amber-500 hover:text-white transition-all duration-200 shadow-sm"
                      title="Editar cliente"
                    >
                      <FaEdit className="text-lg" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectModal("eliminar");
                        setSelectProveedor(cliente);
                        onOpen();
                      }}
                      className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200 shadow-sm"
                      title="Eliminar cliente"
                    >
                      <FaTrashAlt className="text-lg" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TablaTusClientes;
