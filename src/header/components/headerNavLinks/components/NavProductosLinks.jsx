import { IoMdArrowDropdown } from "react-icons/io";
import { MdOutlineCircle } from "react-icons/md";
import { RiShoppingBasket2Line } from "react-icons/ri";
import { Link } from "react-router-dom";

const NavProductosLinks = ({ openListModule, setOpenListModule }) => {
  return (
    <>
      <div
        className={` flex items-center p-4 px-6   hover:bg-blue-700 hover:text-white w-full cursor-pointer ${
          openListModule === "productos"
            ? "bg-blue-700 text-white hover:bg-blue-700"
            : " text-stone-700  "
        } transition-all duration-300 border-b-1 border-zinc-300  hover:scale-105`}
        to="/"
        onClick={() => {
          openListModule === "productos"
            ? setOpenListModule("")
            : setOpenListModule("productos");
        }}
      >
        <div className="w-full flex gap-4 items-center">
          <RiShoppingBasket2Line className="text-2xl" />
          <p className="text-base">Productos</p>
        </div>
        <IoMdArrowDropdown className="text-2xl" />
      </div>
      <div
        className={`${
          openListModule === "productos" ? "h-[100px]" : "h-[0px]"
        } w-full bg-blue-700 text-white  transition-all duration-300  `}
      >
        <Link
          className=" h-[50px] flex items-center gap-4 px-8 hover:bg-blue-600 w-full transition-all duration-300"
          to="/productos/comercializacion-servicios"
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Comercialización y servicios</p>
        </Link>
        <Link
          className=" h-[50px] flex items-center gap-4 px-8 hover:bg-blue-600 w-full transition-all duration-300"
          to="/productos/costos-gastos"
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Costos y gastos</p>
        </Link>
      </div>
    </>
  );
};

export default NavProductosLinks;
