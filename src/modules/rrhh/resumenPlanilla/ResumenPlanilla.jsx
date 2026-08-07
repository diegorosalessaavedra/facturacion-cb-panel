import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import config from "../../../utils/getToken";
import FiltroResumenPlanilla from "./components/FiltroResumenPlanilla";
import ResumenPlanillaHeader from "./components/ResumenPlanillaHeader";
import TablaResumenPlantilla from "./components/TablaResumenPlantilla";
import { useQuery } from "../../../hooks/useQuery";
import { useDisclosure } from "@nextui-org/react";
import AsistenciaAdministrativos from "./components/asistenciasAdministrativos/AsistenciaAdministrativos";
import AsistenciasOperativos from "./components/asistenciasOperativos/AsistenciasOperativos";

const ResumenPlanilla = () => {
  const { id } = useParams();
  const { year, mes } = useQuery();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [loading, setLoading] = useState(false);
  const [colaboradores, setColaboradores] = useState([]);
  const [dias, setDias] = useState([]);

  const [dataFiltros, setDataFiltros] = useState({
    empresa: new Set(["Granjas Peruanas"]),
    regimen: new Set(["TRABAJADOR EN PLANILLA"]),
  });
  const [selectModal, setSelectModal] = useState("");
  const [selectColaborador, setSelectColaborador] = useState(new Set([]));

  useEffect(() => {
    if (!id && !selectColaborador) return;

    setLoading(true);
    const url = `${import.meta.env.VITE_URL_API}/dias-planilla/semana/${id}/${selectColaborador}`;

    axios
      .get(url, config)
      .then((res) => {
        setDias(res.data.dias);
      })
      .finally(() => setLoading(false));
  }, [id, selectColaborador]);

  useEffect(() => {
    setLoading(true);

    const empresasSeleccionadas = Array.from(dataFiltros.empresa).join(",");
    const regimenSeleccionado = Array.from(dataFiltros.regimen).join(",");

    const url = `${import.meta.env.VITE_URL_API}/rrhh/colaboradores/plantilla?empresa=${empresasSeleccionadas}&regimen=${regimenSeleccionado}`;

    axios
      .get(url, config)
      .then((res) => {
        setColaboradores(res.data.colaboradores);
      })
      .finally(() => setLoading(false));
  }, [dataFiltros]);

  useEffect(() => {
    if (
      !selectColaborador ||
      (selectColaborador instanceof Set && selectColaborador.size === 0)
    ) {
      return;
    }
    const colabId =
      selectColaborador instanceof Set
        ? Array.from(selectColaborador)[0]
        : selectColaborador;

    const findColaborador = colaboradores.find((c) => c.id === Number(colabId));
    console.log(findColaborador);

    if (findColaborador) {
      setSelectModal(
        findColaborador.cargo_laboral?.agrupacion_cargo === "ADMINISTRATIVOS"
          ? "asistencia_administrativos"
          : "asistencia_operativos",
      );
    }
  }, [selectColaborador, colaboradores]);

  return (
    <main className="w-full h-screen bg-slate-50 p-4 md:pt-[90px] overflow-hidden flex flex-col">
      <div className="max-w-[1600px] w-full h-full mx-auto flex flex-col gap-2">
        {loading && (
          <span className="text-xs text-gray-500">Cargando datos...</span>
        )}

        <ResumenPlanillaHeader />
        <section className="bg-white  mt-2 p-2 rounded-xl">
          <FiltroResumenPlanilla
            dataFiltros={dataFiltros}
            setDataFiltros={setDataFiltros}
          />

          <TablaResumenPlantilla
            colaboradores={colaboradores}
            setSelectModal={setSelectModal}
            setSelectColaborador={setSelectColaborador}
            onOpen={onOpen}
          />
        </section>

        {/* ¡ERROR CORREGIDO AQUÍ! Se cerró correctamente el condicional */}
        {selectModal === "asistencia_administrativos" && (
          <AsistenciaAdministrativos
            colaboradores={colaboradores.filter(
              (c) => c.cargo_laboral.agrupacion_cargo === "ADMINISTRATIVOS",
            )}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            selectColaborador={selectColaborador}
            setSelectColaborador={setSelectColaborador}
            dias={dias}
          />
        )}

        {selectModal === "asistencia_operativos" && (
          <AsistenciasOperativos
            colaboradores={colaboradores.filter(
              (c) => c.cargo_laboral.agrupacion_cargo === "OPERATIVOS",
            )}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            selectColaborador={selectColaborador}
            setSelectColaborador={setSelectColaborador}
            dias={dias}
          />
        )}
      </div>
    </main>
  );
};

export default ResumenPlanilla;
