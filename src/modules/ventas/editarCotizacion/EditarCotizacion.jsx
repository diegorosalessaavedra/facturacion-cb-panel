import React, { useEffect, useState } from "react";
import { Divider } from "@nextui-org/react";
import SectionUnoEditarCotizacion from "./components/SectionUnoEditarCotizacion";
import FormEditarCotizacion from "./components/FormEditarCotizacion/FormEditarCotizacion";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../../../utils/getToken";

const EditarCotizacion = ({ userData }) => {
  const [cotizacion, setCotizacion] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const url = `${import.meta.env.VITE_URL_API}/ventas/cotizaciones/${id}`;

    axios.get(url, config).then((res) => setCotizacion(res.data.cotizacion));
  }, []);

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-auto">
      <div className="w-full  bg-white flex flex-col gap-4 px-6 rounded-md ">
        <SectionUnoEditarCotizacion />
        <Divider className="bg-neutral-200 h-[2px] mt-[-15px]" />
        {cotizacion && (
          <FormEditarCotizacion userData={userData} cotizacion={cotizacion} />
        )}
      </div>
    </div>
  );
};

export default EditarCotizacion;
