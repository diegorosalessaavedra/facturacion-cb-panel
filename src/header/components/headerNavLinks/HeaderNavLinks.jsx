import React, { useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// Iconos
import { GrDocumentPerformance } from "react-icons/gr";
import {
  FaUsers,
  FaBoxOpen,
  FaHandshake,
  FaCashRegister,
} from "react-icons/fa";
import { FaFileInvoiceDollar, FaUserShield } from "react-icons/fa6";
import { MdOutlineCircle, MdInventory, MdExpandMore } from "react-icons/md";
import { IoSettingsSharp, IoReceipt } from "react-icons/io5";
import { BsBank } from "react-icons/bs";
import { TbReportAnalytics } from "react-icons/tb";
import { FiShoppingBag } from "react-icons/fi";

const ROLES = {
  GERENTE: "GERENTE",
  VENDEDOR: "VENDEDOR",
  CONTADOR: "CONTADOR",
  PRACTICANTE_CONTABLE: "PRACTICANTE CONTABLE",
  COMPRADOR_VENDEDOR: "COMPRADOR/VENDEDOR",
  RRHH: "RRHH",
};

const HeaderNavLinks = ({
  openListModule,
  setOpenListModule,
  setIsMenuOpen,
  userData,
}) => {
  const location = useLocation();

  const userPermissions = useMemo(() => {
    const role = userData?.role;
    if (!role) return {};
    return {
      isAdmin: role === ROLES.GERENTE || role === ROLES.CONTADOR,
      canAccessVentas: [
        ROLES.GERENTE,
        ROLES.CONTADOR,
        ROLES.PRACTICANTE_CONTABLE,
        ROLES.VENDEDOR,
        ROLES.COMPRADOR_VENDEDOR,
      ].includes(role),
      canAccessCompras: [
        ROLES.GERENTE,
        ROLES.CONTADOR,
        ROLES.PRACTICANTE_CONTABLE,
        ROLES.COMPRADOR,
        ROLES.COMPRADOR_VENDEDOR,
      ].includes(role),
      canAccessComprobantes: [
        ROLES.GERENTE,
        ROLES.CONTADOR,
        ROLES.PRACTICANTE_CONTABLE,
      ].includes(role),
      canAccessProductos: [
        ROLES.GERENTE,
        ROLES.CONTADOR,
        ROLES.PRACTICANTE_CONTABLE,
        ROLES.COMPRADOR,
      ].includes(role),
      canAccessBancos: [ROLES.GERENTE, ROLES.CONTADOR, ROLES.RRHH].includes(
        role,
      ),
      canAccessReportes: [
        ROLES.GERENTE,
        ROLES.CONTADOR,
        ROLES.PRACTICANTE_CONTABLE,
        ROLES.VENDEDOR,
        ROLES.COMPRADOR,
        ROLES.COMPRADOR_VENDEDOR,
      ].includes(role),
      canAccessClientes: [
        ROLES.GERENTE,
        ROLES.CONTADOR,
        ROLES.PRACTICANTE_CONTABLE,
        ROLES.VENDEDOR,
        ROLES.COMPRADOR,
        ROLES.COMPRADOR_VENDEDOR,
      ].includes(role),
      canAccessRrhh: [ROLES.GERENTE, ROLES.CONTADOR, ROLES.RRHH].includes(role),
      canAccessCajaChica: [ROLES.GERENTE, ROLES.CONTADOR, ROLES.RRHH].includes(
        role,
      ),
    };
  }, [userData?.role]);

  const MENU_ITEMS = [
    {
      title: "Dashboard",
      icon: GrDocumentPerformance,
      path: "/",
      show: true, // Siempre visible
    },
    {
      title: "Ventas",
      icon: FaFileInvoiceDollar,
      id: "ventas",
      show: userPermissions.canAccessVentas,
      submenu: [
        { to: "/ventas/crear-cotizacion", label: "Nueva Cotización" },
        {
          to: "/ventas/comprobantes-cotizacion",
          label: "Facturas y boletas emitidas",
        },
        { to: "/ventas/cotizaciones", label: "Cotizaciones" },
      ],
    },
    {
      title: "Compras",
      icon: FiShoppingBag,
      id: "compras",
      show: userPermissions.canAccessCompras,
      submenu: [
        { to: "/compras/nueva-orden-compra", label: "SOLPED" },
        { to: "/compras/ordenes-compra", label: "Status SOLPED" },
        { to: "/compras/ee-cc-proveedores", label: "EECC Proveedores" },
      ],
    },
    {
      title: "Comprobantes",
      icon: IoReceipt,
      id: "comprobantes",
      show: userPermissions.canAccessComprobantes,
      submenu: [
        {
          to: "/comprobantes/comprobante-electronico",
          label: "Emitir comprobantes sin cotización",
        },
        {
          to: "/comprobantes/tus-comprobantes",
          label: "Status comprobante de venta",
        },
      ],
    },
    {
      title: "Bancos",
      icon: BsBank,
      id: "bancos",
      show: userPermissions.canAccessBancos,
      submenu: [
        {
          to: "/bancos/validacion-banca-diaria",
          label: "Validación Banca Diaria",
        },
      ],
    },
    {
      title: "Productos",
      icon: FaBoxOpen,
      id: "productos",
      show: userPermissions.canAccessProductos,
      submenu: [
        {
          to: "/productos/comercializacion-servicios",
          label: "Comercialización y servicios",
        },
        { to: "/productos/costos-gastos", label: "Costos y gastos" },
      ],
    },
    {
      title: "Inventario",
      icon: MdInventory,
      id: "inventario",
      show: userPermissions.canAccessProductos, // Usa el mismo permiso que productos según tu código original
      submenu: [
        { to: "/inventario/reporte-kardex", label: "Reporte de Kardex" },
      ],
    },
    {
      title: "Reportes",
      icon: TbReportAnalytics,
      id: "reportes",
      show: userPermissions.canAccessReportes,
      submenu: [
        {
          to: "/reportes/reporte-cotizaciones",
          label: "Reporte de cotizaciones",
        },
        { to: "/reportes/reporte-solped", label: "Reporte SOLPED" },
      ],
    },
    {
      title: "Clientes y Proveedores",
      icon: FaHandshake,
      id: "clientes",
      show: userPermissions.canAccessClientes,
      submenu: [
        { to: "/clientes/tus-clientes", label: "Clientes" },
        { to: "/clientes/tus-proveedores", label: "Proveedores" },
        { to: "/clientes/agencias", label: "Agencias" },
      ],
    },
    {
      title: "RRHH",
      icon: FaUsers,
      id: "rrhh",
      show: userPermissions.canAccessRrhh,
      submenu: [
        { to: "/rrhh/colaboradores", label: "Colaboradores" },
        { to: "/rrhh/colaboradores-baja", label: "Colaboradores de baja" },
        { to: "/rrhh/cargo-laboral", label: "Cargo Laboral" },
        { to: "/rrhh/descanso-medicos", label: "Descanso Médicos" },
        ...(userData?.role === "GERENTE"
          ? [
              {
                to: "/rrhh/solicitudes-descansos-medicos",
                label: "Solicitudes descansos médicos",
              },
            ]
          : []),
        { to: "/rrhh/vacaciones", label: "Vacaciones" },
        ...(userData?.role === "GERENTE"
          ? [
              {
                to: "/rrhh/solicitudes-vacaciones",
                label: "Solicitudes Vacaciones",
              },
            ]
          : []),
      ],
    },
    {
      title: "Caja Chica",
      icon: FaCashRegister,
      id: "caja-chica",
      show: userPermissions.canAccessCajaChica,
      submenu: [
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
      ],
    },
    {
      title: "Usuarios",
      icon: FaUserShield,
      path: "/usuarios",
      show: userPermissions.isAdmin,
    },
    {
      title: "Ajustes",
      icon: IoSettingsSharp,
      id: "ajustes",
      show: userPermissions.isAdmin,
      submenu: [
        {
          to: "/ajustes/metodo-pago-gasto",
          label: "Métodos de Pagos y Gastos",
        },
        {
          to: "/ajustes/bancos-cuentas-bancarias",
          label: "Bancos y Cuentas Bancarias",
        },
        { to: "/ajustes/encargados", label: "Encargados" },
        { to: "/ajustes/centro-costos", label: "Centro de Costos" },
      ],
    },
  ];

  useEffect(() => {
    const activeItem = MENU_ITEMS.find((item) =>
      item.submenu?.some((sub) => sub.to === location.pathname),
    );
    if (activeItem) {
      setOpenListModule(activeItem.id);
    }
  }, [location.pathname]);

  const MenuItem = ({ item }) => {
    if (!item.show) return null;

    const hasSubmenu = !!item.submenu;
    const isOpen = openListModule === item.id;
    const isParentActive = hasSubmenu
      ? item.submenu.some((sub) => sub.to === location.pathname)
      : location.pathname === item.path;

    return (
      <div className=" mb-1 px-3 overflow-x-hidden">
        {/* BOTÓN PADRE */}
        <div
          onClick={() => hasSubmenu && setOpenListModule(isOpen ? "" : item.id)}
          className={`
            group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200
            ${
              isParentActive
                ? "bg-amber-500/10 text-amber-500"
                : "hover:bg-slate-700/60 text-slate-400 hover:text-white"
            }
          `}
        >
          <div className="flex items-center gap-4 font-medium">
            <span
              className={
                isParentActive
                  ? "text-amber-500"
                  : "text-slate-400 group-hover:text-amber-500"
              }
            >
              <item.icon size={20} />
            </span>

            {!hasSubmenu ? (
              <Link to={item.path} className="flex-1 text-sm">
                {item.title}
              </Link>
            ) : (
              <span className="flex-1 text-sm">{item.title}</span>
            )}
          </div>

          {hasSubmenu && (
            <MdExpandMore
              size={20}
              className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-amber-500" : "text-slate-600"}`}
            />
          )}
        </div>

        {/* CONTENEDOR SUBMENÚ */}
        <div
          className={`
            overflow-hidden transition-all duration-300 ease-in-out bg-slate-700/20 mt-1 rounded-lg
            ${isOpen ? "max-h-[500px] opacity-100 py-1" : "max-h-0 opacity-0"}
          `}
        >
          <div className="flex flex-col gap-1 pl-2 border-l border-slate-700 py-1 ml-5">
            {item.submenu?.map((sub, idx) => {
              const isActive = location.pathname === sub.to;
              return (
                <Link
                  key={idx}
                  to={sub.to}
                  onClick={() => setIsMenuOpen && setIsMenuOpen(false)}
                  className={`
                    w-full flex items-center gap-2 p-2 rounded-lg text-[12px] font-medium transition-all duration-200 
                    ${
                      isActive
                        ? "bg-amber-500/10 text-amber-500 translate-x-1"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/60"
                    }
                  `}
                >
                  <MdOutlineCircle
                    size={8}
                    className={isActive ? "text-amber-500" : "text-slate-600"}
                  />
                  <span>{sub.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <nav className="w-full flex flex-col py-2 pb-10 overflow-x-hidden">
      {MENU_ITEMS.map((item, index) => (
        <MenuItem key={index} item={item} />
      ))}
    </nav>
  );
};

export default HeaderNavLinks;
