import Bancos from "./components/bancos /Bancos";
import CuentasBancarias from "./components/cuentasBancarias/CuentasBancarias";

const BancosCuentasBancarias = () => {
  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 pt-[90px] overflow-hidden">
      <div className=" mx-auto bg-white p-4 rounded-2xl flex flex-col gap-6 h-full">
        {/* Encabezado de la página */}

        <header className="flex-none relative w-full min-h-[68px] bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg shadow-md overflow-hidden p-2 flex items-center justify-between">
          <div className="flex items-center gap-6 relative z-10">
            <div className="bg-white p-2 rounded-md shadow-md">
              <img
                className="w-12 h-12 object-contain"
                src="/logo.jpg"
                alt="logo"
              />
            </div>
            <div className="text-white">
              <h1 className="text-xl font-bold tracking-tight">
                Gestión Financiera
              </h1>
              <p className="text-xs text-slate-200 ">
                Administra tus bancos y cuentas bancarias asociadas.
              </p>
            </div>
          </div>
        </header>

        {/* Contenedor Responsive (1 columna en móvil, 2 en PC) */}
        <div className="flex gap-4 overflow-y-auto pb-10">
          <Bancos />
          <CuentasBancarias />
        </div>
      </div>
    </div>
  );
};

export default BancosCuentasBancarias;
