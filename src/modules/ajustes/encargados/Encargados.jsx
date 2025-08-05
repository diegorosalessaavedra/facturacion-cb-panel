import React, { useEffect, useState } from "react";
import TablaEncargados from "./components/TablaEncargados";
import { Button, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import config from "../../../utils/getToken";
import { FaPlus } from "react-icons/fa";
import ModalNuevoEncargado from "./components/ModalNuevoEncargado";
import ModalEliminarEncargado from "./components/ModalEliminarEncargado";

const Encargados = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [encargados, setEncargados] = useState([]);
  const [selectModal, setSelectModal] = useState();
  const [selectedEncargado, setSelectedEncargado] = useState();

  const handleFindEncargados = () => {
    const url = `${import.meta.env.VITE_URL_API}/ajustes/encargado`;

    axios.get(url, config).then((res) => setEncargados(res.data.encargados));
  };

  useEffect(() => {
    handleFindEncargados();
  }, []);
  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      <div className="w-full h-full bg-white flex flex-col gap-4 rounded-md  overflow-y-auto overflow-x-hidden">
        <div className="w-full px-6 py-4 bg-blue-600 flex items-center     justify-between">
          <h2 className=" text-white font-normal text-lg">Encargados</h2>
          <Button
            className="bg-white"
            size="sm"
            startContent={<FaPlus />}
            onClick={() => {
              onOpen(), setSelectModal("nuevo");
            }}
          >
            Nuevo
          </Button>
        </div>
        <TablaEncargados
          encargados={encargados}
          onOpen={onOpen}
          setSelectModal={setSelectModal}
          setSelectedEncargado={setSelectedEncargado}
        />
        {selectModal === "eliminar" && (
          <ModalEliminarEncargado
            key={selectedEncargado?.id}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            handleFindEncargados={handleFindEncargados}
            setSelectedEncargado={setSelectedEncargado}
            selectedEncargado={selectedEncargado}
          />
        )}
        {selectModal === "nuevo" && (
          <ModalNuevoEncargado
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            handleFindEncargados={handleFindEncargados}
          />
        )}
      </div>
    </div>
  );
};

export default Encargados;
