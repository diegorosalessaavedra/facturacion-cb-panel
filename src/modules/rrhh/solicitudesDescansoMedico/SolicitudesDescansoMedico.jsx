import { Button, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaPlus, FaWpforms } from "react-icons/fa";
import axios from "axios";
import config from "../../../utils/getToken";
import ModalEstadoSolicitudVacaciones from "./components/ModalEstadoSolicitudVacaciones";
import TablaSolicitudesDescansoMedico from "./components/TablaSolicitudesDescansoMedico";

const SolicitudesDescansoMedico = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [selectModal, setSelectModal] = useState();
  const [solicitudesDescansoMedico, setSolicitudesDescansoMedico] = useState(
    []
  );
  const [selectDescansoMedico, setSelectDescansoMedico] = useState();

  const handleFindSolicitudesDescansoMedico = () => {
    const url = `${import.meta.env.VITE_URL_API}/rrhh/descanso-medico`;

    axios
      .get(url, config)
      .then((res) => {
        setSolicitudesDescansoMedico(res.data.descansosMedicos);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleFindSolicitudesDescansoMedico();
  }, []);

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-auto">
      <div className="w-full h-full bg-white flex flex-col gap-4 py-4 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 ">
          <div className="flex items-center gap-2 text-slate-600">
            <FaWpforms className="text-2xl" />
            <h2>Solicitudes de descansos médicos</h2>
          </div>
        </div>
        <TablaSolicitudesDescansoMedico
          onOpen={onOpen}
          solicitudesDescansoMedico={solicitudesDescansoMedico}
          loading={loading}
          setSelectDescansoMedico={setSelectDescansoMedico}
          setSelectModal={setSelectModal}
        />
        s
      </div>
      {selectModal === "cambiar_estado" && (
        <ModalEstadoSolicitudVacaciones
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          selectDescansoMedico={selectDescansoMedico}
          handleFindSolicitudesDescansoMedico={
            handleFindSolicitudesDescansoMedico
          }
        />
      )}
    </div>
  );
};

export default SolicitudesDescansoMedico;
