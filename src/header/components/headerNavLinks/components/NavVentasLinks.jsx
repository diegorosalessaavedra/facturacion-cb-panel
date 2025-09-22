import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineCircle } from "react-icons/md";
import { Link } from "react-router-dom";

const NavVentasLinks = ({
  openListModule,
  setOpenListModule,
  setIsMenuOpen,
  userData,
}) => {
  return (
    <>
      {" "}
      <div
        className={`w-[280px] flex items-center p-4 px-6   hover:bg-blue-700 hover:text-white  cursor-pointer ${
          openListModule === "ventas"
            ? "bg-blue-700 text-white hover:bg-blue-700"
            : " text-stone-700  "
        } transition-all duration-300 border-b-1 border-zinc-300  hover:scale-105`}
        to="/"
        onClick={() => {
          openListModule === "ventas"
            ? setOpenListModule("")
            : setOpenListModule("ventas");
        }}
      >
        <div className="w-full flex gap-4 items-center">
          <IoDocumentTextOutline className="text-2xl" />
          <p className="text-base">Ventas</p>
        </div>
        <IoMdArrowDropdown className="text-2xl" />
      </div>
      <div
        className={`${
          openListModule === "ventas" ? "h-[150px]" : "h-[0px]"
        } w-full bg-blue-700 text-white  transition-all duration-300  `}
      >
        <Link
          className="h-[50px] flex items-center gap-4 px-8  hover:bg-blue-600 w-full transition-all duration-300"
          to="/ventas/crear-cotizacion"
          onClick={() => setIsMenuOpen(false)}
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Nueva Cotización</p>
        </Link>
        <Link
          className="h-[50px] flex items-center gap-4 px-8  hover:bg-blue-600 w-full transition-all duration-300"
          to="/ventas/comprobantes-cotizacion"
          onClick={() => setIsMenuOpen(false)}
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Facturas y boletas emitidas</p>
        </Link>
        <Link
          className=" h-[50px] flex items-center gap-4 px-8 hover:bg-blue-600 w-full transition-all duration-300"
          to="/ventas/cotizaciones"
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Cotizaciones</p>
        </Link>
      </div>
    </>
  );
};

export default NavVentasLinks;
