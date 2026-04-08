import React, { useState, useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import { Link } from "react-router-dom";
import HeaderProfile from "./components/HeaderProfile";
import { IoGrid } from "react-icons/io5";
import HeaderNavLinks from "./components/headerNavLinks/HeaderNavLinks";

const Header = ({ userData }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Cambiado a false
  const [openListModule, setOpenListModule] = useState("");
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <aside
      className={`group relative h-screen bg-slate-900 shadow-2xl transition-all duration-300 
      ${isMenuOpen ? "w-[260px] max-w-[260px]" : "min-w-[60px]  max-w-[60px] hover:min-w-[260px] hover:max-w-[260px]"}
      `}
    >
      {/* Perfil que se mueve con el sidebar */}
      <HeaderProfile userData={userData} />

      <div className="w-full flex flex-col h-full pt-4  gap-4">
        {/* Logo area */}
        <Link className="px-2 h-28 flex items-center justify-center" to="/">
          <img
            className="w-full h-fit rounded-md group-hover:h-28   group-hover:w-fit duration-300"
            src={import.meta.env.VITE_LOGO || "/logo.jpg"}
            alt=""
          />
        </Link>

        {/* Navegación con scroll independiente */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar border-t-1 border-slate-400 pt-2">
          <HeaderNavLinks
            openListModule={openListModule}
            setOpenListModule={setOpenListModule}
            setIsMenuOpen={setIsMenuOpen}
            userData={userData}
          />
        </div>

        {/* Toggle para Móviles */}
        <div className="md:hidden flex justify-center p-4 border-t border-slate-800">
          <button onClick={toggleMenu} className="text-slate-400 text-3xl">
            {isMenuOpen ? <IoIosClose /> : <IoGrid />}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Header;
