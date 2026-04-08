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
      {
        to: "/ventas/verificar-cotizaciones",
        label: "Validación Banca Diaria",
      },
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
    submenu: [{ to: "/inventario/reporte-kardex", label: "Reporte de Kardex" }],
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
