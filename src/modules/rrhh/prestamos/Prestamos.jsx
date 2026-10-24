import React, { useState, useEffect } from "react";
import axios from "axios";

import { API } from "../../../utils/api";
import config from "../../../utils/getToken";
import PrestamosHeader from "./components/PrestamosHeader";
import NuevaSolicitudPrestamo from "./components/crudPrestamo/NuevaSolicitudPrestamo";
import { useDisclosure } from "@nextui-org/react";
import TablaPrestamos from "./components/TablaPrestamos";
import FiltroPrestamos from "./components/FiltroPrestamos";

const Prestamos = ({ userRole }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [colaboradores, setColaboradores] = useState([]);
  const [prestamos, setPrestamos] = useState([]);

  // Estados para los filtros
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const handleFindColaboradores = () => {
    const url = `${API}/rrhh/colaboradores?cargoLaboral=todos`;

    axios
      .get(url, config)
      .then((res) => {
        setColaboradores(res.data.colaboradores);
      })
      .catch((err) => console.log(err));
  };

  const handlePrestamos = () => {
    setLoading(true);
    
    // Construimos los query params dinámicamente
    const params = new URLSearchParams();
    if (filtroEstado && filtroEstado !== "TODOS") params.append("estado", filtroEstado);
    if (fechaInicio) params.append("fechaInicio", fechaInicio);
    if (fechaFin) params.append("fechaFin", fechaFin);

    const queryString = params.toString();
    const url = `${API}/prestamos${queryString ? `?${queryString}` : ""}`;

    axios
      .get(url, config)
      .then((res) => {
        setPrestamos(res.data.prestamos);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleFindColaboradores();
    handlePrestamos(); // Carga inicial
  }, []);

  console.log("Prestamos.jsx - prestamos:", prestamos);

  return (
    <main className="w-full h-screen bg-slate-50 p-4 md:pt-[90px] overflow-hidden flex flex-col">
      <div className="max-w-[1600px] w-full h-full mx-auto flex flex-col gap-2">
        {loading && (
          <span className="text-xs text-gray-500">Cargando datos...</span>
        )}

        <PrestamosHeader onOpen={onOpen} />

        <FiltroPrestamos
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
          fechaInicio={fechaInicio}
          setFechaInicio={setFechaInicio}
          fechaFin={fechaFin}
          setFechaFin={setFechaFin}
          onBuscar={handlePrestamos} // <-- Ejecuta la petición al backend
        />

        {/* Pasamos los préstamos directos del backend */}
        <TablaPrestamos 
          prestamos={prestamos} 
          userRole={userRole} 
          fetchPrestamos={handlePrestamos} 
          colaboradores={colaboradores} 
        />
      </div>

      {isOpen && (
        <NuevaSolicitudPrestamo
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          colaboradores={colaboradores}
          fetchPrestamos={handlePrestamos}
        />
      )}
    </main>
  );
};

export default Prestamos;