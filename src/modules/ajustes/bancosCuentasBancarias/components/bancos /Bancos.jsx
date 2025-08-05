import { Button, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import TablaBancos from "./components/TablaBancos";
import config from "../../../../../utils/getToken";
import ModalEliminarBanco from "./components/ModalEliminarBanco ";
import ModalNuevoBanco from "./components/ModalNuevoBanco";

const Bancos = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [bancos, setBancos] = useState([]);
  const [selectModal, setSelectModal] = useState();
  const [selectBanco, setSelectBanco] = useState();

  const handleFindBancos = () => {
    const url = `${import.meta.env.VITE_URL_API}/ajustes/bancos`;

    axios.get(url, config).then((res) => setBancos(res.data.bancos));
  };

  useEffect(() => {
    handleFindBancos();
  }, []);

  return (
    <>
      <div className="w-full px-6 py-4 bg-blue-600 flex items-center     justify-between">
        <h2 className=" text-white font-normal text-lg">Tus Bancos</h2>
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
      <TablaBancos
        bancos={bancos}
        onOpen={onOpen}
        setSelectModal={setSelectModal}
        setSelectBanco={setSelectBanco}
      />
      {selectModal === "eliminar" && (
        <ModalEliminarBanco
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindBancos={handleFindBancos}
          selectBanco={selectBanco}
        />
      )}
      {selectModal === "nuevo" && (
        <ModalNuevoBanco
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindBancos={handleFindBancos}
        />
      )}{" "}
    </>
  );
};

export default Bancos;
