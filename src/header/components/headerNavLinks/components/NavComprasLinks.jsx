import React from "react";
import { FiShoppingBag } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdOutlineCircle } from "react-icons/md";
import { Link } from "react-router-dom";

const NavComprasLinks = ({
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
          openListModule === "compras"
            ? setOpenListModule("")
            : setOpenListModule("compras");
        }}
      >
        <div className="w-full flex gap-4 items-center">
          <FiShoppingBag className="text-xl" />
          <p className="text-base">Compras</p>
        </div>
        <IoMdArrowDropdown className="text-2xl" />
      </div>
      <div
        className={`${
          openListModule === "compras" ? "h-[100px]" : "h-[0px]"
        } w-full bg-blue-700 text-white  transition-all duration-300  `}
      >
        <Link
          className="h-[50px] flex items-center gap-4 px-8  hover:bg-blue-600 w-[280px] transition-all duration-300"
          to="/compras/nueva-orden-compra"
          onClick={() => setIsMenuOpen(false)}
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">SOLPED</p>
        </Link>
        <Link
          className=" h-[50px] flex items-center gap-4 px-8 hover:bg-blue-600 w-[280px] transition-all duration-300"
          to="/compras/ordenes-compra"
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Status SOLPED</p>
        </Link>
      </div>
    </>
  );
};

export default NavComprasLinks;
