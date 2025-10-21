import { FaUsers } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdOutlineCircle } from "react-icons/md";
import { Link } from "react-router-dom";

const NavRRHHLinks = ({ openListModule, setOpenListModule, userData }) => {
  return (
    <>
      <div
        className="w-[280px] text-stone-700 flex items-center p-4  px-6 cursor-pointer hover:bg-blue-700 hover:text-white transition-all duration-300  border-b-1 border-zinc-300 "
        onClick={() => {
          openListModule === "rrhh"
            ? setOpenListModule("")
            : setOpenListModule("rrhh");
        }}
      >
        <div className="w-full flex gap-4 items-center">
          <FaUsers className="text-2xl" />
          <p className="text-base">RRHH</p>
        </div>
        <IoMdArrowDropdown className="text-2xl" />
      </div>
      <div
        className={`${
          openListModule === "rrhh"
            ? "min-h-[350px] h-[350px]"
            : " min-h-[0px] h-[0px]"
        } w-full bg-blue-700 text-white  transition-all duration-300  overflow-hidden `}
      >
        <Link
          className=" h-[50px] flex items-center gap-4 px-8 hover:bg-blue-600 w-[280px] transition-all duration-300"
          to="/rrhh/colaboradores"
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Colaboradores </p>
        </Link>
        <Link
          className=" h-[50px] flex items-center gap-4 px-8 hover:bg-blue-600 w-[280px] transition-all duration-300"
          to="/rrhh/colaboradores-baja"
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Colaboradores de baja </p>
        </Link>
        <Link
          className=" h-[50px] flex items-center gap-4 px-8 hover:bg-blue-600 w-[280px] transition-all duration-300"
          to="/rrhh/cargo-laboral"
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Cargo Laboral </p>
        </Link>
        <Link
          className=" h-[50px] flex items-center gap-4 px-8 hover:bg-blue-600 w-[280px] transition-all duration-300"
          to="/rrhh/descanso-medicos"
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Descanso Medicos </p>
        </Link>
        {userData?.role === "GERENTE" && (
          <Link
            className=" h-[50px] flex items-center gap-4 px-8 hover:bg-blue-600 w-[280px] transition-all duration-300"
            to="/rrhh/solicitudes-descansos-medicos"
          >
            <MdOutlineCircle className="text-sm" />
            <p className="text-sm">Solicitudes descansos médicos </p>
          </Link>
        )}
        <Link
          className=" h-[50px] flex items-center gap-4 px-8 hover:bg-blue-600 w-[280px] transition-all duration-300"
          to="/rrhh/vacaciones"
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Vacaciones </p>
        </Link>
        {userData?.role === "GERENTE" && (
          <Link
            className=" h-[50px] flex items-center gap-4 px-8 hover:bg-blue-600 w-[280px] transition-all duration-300"
            to="/rrhh/solicitudes-vacaciones"
          >
            <MdOutlineCircle className="text-sm" />
            <p className="text-sm">Solicitudes Vacaciones </p>
          </Link>
        )}

        {/* <Link
          className="h-[50px] flex items-center gap-4 px-8  hover:bg-blue-600 w-full transition-all duration-300"
          to="/rrhh/encargados"
          onClick={() => setIsMenuOpen(false)}
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Encargados</p>
        </Link> */}
      </div>
    </>
  );
};

export default NavRRHHLinks;
