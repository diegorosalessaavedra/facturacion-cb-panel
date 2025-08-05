import React, { useEffect, useState } from "react";
import TablaMetodosGastos from "./components/TablaMetodosGastos";
import axios from "axios";
import config from "../../../../../utils/getToken";
import { Button, useDisclosure } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa";
import ModalNuevoMetodoGasto from "./components/ModalNuevoMetodoGasto";
import ModalEliminarMetodoGasto from "./components/ModalEliminarMetodoGasto ";

const MetodosGastos = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [metodosGastos, setMetodosGastos] = useState([]);
  const [selectModal, setSelectModal] = useState();
  const [selectGasto, setSelectGasto] = useState();

  const getGastos = () => {
    const url = `${import.meta.env.VITE_URL_API}/ajustes/metodos-gasto`;

    axios
      .get(url, config)
      .then((res) => setMetodosGastos(res.data.metodosGasto));
  };

  useEffect(() => {
    getGastos();
  }, []);

  return (
    <div>
      <div className="w-full px-6 py-4 bg-blue-600 flex items-center     justify-between">
        <h2 className=" text-white font-normal text-lg">Métodos de gasto</h2>
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
      <TablaMetodosGastos
        metodosGastos={metodosGastos}
        onOpen={onOpen}
        setSelectModal={setSelectModal}
        setSelectGasto={setSelectGasto}
      />
      {selectModal === "eliminar" && (
        <ModalEliminarMetodoGasto
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          getGastos={getGastos}
          setSelectGasto={setSelectGasto}
          selectGasto={selectGasto}
        />
      )}
      {selectModal === "nuevo" && (
        <ModalNuevoMetodoGasto
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          getGastos={getGastos}
        />
      )}
    </div>
  );
};

export default MetodosGastos;
