import React, { useEffect, useState } from "react";
import { Button, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import config from "../../../utils/getToken";
import { FaPlus } from "react-icons/fa";
import TablaCentroCostos from "./components/TablaCentroCostos";
import ModalNuevoCentroCostos from "./components/ModalNuevoCentroCostos";
import ModalEditarCentroCostos from "./components/ModalEditarCentroCostos";
import ModalEliminarCentroCostos from "./components/ModalEliminarCentroCostos";

const CentroCostos = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [centroCostos, setCentroCostos] = useState([]);
  const [selectModal, setSelectModal] = useState();
  const [selectedCentroCosto, setSelectedCentroCosto] = useState();

  const handleFindCentroCostos = () => {
    const url = `${import.meta.env.VITE_URL_API}/ajustes/centro-costos`;

    axios
      .get(url, config)
      .then((res) => setCentroCostos(res.data.centroCostos));
  };

  useEffect(() => {
    handleFindCentroCostos();
  }, []);

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      <div className="w-full h-full bg-white flex flex-col gap-4 rounded-md  overflow-y-auto overflow-x-hidden">
        <div className="w-full px-6 py-4 bg-blue-600 flex items-center     justify-between">
          <h2 className=" text-white font-normal text-lg">Centro Costos</h2>
          <Button
            className="bg-white"
            size="sm"
            startContent={<FaPlus />}
            onPress={() => {
              onOpen(), setSelectModal("nuevo");
            }}
          >
            Nuevo
          </Button>
        </div>
        <TablaCentroCostos
          centroCostos={centroCostos}
          onOpen={onOpen}
          setSelectModal={setSelectModal}
          setSelectedCentroCosto={setSelectedCentroCosto}
        />
        {selectModal === "eliminar" && (
          <ModalEliminarCentroCostos
            key={selectedCentroCosto?.id}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            handleFindCentroCostos={handleFindCentroCostos}
            setSelectedCentroCosto={setSelectedCentroCosto}
            selectedCentroCosto={selectedCentroCosto}
          />
        )}
        {selectModal === "editar" && (
          <ModalEditarCentroCostos
            key={selectedCentroCosto?.id}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            handleFindCentroCostos={handleFindCentroCostos}
            setSelectedCentroCosto={setSelectedCentroCosto}
            selectedCentroCosto={selectedCentroCosto}
          />
        )}
        {selectModal === "nuevo" && (
          <ModalNuevoCentroCostos
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            handleFindCentroCostos={handleFindCentroCostos}
          />
        )}
      </div>
    </div>
  );
};

export default CentroCostos;
