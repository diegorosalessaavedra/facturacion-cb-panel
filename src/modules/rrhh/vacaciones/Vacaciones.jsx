import { useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaWpforms } from "react-icons/fa";
import axios from "axios";
import config from "../../../utils/getToken";
import TablaVacaciones from "./components/TablaDescanzoMedicos";
// import ModalAgregarVaciones from "./components/ModalAgregarVaciones";
import ModalVerPeriodo from "./components/modalVerPeriodo/ModalVerPeriodo";

const Vacaciones = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [selectModal, setSelectModal] = useState();
  const [colaboradores, setColaboradores] = useState([]);
  const [selectColaborador, setSelectColaborador] = useState();
  const [selectPeriodo, setSelectPeriodo] = useState();

  const handleFindColaboradores = () => {
    setLoading(true);
    const url = `${import.meta.env.VITE_URL_API}/rrhh/vacaciones/colaboradores`;

    axios
      .get(url, config)
      .then((res) => {
        setColaboradores(res.data.colaboradores);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleFindColaboradores();
  }, []);

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-auto">
      <div className="w-full h-full bg-white flex flex-col gap-4 py-4 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 ">
          <div className="flex items-center gap-2 text-slate-600">
            <FaWpforms className="text-2xl" />
            <h2>Vacaciones Colaboradores</h2>
          </div>
        </div>
        <TablaVacaciones
          onOpen={onOpen}
          colaboradores={colaboradores}
          loading={loading}
          setSelectModal={setSelectModal}
          setSelectColaborador={setSelectColaborador}
          setSelectPeriodo={setSelectPeriodo}
        />
      </div>
      {/* {selectModal === "nuevo" && (
        <ModalAgregarVaciones
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindColaboradores={handleFindColaboradores}
          selectColaborador={selectColaborador}
        />
      )} */}
      {selectModal === "verPeriodo" && (
        <ModalVerPeriodo
          key={selectPeriodo?.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          selectPeriodo={selectPeriodo}
          selectColaborador={selectColaborador}
        />
      )}
    </div>
  );
};

export default Vacaciones;
