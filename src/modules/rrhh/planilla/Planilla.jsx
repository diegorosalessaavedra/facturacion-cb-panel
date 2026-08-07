import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import { API } from "../../../utils/api";
import FiltroPlanilla from "./components/FiltroPlanilla";
import PlanillaHeader from "./components/PlanillaHeader";
import TablaPlantilla from "./components/TablaPlantilla";
import config from "../../../utils/getToken";

const Planilla = () => {
  const { year, mes } = useParams();
  const [yearPlanillas, setYearPlanillas] = useState([]);
  const [mesesPlanillas, setMesesPlanillas] = useState([]);
  const [semanasPlanilla, setsemanasPlanilla] = useState([]);
  const [selectYear, setSelectYear] = useState(year || null);
  const [selectMes, setSelectMes] = useState(mes || null);
  const [selectSemana, setSelectSemana] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectModal, setSelectModal] = useState(null);
  const [modalContext, setModalContext] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = () => {
    console.log("Abrir modal");
  };

  useEffect(() => {
    const fetchYears = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/year-planilla`, config);
        setYearPlanillas(res.data.years || []);
        if (res.data.years?.length > 0 && !selectYear) {
          setSelectYear(res.data.years[0].id.toString());
        }
      } catch (err) {
        console.error(err);
        toast.error("Error al cargar los años"); // Ejemplo de uso de toast
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, []);

  useEffect(() => {
    if (!selectYear) return;

    const fetchMeses = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${API}/meses-planilla/${selectYear}`,
          config,
        );
        setMesesPlanillas(res.data.meses || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeses();
  }, [selectYear]);

  useEffect(() => {
    if (!selectMes) return;
    const fetchSemanas = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${API}/semanas-planilla/${selectMes}`,
          config,
        );
        setsemanasPlanilla(res.data.semanas || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSemanas();
  }, [selectMes]);

  return (
    <main className="w-full h-screen bg-slate-50 p-4 md:pt-[90px] overflow-hidden flex flex-col">
      <div className="max-w-[1600px] w-full h-full mx-auto flex flex-col gap-2">
        {loading && (
          <span className="text-xs text-gray-500">Cargando datos...</span>
        )}

        <PlanillaHeader
          aniosDisponibles={yearPlanillas}
          anioSeleccionado={selectYear}
          setAnioSeleccionado={setSelectYear}
          onOpenModal={handleOpenModal}
        />
        <FiltroPlanilla
          yearPlanillas={yearPlanillas}
          selectYear={selectYear}
          setSelectYear={setSelectYear}
          mesesPlanillas={mesesPlanillas}
          semanasPlanilla={semanasPlanilla}
          selectMes={selectMes}
          setSelectMes={setSelectMes}
        />
        <TablaPlantilla
          selectYear={selectYear}
          yearPlanillas={yearPlanillas}
          selectMes={selectMes}
          mesesPlanillas={mesesPlanillas}
          semanasPlanilla={semanasPlanilla}
        />
      </div>
    </main>
  );
};

export default Planilla;
