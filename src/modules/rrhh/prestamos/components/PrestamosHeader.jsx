import React from "react";
import { Button } from "@nextui-org/react";
import { FiPlus } from "react-icons/fi";

const PrestamosHeader = ({
  onOpen,
}) => {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full bg-slate-900 border border-slate-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-6 relative z-10">
        <div className="bg-white p-2 rounded-md shadow-md">
          <img
            className="w-12 h-12 object-contain"
            src="/logo.jpg"
            alt="logo empresa" // Texto alternativo más descriptivo
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-50 tracking-tight flex items-center gap-2">
            Descuentos de Colaboradores {/* Añadida la tilde */}
          </h1>
          <p className="text-slate-200 text-sm">
            Gestiona los adelantos y solicitudes de descuentos del personal. {/* Texto profesional */}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="sm"
          radius="sm"
          className="bg-amber-500 text-slate-800 font-semibold"
          startContent={<FiPlus size={18} />}
          onPress={() => onOpen()}
        >
          Nueva Solicitud
        </Button>
      </div>
    </header>
  );
};

export default PrestamosHeader;