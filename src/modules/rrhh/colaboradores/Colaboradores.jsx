import { Button, useDisclosure } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaWpforms } from "react-icons/fa";
import TablaColaboradores from "./components/TablaColaboradores";
import axios from "axios";
import config from "../../../utils/getToken";
import ModalNuevoColaborador from "./components/modalNuevoColaborador/ModalNuevoColaborador";
import ModalVerMasColaborador from "./components/ModalVerMasColaborador";
import ModalEditarColaborador from "./components/modalEditarColaborador/ModalEditarColaborador";
import ModalAgregarContrato from "./components/contratos/ModalAgregarContrato";
import ModalVerContratos from "./components/contratos/ModalVerContratos";
import ModalAgregarMemo from "./components/ModalAgregarMemo";
import ModalVerMemos from "./components/ModalVerMemos";
import FiltrarColaboradores from "./components/FiltrarColaboradores";
import ModalDarBajaColaborador from "./components/ModalDarBajaColaborador";
import ModalEliminarColaborador from "./components/ModalEliminarColaborador";

const Colaboradores = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [selectModal, setSelectModal] = useState();
  const [colaboradores, setColaboradores] = useState([]);
  const [selectColaborador, setSelectColaborador] = useState();
  const [dataFilter, setDataFilter] = useState({
    nombreNumeroDoc: "",
    cargoLaboral: "todos",
  });

  const handleFindColaboradores = () => {
    const url = `${
      import.meta.env.VITE_URL_API
    }/rrhh/colaboradores?nombreNumeroDoc=${
      dataFilter.nombreNumeroDoc
    }&cargoLaboral=${dataFilter.cargoLaboral}`;

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
          <div className="flex items-center gap-2 text-slate-600">
            <FaWpforms className="text-2xl" />
            <h2>Colaboradores</h2>
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

        <TablaColaboradores
          onOpen={onOpen}
          colaboradores={colaboradores}
          loading={loading}
          setSelectColaborador={setSelectColaborador}
          setSelectModal={setSelectModal}
        />
      </div>
      {selectModal === "nuevo" && (
        <ModalNuevoColaborador
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindColaboradores={handleFindColaboradores}
        />
      )}
      {selectModal === "verMas" && (
        <ModalVerMasColaborador
          key={selectColaborador?.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          selectColaborador={selectColaborador}
        />
      )}
      {selectModal === "editar" && (
        <ModalEditarColaborador
          key={selectColaborador.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindColaboradores={handleFindColaboradores}
          selectColaborador={selectColaborador}
        />
      )}
      {selectModal === "agregar_contrato" && (
        <ModalAgregarContrato
          key={selectColaborador.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindColaboradores={handleFindColaboradores}
          selectColaborador={selectColaborador}
        />
      )}
      {selectModal === "ver_contratos" && (
        <ModalVerContratos
          key={selectColaborador.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          selectColaborador={selectColaborador}
          handleFindColaboradores={handleFindColaboradores}
        />
      )}
      {selectModal === "agregar_memo" && (
        <ModalAgregarMemo
          key={selectColaborador.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindColaboradores={handleFindColaboradores}
          selectColaborador={selectColaborador}
        />
      )}
      {selectModal === "ver_memos" && (
        <ModalVerMemos
          key={selectColaborador.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          selectColaborador={selectColaborador}
        />
      )}
      {selectModal === "dar_baja" && (
        <ModalDarBajaColaborador
          key={selectColaborador.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindColaboradores={handleFindColaboradores}
          selectColaborador={selectColaborador}
        />
      )}

      {selectModal === "eliminar" && (
        <ModalEliminarColaborador
          key={selectColaborador.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindColaboradores={handleFindColaboradores}
          selectColaborador={selectColaborador}
        />
      )}
    </div>
  );
};

export default Colaboradores;
