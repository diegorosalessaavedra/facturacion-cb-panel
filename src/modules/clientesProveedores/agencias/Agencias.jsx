import React, { useEffect, useMemo, useState } from "react";
import { FaPlus, FaWpforms } from "react-icons/fa";
import { Button, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import config from "../../../utils/getToken";
import TablaAgencias from "./components/TablaAgencias";
import FiltrarAgencias from "./components/FiltrarAgencias";
import ModalAddAgencia from "./components/crudAgencia/ModalAddAgencia";
import ModalUpdateAgencia from "./components/crudAgencia/ModalUpdateAgencia";
import ModalDeleteAgencia from "./components/crudAgencia/ModalEliminarProveedor";

const Agencias = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [agencias, setAgencias] = useState([]);
  const [selectModal, setSelectModal] = useState();
  const [selectAgencia, setSelectAgencia] = useState();
  const [dataFilter, setDataFilter] = useState({
    nombre_agencia: "",
  });

  const findAgencias = () => {
    const url = `${import.meta.env.VITE_URL_API}/agencias?nombre_agencia=${
      dataFilter.nombre_agencia
    }`;

    axios
      .get(url, config)
      .then((res) => setAgencias(res.data.agencias))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    findAgencias();
  }, []);

  const filtrarClientes = useMemo(
    () => (
      <FiltrarAgencias
        setDataFilter={setDataFilter}
        dataFilter={dataFilter}
        findAgencias={findAgencias}
      />
    ),
    [dataFilter, findAgencias]
  );

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      <div className="w-full h-full bg-white flex flex-col gap-4 py-4 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 ">
          <div className="flex items-center gap-2 text-slate-600">
            <FaWpforms className="text-2xl" />
            <h2>Listado de Agencias</h2>
          </div>
          <Button
            onPress={() => {
              onOpen();
              setSelectModal("nuevo");
            }}
            color="primary"
            variant="solid"
            startContent={<FaPlus />}
          >
            Agencia
          </Button>
        </div>
        {filtrarClientes}

        <TablaAgencias
          agencias={agencias}
          loading={loading}
          onOpen={onOpen}
          setSelectModal={setSelectModal}
          setSelectAgencia={setSelectAgencia}
        />
      </div>
      {selectModal === "nuevo" && (
        <ModalAddAgencia
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          findAgencias={findAgencias}
        />
      )}

      {selectModal === "eliminar" && (
        <ModalDeleteAgencia
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          findAgencias={findAgencias}
          selectAgencia={selectAgencia}
        />
      )}
      {selectModal === "editar" && (
        <ModalUpdateAgencia
          key={selectAgencia.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          findAgencias={findAgencias}
          selectAgencia={selectAgencia}
        />
      )}
    </div>
  );
};

export default Agencias;
