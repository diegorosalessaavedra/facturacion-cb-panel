import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Chip,
  Pagination, // 🟢 Importamos el componente Pagination de NextUI
} from "@nextui-org/react";
import { FaEdit, FaTrashAlt, FaUsers } from "react-icons/fa";

const TablaTusClientes = ({
  clientes,
  loading,
  onOpen,
  setSelectModal,
  setSelectProveedor,
  // 🟢 Recibimos las props de paginación
  page,
  setPage,
  totalPages,
}) => {
  // 🟢 Creamos el bloque de la paginación de manera optimizada
  const bottomContent = useMemo(() => {
    // Solo mostramos la paginación si hay más de 1 página
    if (totalPages <= 1) return null;

    return (
      <div className="flex w-full justify-center p-2">
        <Pagination
          isCompact
          showControls
          showShadow
          // Estilo alineado con tu paleta Slate-900
          classNames={{
            cursor: "bg-slate-900 text-white font-bold",
          }}
          page={page}
          total={totalPages}
          onChange={(page) => setPage(page)}
        />
      </div>
    );
  }, [page, totalPages, setPage]);

  return (
    <div className=" w-full flex items-center bg-white  pt-4 rounded-2xl shadow-sm ">
      {loading ? (
        <div className="m-auto flex flex-col items-center gap-4 py-20">
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
          bottomContent={bottomContent}
          classNames={{
            base: "min-w-full h-full overflow-auto p-0",
            th: "bg-slate-900 text-white font-bold text-xs uppercase tracking-wider py-4 first:rounded-tl-lg last:rounded-tr-lg",
            td: "py-2 text-xs text-slate-800 border-b border-gray-100",
          }}
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
                  {/* Cálculo matemático para que la numeración sea correcta por cada página (asumiendo limit=10) */}
                  {(page - 1) * 10 + index + 1}
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

                <TableCell>
                  <Chip
                    size="sm"
                    color={cliente.permiso_credito ? "success" : "danger"}
                    variant="flat"
                    className="font-bold border border-transparent"
                  >
                    {cliente.permiso_credito ? "Habilitado" : "Deshabilitado"}
                  </Chip>
                </TableCell>

                <TableCell>
                  <span
                    className={`flex items-center justify-center gap-1.5 font-bold text-xs uppercase tracking-wide ${
                      cliente.eecc === "Inactivo"
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        cliente.eecc === "Inactivo"
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                    ></span>
                    {cliente.eecc || "—"}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex gap-3 items-center justify-start">
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
                    {cliente.tipo_cliente === "REVENDEDOR" && (
                      <button
                        onClick={() => {
                          setSelectModal("revendedor");
                          setSelectProveedor(cliente);
                          onOpen();
                        }}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm"
                        title="Gestionar clientes asociados"
                      >
                        <FaUsers className="text-lg" />
                      </button>
                    )}
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
