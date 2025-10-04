import { Button } from "@nextui-org/react";
import axios from "axios";
import React, { useState } from "react";

import { FaPlus } from "react-icons/fa";
import config from "../../../../../../../utils/getToken";
import Loading from "../../../../../../../hooks/Loading";

export default function NuevoProductoDespacho({ depachoId }) {
  const [loading, setLoading] = useState(false);

  const handleNuevoProductoDespacho = () => {
    setLoading(true);
    const url = `${
      import.meta.env.VITE_URL_API
    }/producto-despacho/${depachoId}`;

    axios
      .post(url, {}, config)

      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {loading && <Loading />}
      <button
        className="w-7 h-7 bg-amber-500  flex items-center justify-center rounded-md "
        onClick={handleNuevoProductoDespacho}
      >
        <FaPlus className="text-white text-xs" />
      </button>
    </>
  );
}
