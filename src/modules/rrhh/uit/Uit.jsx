import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner, useDisclosure } from "@nextui-org/react";
import { FiLayers } from "react-icons/fi";

import { API } from "../../../utils/api";
import config from "../../../utils/getToken";
import { handleAxiosError } from "../../../utils/handleAxiosError";
import TablaUit from "./components/TablaUit";
import TablaTramos from "./components/TablaTramos";
import ModalNuevaUit from "./components/crudUit/ModalNuevaUit";
import ModalEditarUit from "./components/crudUit/ModalEditarUit";
import UitHeader from "./components/UitTaHeader";

const Uit = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [selectModal, setSelectModal] = useState("");
  const [uits, setUits] = useState([]);
  const [selectUit, setSelectUit] = useState(null);

  const handleFindUit = async () => {
    setLoading(true);
    try {
      const url = `${API}/rrhh/uit`;
      const res = await axios.get(url, config);
      setUits(res.data.uits || []);
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFindUit();
  }, []);

  return (
    <main className="w-full min-h-screen bg-slate-50/80 px-4 py-6 md:px-6 md:pt-[90px] flex flex-col">
      <div className="max-w-[1400px] w-full mx-auto flex flex-col gap-5">
        {/* Cabecera del módulo */}
        <div className="flex items-center justify-between gap-4">
          <UitHeader />

          {loading && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs">
              <Spinner size="sm" color="warning" />
              <span className="text-xs font-medium text-slate-500">
                Actualizando...
              </span>
            </div>
          )}
        </div>

        {/* Contenido principal: maestro (UITs) + detalle (Tramos) */}
        <section className="mx-auto flex  items-start gap-6 w-full max-w-5xl p-4 bg-white rounded-2xl">
          {/* Columna izquierda: Tabla UIT */}
          <div className="w-full lg:w-auto shrink-0">
            <TablaUit
              uits={uits}
              setSelectModal={setSelectModal}
              onOpen={onOpen}
              setSelectUit={setSelectUit}
            />
          </div>

          {/* Columna derecha: Tabla Tramos o estado vacío */}
          <div className="w-full flex-1 min-w-0">
            {selectUit ? (
              <TablaTramos selectModal={selectModal} selectUit={selectUit} />
            ) : (
              <div className="w-full max-w-[720px] mt-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 py-16 px-6 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <FiLayers size={22} />
                </div>
                <div className="max-w-xs">
                  <h4 className="text-sm font-bold text-slate-700">
                    Ninguna UIT seleccionada
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Haz clic en el ícono del ojo en cualquier año de la tabla
                    para visualizar o configurar sus tramos.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Modales CRUD UIT */}
      {selectModal === "nueva_uit" && (
        <ModalNuevaUit
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindUit={handleFindUit}
        />
      )}

      {selectModal === "editar_uit" && selectUit && (
        <ModalEditarUit
          key={selectUit.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindUit={handleFindUit}
          selectUit={selectUit}
        />
      )}
    </main>
  );
};

export default Uit;
