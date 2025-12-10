export const ROLES = {
  GERENTE: "GERENTE",
  VENDEDOR: "VENDEDOR",
  CONTADOR: "CONTADOR",
  PRACTICANTE_CONTABLE: "PRACTICANTE CONTABLE",
  COMPRADOR_VENDEDOR: "COMPRADOR/VENDEDOR",
  RRHH: "RRHH",
};

export const ROUTE_PERMISSIONS = {
  // Rutas de Despacho
  "/despacho/tiempo-real": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],

  // Rutas de Ventas
  "/ventas/comprobantes-cotizacion": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/ventas/cotizaciones": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/ventas/crear-cotizacion": [
    ROLES.GERENTE,
    ROLES.VENDEDOR,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/ventas/editar-cotizacion/:id": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/ventas/editar/venta-huevo/:id": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/ventas/huevos": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/ventas/nueva-venta-huevos": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],

  // Rutas de Compras
  "/compras/ordenes-compra": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/compras/nueva-orden-compra": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/compras/comprobante-orden-compra/:id": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/compras/editar/orden-compra/:id": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/compras/ingreso-huevos": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/compras/nuevo-ingreso-huevos": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/compras/editar/ingreso-huevo/:id": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.COMPRADOR_VENDEDOR,
  ],

  // Rutas de Productos
  "/productos/comercializacion-servicios": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
  ],

  "/productos/costos-gastos": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
  ],

  "/productos/huevos": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
  ],

  // Rutas de Costos
  "/costos/costos-produccion": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.COMPRADOR_VENDEDOR,
  ],

  // Rutas de Clientes
  "/clientes/tus-clientes": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/clientes/tus-proveedores": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/clientes/agencias": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/clientes/nueva-orden-compra": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/clientes/origen": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],

  // Rutas de Reportes
  "/reportes/reporte-cotizaciones": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],
  "/reportes/reporte-solped": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.VENDEDOR,
    ROLES.COMPRADOR_VENDEDOR,
  ],

  // Rutas de Comprobantes
  "/comprobantes/comprobante-electronico": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
  ],
  "/comprobantes/tus-comprobantes": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
  ],
  "/comprobantes/nota-credito-debito/:id": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
  ],

  // Rutas de Inventario
  "/inventario/reporte-kardex": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
    ROLES.COMPRADOR_VENDEDOR,
  ],

  // Rutas de RRHH
  "/rrhh/colaboradores": [ROLES.GERENTE, ROLES.CONTADOR, ROLES.RRHH],
  "/rrhh/colaboradores-baja": [ROLES.GERENTE, ROLES.CONTADOR, ROLES.RRHH],
  "/rrhh/cargo-laboral": [ROLES.GERENTE, ROLES.CONTADOR, ROLES.RRHH],
  "/rrhh/descanso-medicos": [ROLES.GERENTE, ROLES.CONTADOR, ROLES.RRHH],
  "/rrhh/solicitudes-descansos-medicos": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.RRHH,
  ],

  "/rrhh/vacaciones": [ROLES.GERENTE, ROLES.CONTADOR, ROLES.RRHH],
  "/rrhh/solicitudes-vacaciones": [ROLES.GERENTE, ROLES.CONTADOR, ROLES.RRHH],

  // Rutas de GERENTE únicamente
  "/usuarios": [ROLES.GERENTE, ROLES.CONTADOR],
  "/ajustes/metodo-pago-gasto": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
  ],
  "/ajustes/cuentas-bancarias": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
  ],
  "/ajustes/bancos-cuentas-bancarias": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
  ],

  "/ajustes/encargados": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
  ],
  "/ajustes/centro-costos": [
    ROLES.GERENTE,
    ROLES.CONTADOR,
    ROLES.PRACTICANTE_CONTABLE,
  ],
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
