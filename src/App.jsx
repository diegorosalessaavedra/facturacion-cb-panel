// App.jsx optimizado con lazy loading
import "./App.css";
import { useEffect, Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import axios from "axios";
import config from "./utils/getToken";
import { getTodayDate } from "./assets/getTodayDate";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import Header from "./header/Header";
import Login from "./modules/login/Login";
import Dasbhoard from "./modules/dashboard/Dasbhoard";
import LoadingSpinner from "./components/LoadingSpinner"; // Componente de carga

// Lazy loading de componentes por módulo
// Ventas
const Cotizaciones = lazy(() =>
  import("./modules/ventas/cotizaciones/Cotizaciones")
);
const CrearCotizacion = lazy(() =>
  import("./modules/ventas/creartCotizacion/CrearCotizacion")
);
const EditarCotizacion = lazy(() =>
  import("./modules/ventas/editarCotizacion/EditarCotizacion")
);
const ComprobantesCotizacion = lazy(() =>
  import("./modules/ventas/comprobantesCotizacion/ComprobantesCotizacion")
);

// Compras
const OrdenesCompra = lazy(() =>
  import("./modules/compras/ordenesCompra/OrdenesCompra")
);
const NuevaOrdenCompra = lazy(() =>
  import("./modules/compras/nuevaOrdenCompra/NuevaOrdenCompra")
);
const ComprobanteOrdenCompra = lazy(() =>
  import("./modules/compras/comprobanteOrdenCompra/ComprobanteOrdenCompra")
);
const EditarOrdenCompra = lazy(() =>
  import("./modules/compras/editarOrdenCompra/EditarOrdenCompra")
);

// Productos
const ComercializacionServicios = lazy(() =>
  import(
    "./modules/productos/comercializacionServicios/ComercializacionServicios"
  )
);

const CostosGastos = lazy(() =>
  import("./modules/productos/costosGastos/CostosGastos")
);

// Clientes/Proveedores
const TusClientes = lazy(() =>
  import("./modules/clientesProveedores/tusClientes/TusClientes")
);
const TusProveedores = lazy(() =>
  import("./modules/clientesProveedores/tusProveedores/TusProveedores")
);

// Reportes
const ReportesCotizaciones = lazy(() =>
  import("./modules/reportes/reportesCotizaciones/ReportesCotizaciones")
);
const ReportesOrdenesCompra = lazy(() =>
  import("./modules/reportes/reportesOrdenesCompra/ReportesOrdenesCompra")
);

// Comprobantes
const TusComprobantes = lazy(() =>
  import("./modules/comprobantes/tusComprobantes/TusComprobantes")
);
const ComprobanteElectronico = lazy(() =>
  import("./modules/comprobantes/comprobanteElectronico/ComprobanteElectronico")
);
const GenerarNotaCreditoDebito = lazy(() =>
  import(
    "./modules/comprobantes/GenerarNotaCreditoDebito/GenerarNotaCreditoDebito"
  )
);

// Inventario
const ReporteKardex = lazy(() =>
  import("./modules/inventario/reporteKardex/ReporteKardex")
);

// RRHH
const Colaboradores = lazy(() =>
  import("./modules/rrhh/colaboradores/Colaboradores")
);

const ColaboradoresDeBaja = lazy(() =>
  import("./modules/rrhh/colaboradoresDeBaja/ColaboradoresDeBaja")
);
const CargoLaboral = lazy(() =>
  import("./modules/rrhh/cargoLaboral/CargoLaboral")
);
const DescansoMedico = lazy(() =>
  import("./modules/rrhh/descansoMedico/DescansoMedico")
);

const SolicitudesDescansoMedico = lazy(() =>
  import("./modules/rrhh/solicitudesDescansoMedico/SolicitudesDescansoMedico")
);

const Vacaciones = lazy(() => import("./modules/rrhh/vacaciones/Vacaciones"));
const SolicitudesVacaciones = lazy(() =>
  import("./modules/rrhh/solicitudesVacaciones/SolicitudesVacaciones")
);

// Ajustes
const MetodosPagosGastos = lazy(() =>
  import("./modules/ajustes/metodoPagoGasto/MetodosPagosGastos")
);

const BancosCuentasBancarias = lazy(() =>
  import("./modules/ajustes/bancosCuentasBancarias/BancosCuentasBancarias")
);
const Encargados = lazy(() =>
  import("./modules/ajustes/encargados/Encargados")
);

const CentroCostos = lazy(() =>
  import("./modules/ajustes/centroCostos/CentroCostos")
);

// Usuarios
const Usuarios = lazy(() => import("./modules/usuarios/Usuarios"));

// Hook personalizado para manejar la data del usuario
const useUserData = () => {
  const userDataJSON = localStorage.getItem("userData");
  const userData = userDataJSON ? JSON.parse(userDataJSON) : null;
  return userData;
};

// Hook personalizado para manejar la data del dólar
const useDolarData = () => {
  let dolarData = null;
  try {
    const dolarJSON = localStorage.getItem("dolar");
    dolarData = dolarJSON ? JSON.parse(dolarJSON) : null;
  } catch (error) {
    console.error("Error parsing dolar data:", error);
  }
  return dolarData;
};

// Componente wrapper para rutas protegidas con suspense
const ProtectedRouteWrapper = ({ children, userRole }) => (
  <RoleProtectedRoute userRole={userRole}>
    <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
  </RoleProtectedRoute>
);

function App() {
  const userData = useUserData();
  const userRole = userData?.role;
  const dolarData = useDolarData();

  useEffect(() => {
    document.title = "Sistema de Facturacion y Cotizaciones";
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = "./logo.svg";
    }
  }, []);

  useEffect(() => {
    if (userData && dolarData?.date !== getTodayDate()) {
      const url = `${
        import.meta.env.VITE_URL_API
      }/apiPeru/dolar?date=${getTodayDate()}`;
      axios
        .get(url, config)
        .then((res) => {
          localStorage.setItem("dolar", JSON.stringify(res.data.data));
        })
        .catch((error) => {
          console.error("Error fetching dolar data:", error);
        });
    }
  }, [userData, dolarData]);

  return (
    <>
      {userData && <Header userData={userData} />}
      <Toaster position="bottom-right" richColors />
      <Routes>
        <Route path="/log-in" element={<Login userData={userData} />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Dasbhoard />} />

          {/* Rutas de Ventas */}
          <Route
            path="/ventas/comprobantes-cotizacion"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <ComprobantesCotizacion userData={userData} />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/ventas/cotizaciones"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <Cotizaciones userData={userData} />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/ventas/crear-cotizacion"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <CrearCotizacion userData={userData} />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/ventas/editar-cotizacion/:id"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <EditarCotizacion userData={userData} />
              </ProtectedRouteWrapper>
            }
          />

          {/* Rutas de Productos */}
          <Route
            path="/productos/comercializacion-servicios"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <ComercializacionServicios />
              </ProtectedRouteWrapper>
            }
          />

          <Route
            path="/productos/costos-gastos"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <CostosGastos />
              </ProtectedRouteWrapper>
            }
          />

          {/* Rutas de Compras */}
          <Route
            path="/compras/ordenes-compra"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <OrdenesCompra />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/compras/nueva-orden-compra"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <NuevaOrdenCompra userData={userData} />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/compras/comprobante-orden-compra/:id"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <ComprobanteOrdenCompra userData={userData} />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/compras/editar/orden-compra/:id"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <EditarOrdenCompra userData={userData} />
              </ProtectedRouteWrapper>
            }
          />

          {/* Rutas de Clientes */}
          <Route
            path="/clientes/tus-clientes"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <TusClientes />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/clientes/tus-proveedores"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <TusProveedores />
              </ProtectedRouteWrapper>
            }
          />

          {/* Rutas de Reportes */}
          <Route
            path="/reportes/reporte-cotizaciones"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <ReportesCotizaciones />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/reportes/reporte-solped"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <ReportesOrdenesCompra />
              </ProtectedRouteWrapper>
            }
          />

          {/* Rutas de Comprobantes */}
          <Route
            path="/comprobantes/comprobante-electronico"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <ComprobanteElectronico userData={userData} />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/comprobantes/tus-comprobantes"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <TusComprobantes userData={userData} />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/comprobantes/nota-credito-debito/:id"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <GenerarNotaCreditoDebito userData={userData} />
              </ProtectedRouteWrapper>
            }
          />

          {/* Rutas de Inventario */}
          <Route
            path="/inventario/reporte-kardex"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <ReporteKardex />
              </ProtectedRouteWrapper>
            }
          />

          {/* Rutas de RRHH */}
          <Route
            path="/rrhh/colaboradores"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <Colaboradores />
              </ProtectedRouteWrapper>
            }
          />

          <Route
            path="/rrhh/colaboradores-baja"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <ColaboradoresDeBaja />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/rrhh/cargo-laboral"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <CargoLaboral />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/rrhh/descanso-medicos"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <DescansoMedico />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/rrhh/solicitudes-descansos-medicos"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <SolicitudesDescansoMedico />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/rrhh/vacaciones"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <Vacaciones />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/rrhh/solicitudes-vacaciones"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <SolicitudesVacaciones />
              </ProtectedRouteWrapper>
            }
          />

          {/* Rutas de Ajustes */}
          <Route
            path="/ajustes/metodo-pago-gasto"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <MetodosPagosGastos />
              </ProtectedRouteWrapper>
            }
          />

          <Route
            path="/ajustes/encargados"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <Encargados />
              </ProtectedRouteWrapper>
            }
          />

          <Route
            path="/ajustes/bancos-cuentas-bancarias"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <BancosCuentasBancarias />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/ajustes/centro-costos"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <CentroCostos />
              </ProtectedRouteWrapper>
            }
          />
          {/* Rutas de Usuarios */}
          <Route
            path="/usuarios"
            element={
              <ProtectedRouteWrapper userRole={userRole}>
                <Usuarios />
              </ProtectedRouteWrapper>
            }
          />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
