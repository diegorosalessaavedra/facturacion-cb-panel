import { Button, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FiCreditCard } from "react-icons/fi"; // Ícono agregado
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
    <section className="w-[60%] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Cabecera estilo Card */}
      <div className="w-full px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg">
            <FiCreditCard size={18} />
          </div>
          <div>
            <h2 className="text-slate-800 font-bold text-md">
              Cuentas Bancarias
            </h2>
            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Cuentas Registradas
            </p>
          </div>
        </div>
        <Button
          color="primary"
          size="sm"
          startContent={<FaPlus />}
          onPress={() => {
            onOpen();
            setSelectModal("nuevo");
          }}
          className="font-medium bg-slate-900"
        >
          Nueva Cuenta
        </Button>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="p-4">
        <TablaCuentasBanco
          cuentasBancarias={cuentasBancarias}
          onOpen={onOpen}
          setSelectModal={setSelectModal}
          setSelectCuentaBancaria={setSelectCuentaBancaria}
        />
      </div>

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
      )}
    </section>
  );
};

export default CuentasBancarias;
