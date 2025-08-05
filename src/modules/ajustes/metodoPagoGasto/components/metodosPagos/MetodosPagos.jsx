import React, { useEffect, useState } from "react";
import TablametodosPagos from "./components/TablaMetodosPagos";
import axios from "axios";
import config from "../../../../../utils/getToken";
import { Button, useDisclosure } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa";
import ModalNuevoMetodoGasto from "./components/ModalNuevoMetodoPago";
import TablaMetodosPagos from "./components/TablaMetodosPagos";
import ModalEliminarMetodoPago from "./components/ModalEliminarMetodoPago";

const MetodosPagos = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [metodosPagos, setMetodosPagos] = useState([]);
  const [selectModal, setSelectModal] = useState();
  const [selectPago, setSelectPago] = useState();

  const handleFindPagos = () => {
    const url = `${import.meta.env.VITE_URL_API}/ajustes/metodos-pago`;

    axios.get(url, config).then((res) => setMetodosPagos(res.data.metodosPago));
  };

  useEffect(() => {
    handleFindPagos();
  }, []);

  return (
    <div>
      <div className="w-full px-6 py-4 bg-blue-600 flex items-center     justify-between">
        <h2 className=" text-white font-normal text-lg">
          Métodos de pago - ingreso
        </h2>
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
      <TablaMetodosPagos
        metodosPagos={metodosPagos}
        onOpen={onOpen}
        setSelectModal={setSelectModal}
        setSelectPago={setSelectPago}
      />
      {selectModal === "eliminar" && (
        <ModalEliminarMetodoPago
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindPagos={handleFindPagos}
          setSelectPago={setSelectPago}
          selectPago={selectPago}
        />
      )}
      {selectModal === "nuevo" && (
        <ModalNuevoMetodoGasto
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindPagos={handleFindPagos}
        />
      )}
    </div>
  );
};

export default MetodosPagos;
