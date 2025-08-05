import React from "react";
import MetodosGastos from "./components/metodosGastos/MetodosGastos";
import MetodosPagos from "./components/metodosPagos/MetodosPagos";

const MetodosPagosGastos = () => {
  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      <div className="w-full h-full bg-white flex flex-col gap-4 rounded-md  overflow-y-auto overflow-x-hidden">
        {/* <MetodosGastos /> */}
        <MetodosPagos />
      </div>
    </div>
  );
};

export default MetodosPagosGastos;
