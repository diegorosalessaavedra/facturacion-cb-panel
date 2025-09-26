import { Button } from "@nextui-org/react";
import axios from "axios";
import React, { useState } from "react";
import config from "../../../../../../utils/getToken";
import Loading from "../../../../../../hooks/Loading";
import { FaPlus } from "react-icons/fa";

const NuevaCompra = ({ bloqueId }) => {
  const [loading, setLoading] = useState(false);

  const handleNuevaCompra = () => {
    setLoading(true);
    const url = `${import.meta.env.VITE_URL_API}/compra-despacho/${bloqueId}`;

    axios
      .post(url, {}, config)
      .then((res) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {loading && <Loading />}
      <Button color="success" size="sm" onPress={handleNuevaCompra}>
        <FaPlus /> Compra
      </Button>
    </>
  );
};

export default NuevaCompra;
