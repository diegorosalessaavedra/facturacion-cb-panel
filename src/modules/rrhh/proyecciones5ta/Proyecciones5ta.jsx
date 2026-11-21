import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Spinner } from "@nextui-org/react";

import { API } from "../../../utils/api";
import config from "../../../utils/getToken";
import { handleAxiosError } from "../../../utils/handleAxiosError";
import Proyecciones5taHeader from "./components/Proyecciones5taHeader";
import DatosTrabajadorUit from "./components/DatosTrabajadorUit";
import TablaProyecciones from "./components/tablaProyecciones/TablaProyecciones";

const Proyecciones5ta = ({}) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [uit, setUit] = useState(null);
  const [colaboradores, setColaboradores] = useState([]);
  const [selectColaborador, setSelectColaborador] = useState(null);

  const handleFindColaboradores = async () => {
    try {
      const url = `${API}/rrhh/colaboradores`;
      const res = await axios.get(url, config);
      setColaboradores(res.data.colaboradores || []);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const handleFindUit = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const url = `${API}/rrhh/uit/${id}`;
      const res = await axios.get(url, config);
      setUit(res.data.uit);
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFindColaboradores();
  }, []);

  useEffect(() => {
    handleFindUit();
  }, [id]);

  return (
    <main className="w-full h-screen bg-slate-50 p-4 md:pt-[90px] flex flex-col overflow-hidden">
      <div className="max-w-[1600px] w-full flex-1 min-h-0 mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 shrink-0">
          <Proyecciones5taHeader uit={uit} />

          {loading && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
              <Spinner size="sm" color="warning" />
              <span className="text-xs font-medium text-slate-500">
                Cargando datos...
              </span>
            </div>
          )}
        </div>

        <div className=" mx-auto w-full max-w-[1100px] p-4 rounded-2xl bg-white flex flex-col items-center gap-4 flex-1 min-h-0 overflow-y-auto pb-8">
          <div className="w-full shrink-0">
            <DatosTrabajadorUit
              colaboradores={colaboradores}
              selectColaborador={selectColaborador}
              setSelectColaborador={setSelectColaborador}
              uit={uit}
            />
          </div>
          {selectColaborador && (
            <div className="w-full shrink-0">
              <TablaProyecciones
                uit={uit}
                selectColaborador={selectColaborador}
                visualizar={false}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Proyecciones5ta;
