import { Button } from "@nextui-org/react";
import axios from "axios";
import React, { useState } from "react";
import config from "../../../../../../utils/getToken";
import Loading from "../../../../../../hooks/Loading";

const NuevoBloque = ({ handleFindBloquesDespacho }) => {
  const [loading, setLoading] = useState(false);

  const handleNuevoBloque = () => {
    setLoading(true);
    const url = `${import.meta.env.VITE_URL_API}/bloque-despacho`;

    axios
      .post(url, {}, config)
      .then((res) => {
        handleFindBloquesDespacho();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {loading && <Loading />}
      <Button color="primary" size="sm" onPress={handleNuevoBloque}>
        NUEVO BLOQUE
      </Button>
    </>
  );
};

export default NuevoBloque;
