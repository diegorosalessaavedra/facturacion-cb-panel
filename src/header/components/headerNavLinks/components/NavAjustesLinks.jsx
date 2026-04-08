import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { MdOutlineCircle } from "react-icons/md";
import { Link } from "react-router-dom";

const NavAjustesLinks = ({
  openListModule,
  setOpenListModule,
  setIsMenuOpen,
}) => {
  const isOpen = openListModule === "ajustes";

  // Arreglo de rutas para limpiar el JSX y hacerlo más mantenible
  const menuLinks = [
    { to: "/ajustes/metodo-pago-gasto", label: "Métodos de Pagos y Gastos" },
    {
      to: "/ajustes/bancos-cuentas-bancarias",
      label: "Bancos y Cuentas Bancarias",
    },
    { to: "/ajustes/encargados", label: "Encargados" },
    { to: "/ajustes/centro-costos", label: "Centro de Costos" },
  ];

  return (
    <div className="w-[280px] bg-slate-900 flex flex-col border-t-[0.5px] border-slate-400">
      {/* --- BOTÓN PRINCIPAL --- */}
      <div
        className={`w-full flex items-center justify-between p-4 px-6 cursor-pointer transition-all duration-300 ease-out
          ${
            isOpen
              ? "bg-slate-800 text-white border-l-4 border-amber-500 shadow-md shadow-slate-950/50"
              : "text-slate-300 border-l-4 border-transparent hover:bg-slate-800/80 hover:text-white"
          }
        `}
        onClick={() => {
          setOpenListModule(isOpen ? "" : "ajustes");
        }}
      >
        <div className="flex gap-4 items-center">
          {/* Engranaje con un rebote sutil en la rotación */}
          <IoSettings
            className={`text-xl transition-transform duration-500 ease-out ${
              isOpen ? "rotate-90 text-amber-500" : "text-slate-400"
            }`}
          />
          <p className="text-base font-medium transition-colors duration-300">
            Ajustes
          </p>
        </div>

        {/* Flecha con rotación animada */}
        <IoMdArrowDropdown
          className={`text-2xl transition-transform duration-400 ease-in-out ${
            isOpen ? "rotate-180 text-amber-500" : "text-slate-400"
          }`}
        />
      </div>

      {/* --- SUB-MENÚ (ACORDEÓN) --- */}
      <div
        className={`w-full flex flex-col bg-slate-900 overflow-hidden transition-all duration-400 ease-in-out
          ${isOpen ? "max-h-[400px] opacity-100 py-2" : "max-h-0 opacity-0 py-0"}
        `}
      >
        {menuLinks.map((link, idx) => (
          <Link
            key={idx}
            className="group flex items-center gap-4 px-8 py-3 text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors duration-300 ease-out"
            to={link.to}
            onClick={() => setIsMenuOpen(false)}
          >
            {/* Círculo que crece y se pinta de ámbar al hacer hover */}
            <MdOutlineCircle className="text-[10px] text-slate-500 transition-all duration-300 ease-out group-hover:text-amber-500 group-hover:scale-[1.3]" />
            {/* Texto que se desliza sutilmente a la derecha */}
            <p className="text-sm transition-transform duration-300 ease-out group-hover:translate-x-1.5">
              {link.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavAjustesLinks;
