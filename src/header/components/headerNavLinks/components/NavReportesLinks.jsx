import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdOutlineCircle } from "react-icons/md";
import { TbReport } from "react-icons/tb";
import { Link } from "react-router-dom";

const NavReportesLinks = ({
  openListModule,
  setOpenListModule,
  setIsMenuOpen,
}) => {
  return (
    <>
      <div
        className={`w-[280px] flex items-center p-4 px-6   hover:bg-blue-700 hover:text-white cursor-pointer ${
          openListModule === "reportes"
            ? "bg-blue-700 text-white hover:bg-blue-700"
            : " text-stone-700  "
        } transition-all duration-300 border-b-1 border-zinc-300  hover:scale-105`}
        to="/"
        onClick={() => {
          openListModule === "reportes"
            ? setOpenListModule("")
            : setOpenListModule("reportes");
        }}
      >
        <div className="w-full flex gap-4 items-center">
          <TbReport className="text-2xl" />
          <p className="text-base">Reportes</p>
        </div>
        <IoMdArrowDropdown className="text-2xl" />
      </div>
      <div
        className={`${
          openListModule === "reportes" ? "h-[100px]" : "h-[0px]"
        } w-full bg-blue-700 text-white  transition-all duration-300  `}
      >
        <Link
          className=" h-[50px] flex items-center gap-4 px-8 hover:bg-blue-600 w-max transition-all duration-300"
          to="/reportes/reporte-cotizaciones"
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Reporte de cotizaciones</p>
        </Link>
        <Link
          className=" h-[50px] flex items-center gap-4 px-8 hover:bg-blue-600 w-max transition-all duration-300"
          to="/reportes/reporte-solped"
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Reporte SOLPED</p>
        </Link>
      </div>
    </>
  );
};

export default NavReportesLinks;
