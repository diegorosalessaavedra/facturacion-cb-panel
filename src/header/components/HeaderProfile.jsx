import React from "react";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { FaArrowLeft, FaBoxOpen } from "react-icons/fa";
import { IoLogOutSharp } from "react-icons/io5";

const HeaderProfile = ({ userData }) => {
  const logOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div
      className="fixed top-0 h-[65px]  bg-slate-900 backdrop-blur-md border-b border-l-1 border-slate-400 p-4 flex justify-between items-center z-30 transition-all duration-300
  left-[60px] w-[calc(100vw-60px)] 
  group-hover:left-[260px] group-hover:w-[calc(100vw-260px)]"
    >
      {/* --- SECCIÓN IZQUIERDA: BOTÓN ATRÁS --- */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="h-9 w-9 rounded-xl bg-slate-100 text-slate-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer flex items-center justify-center transition-all"
        >
          <FaArrowLeft size={14} />
        </button>
        <h1 className="text-slate-200 font-semibold text-xs tracking-wide">
          Atrás
        </h1>
      </div>

      {/* --- SECCIÓN DERECHA: PERFIL Y DROPDOWN --- */}
      <Dropdown
        placement="bottom-end"
        offset={15}
        classNames={{
          content:
            "p-0 border-none bg-white shadow-2xl rounded-2xl min-w-[240px]",
        }}
        backdrop="blur"
      >
        <DropdownTrigger className="cursor-pointer">
          <div className="flex items-center gap-3 group/profile">
            <div className="flex flex-col items-end">
              <p className="text-slate-200 text-xs font-bold group-hover/profile:text-amber-2 transition-colors">
                {userData?.nombre}
              </p>
              <p className="text-slate-300 text-[10px] font-medium  tracking-wider">
                {userData?.correo}
              </p>
            </div>

            <Avatar
              isBordered
              as="button"
              className="transition-transform ring-2 ring-amber-500 bg-slate-100"
              color="warning"
              size="sm"
              src="/logo.jpeg"
            />
          </div>
        </DropdownTrigger>

        {/* --- MENÚ DE OPCIONES (FONDO BLANCO PROFESIONAL) --- */}
        <DropdownMenu
          aria-label="Acciones de Perfil"
          variant="flat"
          className="p-2"
          itemClasses={{
            base: [
              "rounded-xl",
              "text-slate-600",
              "transition-all",
              "data-[hover=true]:bg-amber-50",
              "data-[hover=true]:text-amber-700",
              "py-2",
            ],
          }}
        >
          {/* Header del dropdown */}
          <DropdownItem
            key="user-info"
            className="flex gap-2 border-b border-slate-100 pointer-events-none mb-1"
          >
            <div className="w-full flex items-center justify-between">
              <p className="font-extrabold text-slate-800 text-base">
                Mi Cuenta
              </p>
              <p className="text-xs font-bold text-red-500">{userData.role}</p>
            </div>
          </DropdownItem>

          {/* Enlaces a otros sistemas */}
          <DropdownItem
            key="Chicken"
            href="https://sistema-facturacion-chicken-baby.netlify.app"
            startContent={
              <img
                className="w-8 h-8 rounded-sm shadow-sm object-contain border border-slate-100"
                src="/logo.jpg"
                alt=""
              />
            }
          >
            <span className="font-medium text-xs">
              Facturación Chicken baby
            </span>
          </DropdownItem>

          {userData.role !== "VENDEDOR" &&
            userData.role !== "COMPRADOR/VENDEDOR" && (
              <DropdownItem
                key="Multinacional"
                href="https://facturacion-multinacional.netlify.app/#/log-in"
                startContent={
                  <img
                    className="w-8 h-8 rounded-sm shadow-sm object-contain border border-slate-100"
                    src="/logoM.jpeg"
                    alt=""
                  />
                }
              >
                <span className="font-medium text-xs">
                  Facturación Multinacional
                </span>
              </DropdownItem>
            )}

          <DropdownItem
            key="Granjas Peruanas"
            href="https://facturacion-granjas-peruanas.netlify.app"
            startContent={
              <img
                className="w-8 h-8 rounded-sm shadow-sm object-contain border border-slate-100"
                src="/gp.png"
                alt=""
              />
            }
          >
            <span className="font-medium text-xs">
              Facturación Granjas Peruanas
            </span>
          </DropdownItem>

          {userData.role !== "RRHH" &&
            userData.role !== "PRACTICANTE CONTABLE" && (
              <DropdownItem
                key="Despacho"
                href="https://despacho-en-tiempo-real.netlify.app"
                startContent={
                  <div className="bg-amber-100 p-2 rounded-sm text-amber-600">
                    <FaBoxOpen size={16} />
                  </div>
                }
              >
                <span className="font-medium text-xs">
                  Despacho En Tiempo Real
                </span>
              </DropdownItem>
            )}

          {/* Cerrar sesión */}
          <DropdownItem
            key="logout"
            onPress={logOut}
            className="mt-2 bg-red-50 text-red-600 data-[hover=true]:bg-red-100 data-[hover=true]:text-red-700"
            startContent={<IoLogOutSharp className="text-xl" />}
          >
            <span className="font-bold text-xs">Cerrar Sesión</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default HeaderProfile;
