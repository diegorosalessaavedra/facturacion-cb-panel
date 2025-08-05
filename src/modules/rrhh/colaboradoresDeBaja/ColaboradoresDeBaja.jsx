import { Button, Modal, useDisclosure } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaWpforms } from "react-icons/fa";
import axios from "axios";
import config from "../../../utils/getToken";
import FiltrarColaboradores from "../colaboradores/components/FiltrarColaboradores";
import TablaColaboradoresDeBaja from "./components/TablaColaboradoresDeBaja";
import ModalQuitarBajaColaborador from "./components/ModalQuitarBajaColaborador";
import ModalHistorialColaborador from "./components/modalHistorialColaborador/ModalHistorialColaborador";

const ColaboradoresDeBaja = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [selectModal, setSelectModal] = useState("");
  const [colaboradores, setColaboradores] = useState([]);
  const [selectColaborador, setSelectColaborador] = useState();
  const [dataFilter, setDataFilter] = useState({
    nombreNumeroDoc: "",
    cargoLaboral: "todos",
  });

  const handleFindColaboradores = () => {
    const url = `${
      import.meta.env.VITE_URL_API
    }/rrhh/colaboradores/inactivos?nombreNumeroDoc=${
      dataFilter.nombreNumeroDoc
    }&cargoLaboral=${dataFilter.cargoLaboral} `;

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

  const filtrarColaboradores = useMemo(
    () => (
      <FiltrarColaboradores
        setDataFilter={setDataFilter}
        dataFilter={dataFilter}
        handleFindColaboradores={handleFindColaboradores}
      />
    ),
    [dataFilter, handleFindColaboradores]
  );

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-auto">
      <div className="w-full h-full bg-white flex flex-col gap-4 py-4 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 ">
          <div className="flex items-center gap-2 text-slate-800">
            <FaWpforms className="text-2xl" />
            <h2 className="font-semibold">Colaboradores dados de baja</h2>
          </div>
          <Button
            onPress={() => {
              setSelectModal("nuevo");
              onOpen();
            }}
            color="primary"
            variant="solid"
            startContent={<FaPlus />}
          >
            Nuevo
          </Button>
        </div>
        {filtrarColaboradores}

        <TablaColaboradoresDeBaja
          onOpen={onOpen}
          colaboradores={colaboradores}
          loading={loading}
          setSelectColaborador={setSelectColaborador}
          setSelectModal={setSelectModal}
          deBaja={true}
        />
      </div>

      {selectModal === "quitar_baja" && (
        <ModalQuitarBajaColaborador
          key={selectColaborador.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindColaboradores={handleFindColaboradores}
          selectColaborador={selectColaborador}
        />
      )}
      {selectModal === "ver_historial" && (
        <div style={{ zIndex: isOpen ? 1000 : -1 }}>
          <ModalHistorialColaborador
            key={selectColaborador.id}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            selectColaborador={selectColaborador}
          />
        </div>
      )}
    </div>
  );
};

export default ColaboradoresDeBaja;
