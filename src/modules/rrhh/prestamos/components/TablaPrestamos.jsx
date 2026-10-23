import { Button, Link, useDisclosure } from "@nextui-org/react";
import React, { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi"; 
import ModalSubirSustento from "./crudPrestamo/ModalSubirSustento";
import ModalEditarPrestamo from "./crudPrestamo/ModalEditarPrestamo";
import ModalEliminarPrestamo from "./crudPrestamo/ModalEliminarPrestamo"; 
import ModalAutorizarPrestamo from "./crudPrestamo/ModalAutorizarPrestamo"; // <-- Modal importado
import { API_DOC } from "../../../../utils/api";
import ModalVerCronograma from "./ModalVerCronograma";

const TablaPrestamos = ({ prestamos, fetchPrestamos, colaboradores, userRole }) => { 
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectModal, setSelectModal] = useState("");
  const [selectPrestamo, setSelectPrestamo] = useState(null);

  const handleVerCronograma = (prestamo) => {
    setSelectPrestamo(prestamo);
    setSelectModal("verCronograma");
    onOpen();
  };

  const handleSubirSustento = (prestamo) => {
    setSelectPrestamo(prestamo);
    setSelectModal("subirSustento");
    onOpen();
  };

  const handleEditarPrestamo = (prestamo) => {
    setSelectPrestamo(prestamo);
    setSelectModal("editarPrestamo");
    onOpen();
  };

  const handleEliminarPrestamo = (prestamo) => {
    setSelectPrestamo(prestamo);
    setSelectModal("eliminarPrestamo");
    onOpen();
  };

  // <-- Nueva función para autorizar
  const handleAutorizarPrestamo = (prestamo) => {
    setSelectPrestamo(prestamo);
    setSelectModal("autorizarPrestamo");
    onOpen();
  };

  const getEstadoStyles = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "text-amber-700 bg-amber-100 border border-amber-200";
      case "AUTORIZADO":
        return "text-emerald-700 bg-emerald-100 border border-emerald-200";
      case "RECHAZADO":
        return "text-red-700 bg-red-100 border border-red-200";
      default:
        return "text-slate-600 bg-slate-100 border border-slate-200";
    }
  };

  return (
    <div className="flex-1 overflow-auto border border-slate-200 rounded-xl bg-white shadow-sm ">
      <table className="w-full border-collapse text-center">
        <thead className="sticky top-0 bg-slate-900 border-b border-slate-200 z-10 shadow-sm">
          <tr>
            <th className="border-r border-slate-200 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-100">
              TRABAJADOR
            </th>
            <th className="border-r border-slate-200 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-100">
              DESEMBOLSO
            </th>
            <th className="border-r border-slate-200 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-100">
              FECHA DE SOLICITUD
            </th>
            <th className="border-r border-slate-200 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-100">
              FECHA DE DESEMBOLSO
            </th>
            <th className="border-r border-slate-200 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-100">
              FECHA CUOTA INICIAL
            </th>
            <th className="border-r border-slate-200 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-100">
              Nº CUOTAS
            </th>
            <th className="border-r border-slate-200 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-100">
              IMPORTE CUOTA
            </th>
            <th className="border-r border-slate-200 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-100">
              CRONOGRAMA
            </th>
            <th className="border-r border-slate-200 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-100">
              ESTADO PRESTAMO
            </th>
            <th className="border-r border-slate-200 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-100">
              DESCARGAR FORMATO
            </th>
            <th className="border-r border-slate-200 p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-100">
              ADJUNTAR SUSTENTO
            </th>
            <th className="p-3 font-semibold uppercase text-[10px] tracking-wider text-slate-100">
              ACCIONES
            </th>
          </tr>
        </thead>
        <tbody className="align-middle">
          {!prestamos || prestamos.length === 0 ? (
            <tr>
              <td
                colSpan={12}
                className="text-center p-8 text-slate-500 bg-slate-50/50 font-medium"
              >
                No hay préstamos registrados.
              </td>
            </tr>
          ) : (
            prestamos.map((prestamo) => {
              const totalDesembolso =
                prestamo.cronograma
                  ?.reduce((acc, cuota) => acc + Number(cuota.importe_cuota), 0)
                  .toFixed(2) || "0.00";
              const numCuotas = prestamo.cronograma?.length || 0;
              const cuotaInicialObj = prestamo.cronograma?.find(
                (c) => c.numero_cuota === 1,
              );
              const fechaCuotaInicial = cuotaInicialObj
                ? cuotaInicialObj.fecha_descuento
                : "-";

              const estadoClases = getEstadoStyles(prestamo.estado_prestamo);

              return (
                <tr
                  key={prestamo.id}
                  className="border-b-1 hover:bg-slate-50 transition-colors"
                >
                  <td className="border-r text-[10px] border-slate-200 p-2 font-semibold text-slate-800 uppercase">
                    {prestamo.colaborador?.apellidos_colaborador}{" "}
                    {prestamo.colaborador?.nombre_colaborador}
                  </td>

                  <td className="border-r text-[11px] border-slate-200 p-2 font-medium">
                    S/ {totalDesembolso}
                  </td>

                  <td className="border-r text-[11px] border-slate-200 p-2">
                    {prestamo.fecha_solicitud}
                  </td>

                  <td className="border-r text-[11px] border-slate-200 p-2">
                    {prestamo.fecha_desembolso}
                  </td>

                  <td className="border-r text-[11px] border-slate-200 p-2">
                    {fechaCuotaInicial}
                  </td>

                  <td className="border-r text-[11px] border-slate-200 p-2 font-medium">
                    {numCuotas}
                  </td>

                  <td className="border-r text-[11px] border-slate-200 p-2 font-medium">
                    S/ {Number(prestamo.importe_cuota).toFixed(2)}
                  </td>

                  <td className="border-r border-slate-200 p-2">
                    <Button
                      className="bg-green-500 hover:bg-green-600 text-slate-900 text-[10px] font-bold h-7"
                      size="sm"
                      onPress={() => handleVerCronograma(prestamo)}
                    >
                      VER
                    </Button>
                  </td>
                  
                  {/* <-- Lógica modificada para autorizar */}
                  <td className="border-r border-slate-200 p-2">
                    {prestamo.estado_prestamo === "PENDIENTE" && userRole === "GERENTE" ? (
                      <button
                        onClick={() => handleAutorizarPrestamo(prestamo)}
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all hover:opacity-80 cursor-pointer ${estadoClases}`}
                      >
                        {prestamo.estado_prestamo}
                      </button>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${estadoClases}`}
                      >
                        {prestamo.estado_prestamo}
                      </span>
                    )}
                  </td>

                  <td className="border-r border-slate-200 p-2">
                    {prestamo.archivo_adjunto ? (
                      <Link
                        href={`${API_DOC}/solped/${prestamo.archivo_adjunto}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-[10px] font-bold h-7"
                          size="sm"
                        >
                          VER
                        </Button>
                      </Link>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">-</span>
                    )}
                  </td>

                  <td className="border-r border-slate-200 p-2">
                    <Button
                      className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-[10px] font-bold h-7"
                      size="sm"
                      onPress={() => handleSubirSustento(prestamo)}
                    >
                      CARGAR
                    </Button>
                  </td>

                  <td className="p-2">
                    <div className="flex justify-center gap-1">
                      <Button
                        isIconOnly
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300 h-7 w-7 min-w-7"
                        size="sm"
                        onPress={() => handleEditarPrestamo(prestamo)}
                        aria-label="Editar"
                      >
                        <FiEdit size={14} />
                      </Button>
                      
                      <Button
                        isIconOnly
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 h-7 w-7 min-w-7"
                        size="sm"
                        onPress={() => handleEliminarPrestamo(prestamo)}
                        aria-label="Eliminar"
                      >
                        <FiTrash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {selectModal === "verCronograma" && (
        <ModalVerCronograma
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          prestamo={selectPrestamo}
        />
      )}

      {selectModal === "subirSustento" && (
        <ModalSubirSustento
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          prestamo={selectPrestamo}
          fetchPrestamos={fetchPrestamos}
        />
      )}

      {selectModal === "editarPrestamo" && (
        <ModalEditarPrestamo
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          prestamo={selectPrestamo}
          fetchPrestamos={fetchPrestamos}
        />
      )}

      {selectModal === "eliminarPrestamo" && (
        <ModalEliminarPrestamo
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          prestamo={selectPrestamo}
          fetchPrestamos={fetchPrestamos}
        />
      )}

      {/* NUEVO MODAL RENDERIZADO */}
      {selectModal === "autorizarPrestamo" && (
        <ModalAutorizarPrestamo
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          prestamo={selectPrestamo}
          fetchPrestamos={fetchPrestamos}
        />
      )}
    </div>
  );
};

export default TablaPrestamos;