import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdOutlineCircle } from "react-icons/md";
import { RiBillFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const NavComprobantesLinks = ({
  openListModule,
  setOpenListModule,
  setIsMenuOpen,
}) => {
  return (
    <>
      {" "}
      <div
        className={` flex items-center p-4 px-6   hover:bg-blue-700 hover:text-white w-full cursor-pointer ${
          openListModule === "comprobantes"
            ? "bg-blue-700 text-white hover:bg-blue-700"
            : " text-stone-700  "
        } transition-all duration-300 border-b-1 border-zinc-300  hover:scale-105`}
        to="/"
        onClick={() => {
          openListModule === "comprobantes"
            ? setOpenListModule("")
            : setOpenListModule("comprobantes");
        }}
      >
        <div className="w-full flex gap-4 items-center">
          <RiBillFill className="text-xl" />
          <p className="text-base">Comprobantes</p>
        </div>
        <IoMdArrowDropdown className="text-2xl" />
      </div>
      <div
        className={`${
          openListModule === "comprobantes" ? "h-[100px]" : "h-[0px] "
        } w-full bg-blue-700 text-white  transition-all duration-300   `}
      >
        {" "}
        <Link
          className="h-[50px] flex items-center gap-4 px-8  hover:bg-blue-600 w-full transition-all duration-300"
          to="/comprobantes/comprobante-electronico"
          onClick={() => setIsMenuOpen(false)}
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Emitir comprobantes de venta sin cotización</p>
        </Link>
        <Link
          className="h-[50px] flex items-center gap-4 px-8  hover:bg-blue-600 w-full transition-all duration-300"
          to="/comprobantes/tus-comprobantes"
          onClick={() => setIsMenuOpen(false)}
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Status comprobante de venta</p>
        </Link>
      </div>
    </>
  );
};

export default NavComprobantesLinks;
