import { Button, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FiBriefcase } from "react-icons/fi"; // Ícono agregado
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
    <section className="w-[40%] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Cabecera estilo Card */}
      <div className="w-full px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 text-slate-600 rounded-lg">
            <FiBriefcase size={18} />
          </div>
          <div>
            <h2 className="text-slate-800 font-bold text-md">Tus Bancos</h2>
            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Entidades Financieras
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
          Nuevo Banco
        </Button>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="p-4">
        <TablaBancos
          bancos={bancos}
          onOpen={onOpen}
          setSelectModal={setSelectModal}
          setSelectBanco={setSelectBanco}
        />
      </div>

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
      )}
    </section>
  );
};

export default Bancos;
