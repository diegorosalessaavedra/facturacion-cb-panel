import React, { useState, useEffect } from "react";
import axios from "axios";


import { API } from "../../../utils/api";

import config from "../../../utils/getToken";
import PrestamosHeader from "./components/PrestamosHeader";
import NuevaSolicitudPrestamo from "./components/NuevaSolicitudPrestamo";
import { useDisclosure } from "@nextui-org/react";
import TablaPrestamos from "./components/TablaPrestamos";


const Prestamos = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [colaboradores, setColaboradores] = useState([]);
  const [prestamos, setPrestamos] = useState([]);


  const handleFindColaboradores = () => {
    const url = `${API}/rrhh/colaboradores?cargoLaboral=todos`;

    axios
      .get(url, config)
      .then((res) => {
        setColaboradores(res.data.colaboradores);
      })
      .finally(() => setLoading(false));
  };

  const handlePrestamos = () => {
    const url = `${API}/prestamos`;

    axios
      .get(url, config)
      .then((res) => {
        setPrestamos(res.data.prestamos);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleFindColaboradores();
    handlePrestamos();
  }, []);

  console.log("prestamos", prestamos);

  return (
    <main className="w-full h-screen bg-slate-50 p-4 md:pt-[90px] overflow-hidden flex flex-col">
      <div className="max-w-[1600px] w-full h-full mx-auto flex flex-col gap-2">
        {loading && (
          <span className="text-xs text-gray-500">Cargando datos...</span>
        )}

        <PrestamosHeader
          onOpen={onOpen}
        />


        <TablaPrestamos prestamos={prestamos}/>
      </div>
      {
        isOpen && (
          <NuevaSolicitudPrestamo
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            colaboradores={colaboradores}

          />
        )
      }
    </main>
  );
};

export default Prestamos;
