import { Button } from "@nextui-org/react";
import axios from "axios";
import React, { useState } from "react";
import config from "../../../../../../utils/getToken";
import Loading from "../../../../../../hooks/Loading";
import { FaPlus } from "react-icons/fa";

const NuevoDespacho = ({ bloqueId }) => {
  const [loading, setLoading] = useState(false);

  const handleNuevoBloque = () => {
    setLoading(true);
    const url = `${import.meta.env.VITE_URL_API}/despacho/${bloqueId}`;

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
      <Button color="success" size="sm" onPress={handleNuevoBloque}>
        <FaPlus /> Despacho
      </Button>
    </>
  );
};

export default NuevoDespacho;
