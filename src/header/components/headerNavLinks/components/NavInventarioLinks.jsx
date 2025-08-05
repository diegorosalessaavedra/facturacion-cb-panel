import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { MdOutlineCircle } from "react-icons/md";
import { Link } from "react-router-dom";

const NavInventarioLinks = ({ openListModule, setOpenListModule }) => {
  return (
    <>
      <div
        className={` flex items-center p-4 px-6   hover:bg-blue-700 hover:text-white w-full cursor-pointer ${
          openListModule === "inventario"
            ? "bg-blue-700 text-white hover:bg-blue-700"
            : " text-stone-700  "
        } transition-all duration-300 border-b-1 border-zinc-300  hover:scale-105`}
        to="/"
        onClick={() => {
          openListModule === "inventario"
            ? setOpenListModule("")
            : setOpenListModule("inventario");
        }}
      >
        <div className="w-full flex gap-4 items-center">
          <IoSettings className="text-2xl" />
          <p className="text-base">Inventario</p>
        </div>
        <IoMdArrowDropdown className="text-2xl" />
      </div>
      <div
        className={`${
          openListModule === "inventario" ? "min-h-[50px]" : "h-[0px]"
        } w-full bg-blue-700 text-white  transition-all duration-300  overflow-hidden `}
      >
        <Link
          className=" h-[50px] flex items-center gap-4 px-8 hover:bg-blue-600 w-full transition-all duration-300"
          to="/inventario/reporte-kardex"
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Reporte de Kardex</p>
        </Link>
      </div>
    </>
  );
};

export default NavInventarioLinks;
