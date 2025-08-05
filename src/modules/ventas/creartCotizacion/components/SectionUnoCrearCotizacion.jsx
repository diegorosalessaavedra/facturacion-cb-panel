import React from "react";

const SectionUnoCrearCotizacion = () => {
  return (
    <section className="w-full flex px-10 py-6 gap-10 items-center">
      <img className="w-32 h-28" src={import.meta.env.VITE_LOGO} alt="" />
      <div className="flex flex-col ">
        <h1 className="text-sm font-bold">COTIZACIÓN</h1>
        <h2 className="text-sm font-bold">COT-XXX</h2>
        <h2 className="text-sm font-bold">{import.meta.env.VITE_NOMBRE}</h2>
        <ul>
          <li className="text-stone-400 text-xs font-medium">
            {import.meta.env.VITE_DIRRECION}{" "}
          </li>
          <li className="text-stone-400 text-xs font-medium">
            {import.meta.env.VITE_CORREO} - {import.meta.env.VITE_TELEFONO}
          </li>
        </ul>
      </div>
    </section>
  );
};

export default SectionUnoCrearCotizacion;
