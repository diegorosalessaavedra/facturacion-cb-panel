import { Button, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import TablaCuentasBanco from "./components/TablaCuentasBanco";
import axios from "axios";
import ModalEliminarCuentasBancarias from "./components/ModalEliminarCuentasBancarias";
import ModalNuevaCuentaBancaria from "./components/ModalNuevaCuentaBancaria";
import config from "../../../../../utils/getToken";

const CuentasBancarias = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [cuentasBancarias, setCuentasBancarias] = useState([]);
  const [selectModal, setSelectModal] = useState();
  const [selectCuentaBancaria, setSelectCuentaBancaria] = useState();

  const handleFindCuentasBancarias = () => {
    const url = `${import.meta.env.VITE_URL_API}/ajustes/cuentas-banco`;

    axios
      .get(url, config)
      .then((res) => setCuentasBancarias(res.data.cuentasBancarias));
  };

  useEffect(() => {
    handleFindCuentasBancarias();
  }, []);
  return (
    <div>
      <div className="w-full px-6 py-4 bg-blue-600 flex items-center     justify-between">
        <h2 className=" text-white font-normal text-lg">Cuentas Bancarias</h2>
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
      <TablaCuentasBanco
        cuentasBancarias={cuentasBancarias}
        onOpen={onOpen}
        setSelectModal={setSelectModal}
        setSelectCuentaBancaria={setSelectCuentaBancaria}
      />
      {selectModal === "eliminar" && (
        <ModalEliminarCuentasBancarias
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindCuentasBancarias={handleFindCuentasBancarias}
          setSelectCuentaBancaria={setSelectCuentaBancaria}
          selectCuentaBancaria={selectCuentaBancaria}
        />
      )}
      {selectModal === "nuevo" && (
        <ModalNuevaCuentaBancaria
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindCuentasBancarias={handleFindCuentasBancarias}
        />
      )}{" "}
    </div>
  );
};

export default CuentasBancarias;
