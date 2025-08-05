import React from "react";
import Bancos from "./components/bancos /Bancos";
import CuentasBancarias from "./components/cuentasBancarias/CuentasBancarias";

const BancosCuentasBancarias = () => {
  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      <div className="w-full h-full bg-white flex flex-col gap-4 rounded-md  overflow-y-auto overflow-x-hidden">
        <Bancos />
        <CuentasBancarias />
      </div>
    </div>
  );
};

export default BancosCuentasBancarias;
