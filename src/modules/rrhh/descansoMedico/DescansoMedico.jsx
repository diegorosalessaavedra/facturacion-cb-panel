import { useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaWpforms } from "react-icons/fa";
import axios from "axios";
import config from "../../../utils/getToken";
import ModalAgregarDescansoMedico from "./components/ModalAgregarDescansoMedico";
import ModalVerDMedicos from "./components/modalVerDMedicos/ModalVerDMedicos";
import TablaDescansoMedicos from "./components/TablaDescansoMedicos";

const DescansoMedico = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [selectModal, setSelectModal] = useState();
  const [descansoMedicos, setDescansoMedicos] = useState([]);
  const [selectColaborador, setSelectColaborador] = useState();

  const handleFindDescansoMedicos = () => {
    setLoading(true);
    const url = `${
      import.meta.env.VITE_URL_API
    }/rrhh/descanso-medico/colaboradores`;

    axios
      .get(url, config)
      .then((res) => {
        setDescansoMedicos(res.data.descansoMedicos);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleFindDescansoMedicos();
  }, []);

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-auto">
      <div className="w-full h-full bg-white flex flex-col gap-4 py-4 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 ">
          <div className="flex items-center gap-2 text-slate-600">
            <FaWpforms className="text-2xl" />
            <h2>Descansos Medicos de los colaboradores</h2>
          </div>
        </div>
        <TablaDescansoMedicos
          onOpen={onOpen}
          descansoMedicos={descansoMedicos}
          loading={loading}
          setSelectColaborador={setSelectColaborador}
          setSelectModal={setSelectModal}
        />
      </div>
      {selectModal === "nuevo" && (
        <ModalAgregarDescansoMedico
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindDescansoMedicos={handleFindDescansoMedicos}
          selectColaborador={selectColaborador}
        />
      )}
      {selectModal === "verMas" && (
        <ModalVerDMedicos
          key={selectColaborador?.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          selectColaborador={selectColaborador}
        />
      )}
      {/* {selectModal === "editar" && (
        <ModalEditarColaborador
          key={selectColaborador.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindDescansoMedicos={handleFindDescansoMedicos}
          selectColaborador={selectColaborador}
        />
      )} */}
      {/* {selectModal === "eliminar" && (
        <ModalEliminarUsuario
          key={selectUsuario.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindDescansoMedicos={handleFindDescansoMedicos}
          selectUsuario={selectUsuario}
        />
      )} */}
    </div>
  );
};

export default DescansoMedico;
