import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { MdOutlineCircle } from "react-icons/md";
import { Link } from "react-router-dom";

const NavAjustesLinks = ({
  openListModule,
  setOpenListModule,
  setIsMenuOpen,
}) => {
  return (
    <>
      <div
        className={` flex items-center p-4 px-6   hover:bg-blue-700 hover:text-white w-full cursor-pointer ${
          openListModule === "ajustes"
            ? "bg-blue-700 text-white hover:bg-blue-700"
            : " text-stone-700  "
        } transition-all duration-300 border-b-1 border-zinc-300  hover:scale-105`}
        to="/"
        onClick={() => {
          openListModule === "ajustes"
            ? setOpenListModule("")
            : setOpenListModule("ajustes");
        }}
      >
        <div className="w-full flex gap-4 items-center">
          <IoSettings className="text-2xl" />
          <p className="text-base">Ajustes</p>
        </div>
        <IoMdArrowDropdown className="text-2xl" />
      </div>
      <div
        className={`${
          openListModule === "ajustes" ? "min-h-[200px]" : "h-[0px]"
        } w-full bg-blue-700 text-white  transition-all duration-300  overflow-hidden `}
      >
        <Link
          className=" h-[50px] flex items-center gap-4 px-8 hover:bg-blue-600 w-full transition-all duration-300"
          to="/ajustes/metodo-pago-gasto"
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Metodos De Pagos y Gastos</p>
        </Link>
        <Link
          className="h-[50px] flex items-center gap-4 px-8  hover:bg-blue-600 w-full transition-all duration-300"
          to="/ajustes/bancos-cuentas-bancarias"
          onClick={() => setIsMenuOpen(false)}
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Bancos y Cuentas Bancarias</p>
        </Link>
        <Link
          className="h-[50px] flex items-center gap-4 px-8  hover:bg-blue-600 w-full transition-all duration-300"
          to="/ajustes/encargados"
          onClick={() => setIsMenuOpen(false)}
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Encargados</p>
        </Link>
        <Link
          className="h-[50px] flex items-center gap-4 px-8  hover:bg-blue-600 w-full transition-all duration-300"
          to="/ajustes/centro-costos"
          onClick={() => setIsMenuOpen(false)}
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Centro costos</p>
        </Link>
      </div>
    </>
  );
};

export default NavAjustesLinks;
