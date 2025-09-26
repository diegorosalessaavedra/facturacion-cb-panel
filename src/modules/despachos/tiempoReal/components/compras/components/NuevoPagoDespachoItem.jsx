import { Button } from "@nextui-org/react";
import axios from "axios";
import React, { useState } from "react";
import config from "../../../../../../utils/getToken";
import Loading from "../../../../../../hooks/Loading";
import { FaPlus } from "react-icons/fa";

const NuevoPagoDespachoItem = ({ bloque }) => {
  const [loading, setLoading] = useState(false);

  const handleNuevoProductoDespacho = () => {
    setLoading(true);
    const url = `${import.meta.env.VITE_URL_API}/pago-despacho-item/${
      bloque.id
    }`;

    axios
      .post(url, {}, config)
      .then((res) => {
        console.log(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {loading && <Loading />}
      <Button
        className="absolute -top-9 right-0"
        color="warning"
        size="sm"
        onPress={handleNuevoProductoDespacho}
      >
        <FaPlus /> Pago
      </Button>
    </>
  );
};

export default NuevoPagoDespachoItem;
