import { Button, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaPlus, FaWpforms } from "react-icons/fa";
import axios from "axios";
import config from "../../../utils/getToken";
import TablaSolicitudesVacaciones from "./components/TablaSolicitudesVacaciones";
import ModalEstadoSolicitudVacaciones from "./components/ModalEstadoSolicitudVacaciones";

const SolicitudesVacaciones = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [selectModal, setSelectModal] = useState();
  const [solicitudesVacaciones, setSolicitudesVacaciones] = useState([]);
  const [selectSolicitudeVacaciones, setSelectSolicitdesVacaciones] =
    useState();

  const handleFindSolicitudesVacaciones = () => {
    const url = `${import.meta.env.VITE_URL_API}/rrhh/vacaciones-solicitadas`;

    axios
      .get(url, config)
      .then((res) => {
        setSolicitudesVacaciones(res.data.vacionesSolicitadas);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleFindSolicitudesVacaciones();
  }, []);

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-auto">
      <div className="w-full h-full bg-white flex flex-col gap-4 py-4 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 ">
          <div className="flex items-center gap-2 text-slate-600">
            <FaWpforms className="text-2xl" />
            <h2>Solicitud de vacaciones</h2>
          </div>
        </div>
        <TablaSolicitudesVacaciones
          onOpen={onOpen}
          solicitudesVacaciones={solicitudesVacaciones}
          loading={loading}
          setSelectSolicitdesVacaciones={setSelectSolicitdesVacaciones}
          setSelectModal={setSelectModal}
        />
      </div>
      {selectModal === "cambiar_estado" && (
        <ModalEstadoSolicitudVacaciones
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          selectSolicitudeVacaciones={selectSolicitudeVacaciones}
          handleFindSolicitudesVacaciones={handleFindSolicitudesVacaciones}
        />
      )}
    </div>
  );
};

export default SolicitudesVacaciones;
