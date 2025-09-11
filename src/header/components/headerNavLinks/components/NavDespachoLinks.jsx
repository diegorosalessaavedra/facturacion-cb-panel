import { FaBoxOpen } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdOutlineCircle } from "react-icons/md";
import { Link } from "react-router-dom";

const NavDespachoLinks = ({
  openListModule,
  setOpenListModule,
  setIsMenuOpen,
}) => {
  return (
    <>
      <div
        className={` flex items-center p-4 px-6   hover:bg-blue-700 hover:text-white w-full cursor-pointer ${
          openListModule === "despacho"
            ? "bg-blue-700 text-white hover:bg-blue-700"
            : " text-stone-700  "
        } transition-all duration-300 border-b-1 border-zinc-300  hover:scale-105`}
        to="/"
        onClick={() => {
          openListModule === "despacho"
            ? setOpenListModule("")
            : setOpenListModule("despacho");
        }}
      >
        <div className="w-full flex gap-4 items-center">
          <FaBoxOpen className="text-2xl" />
          <p className="text-base">Despacho</p>
        </div>
        <IoMdArrowDropdown className="text-2xl" />
      </div>
      <div
        className={`${
          openListModule === "despacho" ? "min-h-[50px]" : "h-[0px]"
        } w-full bg-blue-700 text-white  transition-all duration-300  overflow-hidden `}
      >
        <Link
          className=" h-[50px] flex items-center gap-4 px-8 hover:bg-blue-600 w-full transition-all duration-300"
          to="/despacho/tiempo-real"
          onClick={() => setIsMenuOpen(false)}
        >
          <MdOutlineCircle className="text-sm" />
          <p className="text-sm">Despacho en tiempo real</p>
        </Link>
      </div>
    </>
  );
};

export default NavDespachoLinks;
