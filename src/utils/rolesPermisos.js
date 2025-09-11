export const ROLES = {
  ADMINISTRADOR: "ADMINISTRADOR",
  VENDEDOR: "VENDEDOR",
  COMPRADOR: "COMPRADOR",
  COMPRADOR_VENDEDOR: "COMPRADOR/VENDEDOR",
  RRHH: "RRHH",
};

export const ROUTE_PERMISSIONS = {
  // Rutas de Despacho
  "/despacho/tiempo-real": [
    ROLES.ADMINISTRADOR,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],

  // Rutas de Ventas
  "/ventas/comprobantes-cotizacion": [
    ROLES.ADMINISTRADOR,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/ventas/cotizaciones": [
    ROLES.ADMINISTRADOR,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/ventas/crear-cotizacion": [
    ROLES.ADMINISTRADOR,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/ventas/editar-cotizacion/:id": [
    ROLES.ADMINISTRADOR,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/ventas/editar/venta-huevo/:id": [
    ROLES.ADMINISTRADOR,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/ventas/huevos": [
    ROLES.ADMINISTRADOR,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/ventas/nueva-venta-huevos": [
    ROLES.ADMINISTRADOR,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],

  // Rutas de Compras
  "/compras/ordenes-compra": [
    ROLES.ADMINISTRADOR,
    ROLES.COMPRADOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/compras/nueva-orden-compra": [
    ROLES.ADMINISTRADOR,
    ROLES.COMPRADOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/compras/comprobante-orden-compra/:id": [
    ROLES.ADMINISTRADOR,
    ROLES.COMPRADOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/compras/editar/orden-compra/:id": [
    ROLES.ADMINISTRADOR,
    ROLES.COMPRADOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/compras/ingreso-huevos": [
    ROLES.ADMINISTRADOR,
    ROLES.COMPRADOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/compras/nuevo-ingreso-huevos": [
    ROLES.ADMINISTRADOR,
    ROLES.COMPRADOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/compras/editar/ingreso-huevo/:id": [
    ROLES.ADMINISTRADOR,
    ROLES.COMPRADOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],

  // Rutas de Productos
  "/productos/comercializacion-servicios": [
    ROLES.ADMINISTRADOR,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],

  "/productos/costos-gastos": [
    ROLES.ADMINISTRADOR,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],

  "/productos/huevos": [
    ROLES.ADMINISTRADOR,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],

  // Rutas de Costos
  "/costos/costos-produccion": [
    ROLES.ADMINISTRADOR,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],

  // Rutas de Clientes
  "/clientes/tus-clientes": [
    ROLES.ADMINISTRADOR,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/clientes/tus-proveedores": [
    ROLES.ADMINISTRADOR,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/clientes/nueva-orden-compra": [
    ROLES.ADMINISTRADOR,
    ROLES.COMPRADOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/clientes/origen": [
    ROLES.ADMINISTRADOR,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],

  // Rutas de Reportes
  "/reportes/reporte-cotizaciones": [
    ROLES.ADMINISTRADOR,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/reportes/reporte-solped": [
    ROLES.ADMINISTRADOR,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],

  // Rutas de Comprobantes
  "/comprobantes/comprobante-electronico": [
    ROLES.ADMINISTRADOR,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/comprobantes/tus-comprobantes": [
    ROLES.ADMINISTRADOR,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/comprobantes/nota-credito-debito/:id": [
    ROLES.ADMINISTRADOR,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],

  // Rutas de Inventario
  "/inventario/reporte-kardex": [
    ROLES.ADMINISTRADOR,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],

  // Rutas de RRHH
  "/rrhh/colaboradores": [ROLES.ADMINISTRADOR, ROLES.RRHH],
  "/rrhh/colaboradores-baja": [ROLES.ADMINISTRADOR, ROLES.RRHH],
  "/rrhh/cargo-laboral": [ROLES.ADMINISTRADOR, ROLES.RRHH],
  "/rrhh/descanso-medicos": [ROLES.ADMINISTRADOR, ROLES.RRHH],
  "/rrhh/solicitudes-descansos-medicos": [ROLES.ADMINISTRADOR, ROLES.RRHH],

  "/rrhh/vacaciones": [ROLES.ADMINISTRADOR, ROLES.RRHH],
  "/rrhh/solicitudes-vacaciones": [ROLES.ADMINISTRADOR, ROLES.RRHH],

  // Rutas de Administrador únicamente
  "/usuarios": [ROLES.ADMINISTRADOR],
  "/ajustes/metodo-pago-gasto": [ROLES.ADMINISTRADOR],
  "/ajustes/cuentas-bancarias": [ROLES.ADMINISTRADOR],
  "/ajustes/bancos-cuentas-bancarias": [ROLES.ADMINISTRADOR],

  "/ajustes/encargados": [ROLES.ADMINISTRADOR],
  "/ajustes/centro-costos": [ROLES.ADMINISTRADOR],
};

export const getUserPermissions = (userRole) => {
  if (!userRole) return {};

  return {
    isAdmin: userRole === ROLES.ADMINISTRADOR,
    canAccessVentas: [
      ROLES.ADMINISTRADOR,
      ROLES.VENDEDOR,
      ROLES.COMPRADOR_VENDEDOR,
    ].includes(userRole),
    canAccessCompras: [
      ROLES.ADMINISTRADOR,
      ROLES.COMPRADOR,
      ROLES.COMPRADOR_VENDEDOR,
    ].includes(userRole),
    canAccessComprobantes: [
      ROLES.ADMINISTRADOR,
      ROLES.VENDEDOR,
      ROLES.COMPRADOR_VENDEDOR,
    ].includes(userRole),
    canAccessProductos: [
      ROLES.ADMINISTRADOR,
      ROLES.VENDEDOR,
      ROLES.COMPRADOR,
      ROLES.COMPRADOR_VENDEDOR,
    ].includes(userRole),
    canAccessReportes: [
      ROLES.ADMINISTRADOR,
      ROLES.VENDEDOR,
      ROLES.COMPRADOR,
      ROLES.COMPRADOR_VENDEDOR,
    ].includes(userRole),
    canAccessClientes: [
      ROLES.ADMINISTRADOR,
      ROLES.VENDEDOR,
      ROLES.COMPRADOR,
      ROLES.COMPRADOR_VENDEDOR,
    ].includes(userRole),
    canAccessRrhh: [ROLES.ADMINISTRADOR, ROLES.RRHH].includes(userRole),
  };
};

export const hasPermissionForRoute = (userRole, routePath) => {
  // Rutas públicas (siempre accesibles)
  const publicRoutes = ["/", "/log-in"];
  if (publicRoutes.includes(routePath)) return true;

  // Verificar rutas con parámetros
  const routeKey = Object.keys(ROUTE_PERMISSIONS).find((route) => {
    // Convertir ruta con parámetros a regex
    const routeRegex = new RegExp(
      "^" + route.replace(/:[^/]+/g, "[^/]+") + "$"
    );
    return routeRegex.test(routePath);
  });

  if (routeKey) {
    return ROUTE_PERMISSIONS[routeKey].includes(userRole);
  }

  // Si no se encuentra la ruta, denegar acceso por defecto
  return false;
};
