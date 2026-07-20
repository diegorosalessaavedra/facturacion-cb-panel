import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner"; // o react-hot-toast
import CalendarioHeader from "./components/CalendarioHeader";
import CalendarioTabla from "./components/CalendarioTabla";
import CalendarioModales from "./components/CalendarioModales";
import { API } from "../../../utils/api";
import config from "../../../utils/getToken";

const CalendarioPlanilla = () => {
  const [selectModal, setSelectModal] = useState(null);
  const [modalContext, setModalContext] = useState({});
  const [yearPlanillas, setYearPlanillas] = useState([]);
  const [selectYear, setSelectYear] = useState(null);
  const [mesesPlanillas, setMesesPlanillas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estado para bloquear botones mientras guarda/elimina
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFindYear = () => {
    setLoading(true);
    axios
      .get(`${API}/year-planilla`, config)
      .then((res) => {
        setYearPlanillas(res.data.years || []);
        if (res.data.years?.length > 0 && !selectYear) {
          setSelectYear(res.data.years[0].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleFindMeses = () => {
    if (!selectYear) return;
    setLoading(true);
    axios
      .get(`${API}/meses-planilla/year/${selectYear}`, config)
      .then((res) => setMesesPlanillas(res.data.meses || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleFindYear();
  }, []);

  useEffect(() => {
    if (selectYear) handleFindMeses();
  }, [selectYear]);

  const handleOpenModal = (modalType, context = {}) => {
    setModalContext(context);
    setSelectModal(modalType);
  };

  const handleDeleteAction = (tipo, id) => {
    handleOpenModal("eliminar_registro", { tipo, id });
  };

  // --- CONEXIÓN CON EL BACKEND ---
  const handleSubmitData = async (tipo_accion, payload) => {
    setIsSubmitting(true);
    try {
      if (tipo_accion === "eliminar_registro") {
        // Mapeamos el 'tipo' a la ruta correcta de tu backend
        const rutasDelete = {
          year: "year-planilla",
          mes: "meses-planilla",
          semana: "semanas-planilla",
          dia: "dias-planilla",
        };
        const url = `${API}/${rutasDelete[payload.tipo]}/${payload.id}`;
        await axios.delete(url, config);
        toast.success(`${payload.tipo} eliminado correctamente`);
      } else {
        // Mapeamos las acciones POST
        const rutasPost = {
          agregar_year: "year-planilla",
          agregar_mes: "meses-planilla",
          agregar_semana: "semanas-planilla",
          agregar_dia: "dias-planilla",
        };
        const url = `${API}/${rutasPost[tipo_accion]}`;
        await axios.post(url, payload, config);
        toast.success("Registro creado exitosamente");
      }

      // Actualizar datos de la tabla tras el éxito
      handleFindYear();
      if (selectYear) handleFindMeses();

      // Cerrar modal
      setSelectModal(null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Ocurrió un error en la operación",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full h-screen bg-slate-50 p-4 md:pt-[90px] overflow-hidden flex flex-col">
      <div className="max-w-[1600px] w-full h-full mx-auto flex flex-col gap-2">
        <CalendarioHeader
          aniosDisponibles={yearPlanillas}
          anioSeleccionado={selectYear}
          setAnioSeleccionado={setSelectYear}
          onOpenModal={handleOpenModal}
        />
        <CalendarioTabla
          dataMeses={mesesPlanillas}
          onOpenModal={handleOpenModal}
          onDeleteAction={handleDeleteAction}
        />
      </div>

      <CalendarioModales
        selectModal={selectModal}
        setSelectModal={setSelectModal}
        modalContext={modalContext}
        onSubmitData={handleSubmitData}
        isSubmitting={isSubmitting} // Pasamos el estado de carga
      />
    </main>
  );
};

export default CalendarioPlanilla;
