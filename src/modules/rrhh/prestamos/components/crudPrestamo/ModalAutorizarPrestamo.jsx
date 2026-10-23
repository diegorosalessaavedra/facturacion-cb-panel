import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";
import { API } from "../../../../../utils/api";
import config from "../../../../../utils/getToken";
import { handleAxiosError } from "../../../../../utils/handleAxiosError";

const ModalAutorizarPrestamo = ({
  isOpen,
  onOpenChange,
  prestamo,
  fetchPrestamos,
}) => {
  const [loading, setLoading] = useState(false);

  if (!prestamo) return null;

  const nombreTrabajador = prestamo.colaborador
    ? `${prestamo.colaborador.apellidos_colaborador} ${prestamo.colaborador.nombre_colaborador}`
    : "Trabajador no encontrado";

  const handleAutorizar = async (onClose) => {
    setLoading(true);
    try {
      const url = `${API}/prestamos/estado/${prestamo.id}`; 
      
      await axios.patch(url, { estado_prestamo: 'AUTORIZADO' }, config);
      
      toast.success("Préstamo autorizado correctamente");
      if (fetchPrestamos) fetchPrestamos();
      onClose();
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="sm"
      classNames={{
        base: "rounded-[24px] bg-slate-50",
        header: "p-6 pb-2 text-slate-900 font-bold",
        body: "p-6 pt-2",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Autorizar Préstamo</ModalHeader>
            <ModalBody>
              <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm mb-2 text-center">
                <p className="text-sm text-slate-700 font-medium mb-3">
                  ¿Estás seguro que deseas autorizar el préstamo de:
                </p>
                <p className="text-md text-emerald-600 font-bold mb-1">
                  {nombreTrabajador}
                </p>
                <p className="text-xs text-slate-500 font-bold uppercase">
                  Desembolso: S/ {prestamo.cronograma?.reduce((acc, cuota) => acc + Number(cuota.importe_cuota), 0).toFixed(2) || "0.00"}
                </p>
              </div>

              <div className="flex justify-between gap-3 mt-6">
                <Button
                  variant="flat"
                  onPress={onClose}
                  className="w-full text-slate-700 bg-slate-200 hover:bg-slate-300 font-bold"
                  size="md"
                >
                  Cancelar
                </Button>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  size="md"
                  onPress={() => handleAutorizar(onClose)}
                  isLoading={loading}
                >
                  Sí, Autorizar
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalAutorizarPrestamo;