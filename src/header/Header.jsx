import React, { useState, useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import { Link } from "react-router-dom";
import HeaderProfile from "./components/HeaderProfile";
import { IoGrid } from "react-icons/io5";
import HeaderNavLinks from "./components/headerNavLinks/HeaderNavLinks";

const Header = ({ userData }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [openListModule, setOpenListModule] = useState("");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event) => {
    // Verifica si el clic ocurrió fuera del contenedor
    if (event.target.closest(".menu-container") === null) {
      setOpenListModule("");
    }
  };

  useEffect(() => {
    // Agrega el evento de clic al documento
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      // Limpia el evento al desmontar el componente
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="group relative min-w-[60px] max-w-[60px] h-[100vh] bg-white shadow-lg shadow-slate-400 flex flex-col items-center py-6  gap-5 menu-container
    hover:min-w-[280px] hover:max-w-[280px] duration-300
    "
    >
      <HeaderProfile userData={userData} />
      <Link className=" h-28" to="/">
        <img
          className="w-28  opacity-0 group-hover:opacity-100 duration-300"
          src={import.meta.env.VITE_LOGO}
          alt=""
        />
      </Link>
      <HeaderNavLinks
        openListModule={openListModule}
        setOpenListModule={setOpenListModule}
        setIsMenuOpen={setIsMenuOpen}
        userData={userData}
      />
      <div className="block md:hidden">
        {isMenuOpen ? (
          <IoIosClose
            className="text-stone-700 text-4xl cursor-pointer"
            onClick={toggleMenu}
          />
        ) : (
          <IoGrid
            className="text-stone-700 text-4xl cursor-pointer"
            onClick={toggleMenu}
          />
        )}
      </div>
    </div>
  );
};

export default Header;
