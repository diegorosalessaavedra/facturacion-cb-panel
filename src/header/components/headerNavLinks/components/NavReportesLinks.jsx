import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdOutlineCircle } from "react-icons/md";
import { TbReport } from "react-icons/tb";
import { Link } from "react-router-dom";

const NavReportesLinks = ({
  openListModule,
  setOpenListModule,
  setIsMenuOpen, // Para cerrar el menú lateral en móviles
}) => {
  const isOpen = openListModule === "reportes";

  // Arreglo de rutas para mantener el código limpio
  const menuLinks = [
    { to: "/reportes/reporte-cotizaciones", label: "Reporte de cotizaciones" },
    { to: "/reportes/reporte-solped", label: "Reporte SOLPED" },
  ];

  return (
    <div className="w-[280px] bg-slate-900 flex flex-col border-t-[0.5px] border-slate-400">
      {/* --- BOTÓN PRINCIPAL --- */}
      <div
        className={`w-full flex items-center justify-between p-4 px-6 cursor-pointer transition-all duration-300 ease-out
          ${
            isOpen
              ? "bg-slate-800 text-white border-l-4 border-amber-500 shadow-md shadow-slate-950/50"
              : "text-slate-400 border-l-4 border-transparent hover:bg-slate-800 hover:text-white"
          }
        `}
        onClick={() => {
          setOpenListModule(isOpen ? "" : "reportes");
        }}
      >
        <div className="flex gap-4 items-center">
          <TbReport
            className={`text-xl transition-transform duration-500 ease-out ${
              isOpen ? "scale-110 text-amber-500" : "text-slate-500"
            }`}
          />
          <p className="text-sm font-medium tracking-wide transition-colors duration-300">
            Reportes
          </p>
        </div>

        <IoMdArrowDropdown
          className={`text-2xl shrink-0 transition-transform duration-400 ease-in-out ${
            isOpen ? "rotate-180 text-amber-500" : "text-slate-500"
          }`}
        />
      </div>

      {/* --- SUB-MENÚ (ANIMACIÓN INFALIBLE CON ESTILOS EN LÍNEA) --- */}
      <div
        className="w-full overflow-hidden transition-all duration-500 ease-in-out bg-slate-900/50"
        style={{
          // 150px es suficiente para estos 2 enlaces
          maxHeight: isOpen ? "150px" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="flex flex-col py-2 border-l-4 border-transparent">
          {menuLinks.map((link, idx) => (
            <Link
              key={idx}
              className="group flex items-center gap-4 px-8 py-3 text-slate-400 hover:bg-slate-800/80 hover:text-white transition-colors duration-300"
              to={link.to}
              onClick={() => setIsMenuOpen && setIsMenuOpen(false)}
            >
              {/* Viñeta sutil con efecto hover */}
              <MdOutlineCircle className="text-[8px] shrink-0 text-slate-600 transition-all duration-300 group-hover:text-amber-500 group-hover:scale-[1.5]" />
              <p className="text-sm leading-tight transition-transform duration-300 group-hover:translate-x-1.5">
                {link.label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavReportesLinks;
