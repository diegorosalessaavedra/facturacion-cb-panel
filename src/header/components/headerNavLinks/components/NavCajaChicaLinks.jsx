import { FaDropbox } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { MdOutlineCircle } from "react-icons/md";
import { Link } from "react-router-dom";

const NavCajaChicaLinks = ({
  openListModule,
  setOpenListModule,
  setIsMenuOpen,
}) => {
  return (
    <>
      <div
        className={`w-[280px] flex items-center p-4 px-6   hover:bg-blue-700 hover:text-white  cursor-pointer ${
          openListModule === "caja-chica"
            ? "bg-blue-700 text-white hover:bg-blue-700"
            : " text-stone-700  "
        } transition-all duration-300 border-b-1 border-zinc-300  hover:scale-105`}
        to="/"
        onClick={() => {
          openListModule === "caja-chica"
            ? setOpenListModule("")
            : setOpenListModule("caja-chica");
        }}
      >
        <div className="w-full flex gap-4 items-center">
          <FaDropbox className="text-2xl" />
          <p className="text-base">Caja Chica</p>
        </div>
        <IoMdArrowDropdown className="text-2xl" />
      </div>
      <div
        className={`${
          openListModule === "caja-chica" ? "min-h-[250px]" : "h-[0px]"
        } w-full bg-blue-700 text-white  transition-all duration-300  overflow-hidden `}
      >
        <Link
          className=" h-[50px] flex items-center gap-4 px-8 hover:bg-blue-600 w-[280px] transition-all duration-300"
          to="/caja-chica/categoria-centro-costos"
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Categoria de Gasto y Conceptos de Rendición</p>
        </Link>
        <Link
          className="h-[50px] flex items-center gap-4 px-8  hover:bg-blue-600 w-[280px] transition-all duration-300"
          to="/caja-chica/trabajadores"
          onClick={() => setIsMenuOpen(false)}
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Trabajadores</p>
        </Link>
        <Link
          className="h-[50px] flex items-center gap-4 px-8  hover:bg-blue-600 w-[280px] transition-all duration-300"
          to="/caja-chica/aperturas"
          onClick={() => setIsMenuOpen(false)}
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Plantilla Aperturas</p>
        </Link>
        <Link
          className="h-[50px] flex items-center gap-4 px-8  hover:bg-blue-600 w-[280px] transition-all duration-300"
          to="/caja-chica/desembolsos"
          onClick={() => setIsMenuOpen(false)}
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Plantilla Desembolso</p>
        </Link>
        <Link
          className="h-[50px] flex items-center gap-4 px-8  hover:bg-blue-600 w-[280px] transition-all duration-300"
          to="/caja-chica/rendicion"
          onClick={() => setIsMenuOpen(false)}
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Plantilla Rendición</p>
        </Link>
      </div>
    </>
  );
};

export default NavCajaChicaLinks;
