import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../utils/getToken";
import { useParams } from "react-router-dom";
import { FaWpforms } from "react-icons/fa";
import FormGenerarNotaCreditoDebito from "./components/formGenerarNotaCreditoDebito/FormGenerarNotaCreditoDebito";
import SectionOneGenerarNotaCreditoDebito from "./components/SectionOneGenerarNotaCreditoDebito";

const GenerarNotaCreditoDebito = ({ userData }) => {
  const { id } = useParams();
  const [comprobanteElectronico, setComprobanteElectronico] = useState(null);

  useEffect(() => {
    const url = `${
      import.meta.env.VITE_URL_API
    }/comprobantes/comprobante-electronico/${id}`;

    axios.get(url, config).then((res) => {
      setComprobanteElectronico(res.data.comprobanteElectronico);
    });
  }, [id]);

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      <div className="w-full h-full bg-white flex flex-col gap-4 py-4 rounded-md overflow-hidden">
        <SectionOneGenerarNotaCreditoDebito
          comprobanteElectronico={comprobanteElectronico}
        />
        <FormGenerarNotaCreditoDebito
          userData={userData}
          comprobanteElectronico={comprobanteElectronico}
        />
      </div>
    </div>
  );
};

export default GenerarNotaCreditoDebito;
