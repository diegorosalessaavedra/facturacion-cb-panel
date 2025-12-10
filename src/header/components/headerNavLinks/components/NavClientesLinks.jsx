import React from "react";
import { FaUserGroup } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdOutlineCircle } from "react-icons/md";
import { Link } from "react-router-dom";

const NavClientesLinks = ({
  openListModule,
  setOpenListModule,
  setIsMenuOpen,
}) => {
  return (
    <>
      <div
        className="w-[280px] text-stone-700 flex items-center p-4  px-6 cursor-pointer hover:bg-blue-700 hover:text-white transition-all duration-300  border-b-1 border-zinc-300  hover:scale-105"
        to="/"
        onClick={() => {
          openListModule === "clientes"
            ? setOpenListModule("")
            : setOpenListModule("clientes");
        }}
      >
        <div className="w-full flex gap-4 items-center ">
          <FaUserGroup className="text-xl" />
          <p className="text-sm">
            Clientes / Proveedores <br />
            Agencias
          </p>
        </div>
        <IoMdArrowDropdown className="text-2xl" />
      </div>
      <div
        className={`${
          openListModule === "clientes" ? "h-[150px]" : "h-[0px]"
        } min-w-full bg-blue-700 text-white  transition-all duration-300  `}
      >
        <Link
          className="w-[280px] h-[50px] flex items-center gap-4 px-8 hover:bg-blue-600  transition-all duration-300"
          to="/clientes/tus-clientes"
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Clientes</p>
        </Link>
        <Link
          className="w-[280px] h-[50px] flex items-center gap-4 px-8  hover:bg-blue-600  transition-all duration-300"
          to="/clientes/tus-proveedores"
          onClick={() => setIsMenuOpen(false)}
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Proveedores</p>
        </Link>
        <Link
          className="w-[280px] h-[50px] flex items-center gap-4 px-8  hover:bg-blue-600  transition-all duration-300"
          to="/clientes/agencias"
          onClick={() => setIsMenuOpen(false)}
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Agencias</p>
        </Link>
      </div>
    </>
  );
};

export default NavClientesLinks;
