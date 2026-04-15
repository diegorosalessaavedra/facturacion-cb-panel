import React from "react";
import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  Chip,
  Checkbox,
} from "@nextui-org/react";
import { FaClipboardList, FaEdit, FaTrashAlt } from "react-icons/fa";

const TablaTusProveedores = ({
  proveedores,
  loading,
  onOpen,
  setSelectModal,
  setSelectProveedor,
}) => {
  return (
    <div className="w-full flex flex-col relative">
      {loading ? (
        <div className="flex w-full justify-center items-center h-40">
          <Spinner label="Cargando proveedores..." color="warning" size="lg" />
        </div>
      ) : (
        <Table
          aria-label="Tabla de proveedores"
          color="warning" // Resalta las selecciones sutiles en ámbar
          classNames={{
            base: "h-full h-[70vh]  overflow-auto",
            wrapper:
              "bg-white p-0 shadow-none border border-slate-200 rounded-lg",
            // Cabecera: Slate oscuro con texto Blanco/Ámbar
            th: "bg-slate-800 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider py-3 first:rounded-tl-lg last:rounded-tr-lg",
            // Filas: Texto slate y bordes sutiles
            td: "text-slate-700 text-xs py-3 border-b border-slate-100 group-hover:bg-slate-50 transition-colors",
            tbody: "bg-white",
          }}
          isHeaderSticky
          removeWrapper // Removemos el wrapper por defecto para que nuestro borde se vea más limpio
        >
          <TableHeader>
            <TableColumn width={50}>#</TableColumn>
            <TableColumn>NOMBRE</TableColumn>
            <TableColumn>ALIAS</TableColumn>
            <TableColumn>BANCO DEL BENEFICIARIO</TableColumn>
            <TableColumn>NRO CUENTA BCO</TableColumn>
            <TableColumn>DOCUMENTO</TableColumn>
            <TableColumn>NÚMERO</TableColumn>
            <TableColumn align="center">DETRACCIÓN</TableColumn>
            <TableColumn align="center">ACCIONES</TableColumn>
          </TableHeader>

          <TableBody emptyContent="No se encontraron proveedores registrados.">
            {proveedores?.map((proveedor, index) => (
              <TableRow key={proveedor.id} className="group cursor-default">
                <TableCell className="font-medium text-slate-400">
                  {index + 1}
                </TableCell>

                <TableCell className="font-bold text-slate-800">
                  {proveedor.tipoDocIdentidad === "RUC"
                    ? proveedor.nombreComercial
                    : proveedor.nombreApellidos}
                </TableCell>
                <TableCell className="font-bold text-slate-800">
                  {proveedor.alias_proveedor || "-"}
                </TableCell>

                <TableCell>
                  {proveedor.banco_beneficiario ? (
                    <span className="font-medium text-slate-600">
                      {proveedor.banco_beneficiario}
                    </span>
                  ) : (
                    <span className="text-slate-300">-</span>
                  )}
                </TableCell>

                <TableCell className="font-mono text-slate-600">
                  {proveedor.nro_cuenta_bco || (
                    <span className="text-slate-300">-</span>
                  )}
                </TableCell>

                <TableCell>
                  {/* Etiqueta visual sutil con el tono Ámbar */}
                  <Chip
                    size="sm"
                    variant="dot"
                    color="warning"
                    className="border-none text-slate-700"
                  >
                    {proveedor.tipoDocIdentidad}
                  </Chip>
                </TableCell>

                <TableCell className="font-mono font-semibold text-slate-700">
                  {proveedor.numeroDoc}
                </TableCell>
                <TableCell className="font-mono font-semibold text-slate-700">
                  <Checkbox
                    className="m-auto"
                    isSelected={proveedor.detraccion_activo}
                    color="warning"
                    size="md"
                  ></Checkbox>{" "}
                </TableCell>

                <TableCell>
                  <div className="flex gap-1 justify-center items-center">
                    <Tooltip
                      content="Editar"
                      color="warning"
                      showArrow
                      size="sm"
                    >
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="text-amber-500 "
                        onPress={() => {
                          setSelectModal("editar");
                          setSelectProveedor(proveedor);
                          onOpen();
                        }}
                      >
                        <FaEdit className="text-lg" />
                      </Button>
                    </Tooltip>

                    <Tooltip
                      content="Eliminar"
                      color="danger"
                      showArrow
                      size="sm"
                    >
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        // El slate-400 cambia a rojo solo al pasar el mouse por precaución UX
                        className="text-red-500"
                        onPress={() => {
                          setSelectModal("eliminar");
                          setSelectProveedor(proveedor);
                          onOpen();
                        }}
                      >
                        <FaTrashAlt className="text-base" />
                      </Button>
                    </Tooltip>
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

export default TablaTusProveedores;
