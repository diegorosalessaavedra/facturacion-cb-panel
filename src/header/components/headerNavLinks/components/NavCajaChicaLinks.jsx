import React from "react";
import { FaDropbox } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdOutlineCircle } from "react-icons/md";
import { Link } from "react-router-dom";

const NavCajaChicaLinks = ({
  openListModule,
  setOpenListModule,
  setIsMenuOpen,
}) => {
  const isOpen = openListModule === "caja-chica";

  // Arreglo de rutas para mantener el código limpio y organizado
  const menuLinks = [
    {
      to: "/caja-chica/categoria-centro-costos",
      label: "Categoría de Gasto y Conceptos",
    },
    { to: "/caja-chica/trabajadores", label: "Colaboradores" },
    { to: "/caja-chica/aperturas", label: "Plantilla de Aperturas" },
    { to: "/caja-chica/desembolsos", label: "Plantilla de Desembolso" },
    { to: "/caja-chica/rendicion", label: "Plantilla de Rendición" },
    {
      to: "/caja-chica/historico-rendicion-individual",
      label: "Histórico de Rendición Individual",
    },
    { to: "/caja-chica/flujo-caja", label: "Flujo de Caja" },
  ];

  return (
    <div className="w-[280px] bg-slate-900 flex flex-col border-t-[0.5px] border-slate-400">
      {/* --- BOTÓN PRINCIPAL --- */}
      <div
        className={`w-full flex items-center justify-between p-4 px-6 cursor-pointer transition-all duration-300 ease-out
          ${
            isOpen
              ? "bg-slate-800 text-white border-l-4 border-amber-500 shadow-md shadow-slate-950/50"
              : "text-slate-300 border-l-4 border-transparent hover:bg-slate-800 hover:text-white"
          }
        `}
        onClick={() => {
          setOpenListModule(isOpen ? "" : "caja-chica");
        }}
      >
        <div className="flex gap-4 items-center">
          <FaDropbox
            className={`text-xl transition-transform duration-500 ease-out ${
              isOpen ? "scale-110 text-amber-500" : "text-slate-400"
            }`}
          />
          <p className="text-base font-medium transition-colors duration-300">
            Caja Chica
          </p>
        </div>

        <IoMdArrowDropdown
          className={`text-2xl transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-180 text-amber-500" : "text-slate-400"
          }`}
        />
      </div>

      {/* --- SUB-MENÚ (ANIMACIÓN INFALIBLE CON ESTILOS EN LÍNEA) --- */}
      <div
        className="w-full overflow-hidden transition-all duration-500 ease-in-out bg-slate-900"
        style={{
          // Usamos 500px porque este menú tiene muchos más elementos
          maxHeight: isOpen ? "500px" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="flex flex-col py-2">
          {menuLinks.map((link, idx) => (
            <Link
              key={idx}
              className="group flex items-center gap-4 px-8 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-300"
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
            >
              <MdOutlineCircle className="text-[10px] text-slate-500 shrink-0 transition-all duration-300 group-hover:text-amber-500 group-hover:scale-[1.3]" />
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

export default NavCajaChicaLinks;
