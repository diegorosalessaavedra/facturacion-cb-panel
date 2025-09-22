import React, { useMemo } from "react";
import { GrDocumentPerformance } from "react-icons/gr";
import { FaUserAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import NavVentasLinks from "./components/NavVentasLinks";
import NavComprasLinks from "./components/NavComprasLinks";
import NavClientesLinks from "./components/NavClientesLinks";
import NavAjustesLinks from "./components/NavAjustesLinks";
import NavProductosLinks from "./components/NavProductosLinks";
import NavReportesLinks from "./components/NavReportesLinks";
import NavComprobantesLinks from "./components/NavComprobantesLinks";
import NavInventarioLinks from "./components/NavInventarioLinks";
import NavRRHHLinks from "./components/NavRRHHLinks";
import NavDespachoLinks from "./components/NavDespachoLinks";

// Constantes para roles
const ROLES = {
  ADMINISTRADOR: "ADMINISTRADOR",
  VENDEDOR: "VENDEDOR",
  COMPRADOR: "COMPRADOR",
  COMPRADOR_VENDEDOR: "COMPRADOR/VENDEDOR",
  RRHH: "RRHH",
};

// Estilos compartidos
const SHARED_STYLES = {
  navLink:
    "text-stone-700 flex items-center gap-4 p-4 px-6 w-[280px] hover:bg-blue-700 hover:text-white transition-all duration-300 border-b-1 border-zinc-300 hover:scale-105",
};

const HeaderNavLinks = ({
  openListModule,
  setOpenListModule,
  setIsMenuOpen,
  userData,
}) => {
  // Memoizar los permisos del usuario para evitar recalcular en cada render
  const userPermissions = useMemo(() => {
    const role = userData?.role;
    if (!role) return {};

    return {
      isAdmin: role === ROLES.ADMINISTRADOR,
      canAccessVentas: [
        ROLES.ADMINISTRADOR,
        ROLES.VENDEDOR,
        ROLES.COMPRADOR_VENDEDOR,
      ].includes(role),
      canAccessCompras: [
        ROLES.ADMINISTRADOR,
        ROLES.COMPRADOR,
        ROLES.COMPRADOR_VENDEDOR,
      ].includes(role),
      canAccessComprobantes: [
        ROLES.ADMINISTRADOR,
        ROLES.VENDEDOR,
        ROLES.COMPRADOR_VENDEDOR,
      ].includes(role),
      canAccessProductos: [
        ROLES.ADMINISTRADOR,
        ROLES.VENDEDOR,
        ROLES.COMPRADOR,
        ROLES.COMPRADOR_VENDEDOR,
      ].includes(role),
      canAccessReportes: [
        ROLES.ADMINISTRADOR,
        ROLES.VENDEDOR,
        ROLES.COMPRADOR,
        ROLES.COMPRADOR_VENDEDOR,
      ].includes(role),
      canAccessClientes: [
        ROLES.ADMINISTRADOR,
        ROLES.VENDEDOR,
        ROLES.COMPRADOR,
        ROLES.COMPRADOR_VENDEDOR,
      ].includes(role),
      canAccessRrhh: [ROLES.ADMINISTRADOR, ROLES.RRHH].includes(role),
    };
  }, [userData?.role]);

  // Props compartidos para componentes Nav
  const sharedNavProps = {
    openListModule,
    setOpenListModule,
    setIsMenuOpen,
    userData,
  };

  // Componente para renderizar enlaces condicionales
  const ConditionalNavLink = ({ condition, children }) => {
    return condition ? children : null;
  };

  return (
    <nav
      className="w-[60px] flex flex-col items-start justify-start overflow-x-hidden
    group-hover:w-[280px] overflow-hidden  duration-300
    "
    >
      {/* Dashboard - Siempre visible */}
      <Link
        className={SHARED_STYLES.navLink}
        to="/"
        aria-label="Ir al Dashboard"
      >
        <GrDocumentPerformance className="text-xl" />
        <p className="text-base">Dashboard</p>
      </Link>
      {userPermissions.isAdmin && (
        <>
          <NavDespachoLinks {...sharedNavProps} />
        </>
      )}
      {/* Ventas */}
      <ConditionalNavLink condition={userPermissions.canAccessVentas}>
        <NavVentasLinks {...sharedNavProps} userData={userData} />
      </ConditionalNavLink>

      {/* Compras */}
      <ConditionalNavLink condition={userPermissions.canAccessCompras}>
        <NavComprasLinks {...sharedNavProps} />
      </ConditionalNavLink>

      {/* Comprobantes */}
      <ConditionalNavLink condition={userPermissions.canAccessComprobantes}>
        <NavComprobantesLinks {...sharedNavProps} />
      </ConditionalNavLink>

      {/* Productos */}
      <ConditionalNavLink condition={userPermissions.canAccessProductos}>
        <NavProductosLinks {...sharedNavProps} />
      </ConditionalNavLink>

      {/* Inventario - Siempre visible */}
      <ConditionalNavLink condition={userPermissions.canAccessProductos}>
        <NavInventarioLinks {...sharedNavProps} />
      </ConditionalNavLink>

      {/* Reportes */}
      <ConditionalNavLink condition={userPermissions.canAccessReportes}>
        <NavReportesLinks {...sharedNavProps} />
      </ConditionalNavLink>

      {/* Clientes */}
      <ConditionalNavLink condition={userPermissions.canAccessClientes}>
        <NavClientesLinks {...sharedNavProps} />
      </ConditionalNavLink>

      {/* rrhh */}

      <ConditionalNavLink condition={userPermissions.canAccessRrhh}>
        <NavRRHHLinks {...sharedNavProps} />
      </ConditionalNavLink>

      {/* Sección de Administrador */}
      {userPermissions.isAdmin && (
        <>
          <Link
            className={SHARED_STYLES.navLink}
            to="/usuarios"
            aria-label="Gestionar Usuarios"
          >
            <FaUserAlt className="text-xl" />
            <p className="text-base">Usuarios</p>
          </Link>
          <NavAjustesLinks {...sharedNavProps} />
        </>
      )}
    </nav>
  );
};

export default HeaderNavLinks;
