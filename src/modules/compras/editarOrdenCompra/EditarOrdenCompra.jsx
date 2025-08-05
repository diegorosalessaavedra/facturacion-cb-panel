import React, { useEffect, useState } from "react";
import { Divider } from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import config from "../../../utils/getToken";
import BanerEditarOrdenCompra from "./components/BanerEditarOrdenCompra";
import FormEditarOrdenCompra from "./components/FormEditarCotizacion/FormEditarOrdenCompra";

const EditarOrdenCompra = ({ userData }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [ordenCompra, setOrdenCompra] = useState();

  const handleOrdenCompra = () => {
    const url = `${import.meta.env.VITE_URL_API}/compras/orden-compra/${id}`;

    axios
      .get(url, config)
      .then((res) => {
        setOrdenCompra(res.data.ordenCompra);
      })
      .catch((err) => navigate("/compras/ordenes-compra"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleOrdenCompra();
  }, [id]);

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-auto">
      <div className="w-full  bg-white flex flex-col gap-4 px-6 rounded-md ">
        <BanerEditarOrdenCompra />
        <Divider className="bg-neutral-200 h-[2px] mt-[-15px]" />
        {loading && (
          <Spinner className="m-auto" label="Cargando..." color="success" />
        )}
        {ordenCompra && !loading && (
          <FormEditarOrdenCompra
            ordenCompra={ordenCompra}
            userData={userData}
            id={id}
          />
        )}
      </div>
    </div>
  );
};

export default EditarOrdenCompra;
