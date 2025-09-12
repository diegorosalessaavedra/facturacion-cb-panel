import axios from "axios";
import React, { useState } from "react";

import { FaMinus } from "react-icons/fa";
import config from "../../../../../../../utils/getToken";
import Loading from "../../../../../../../hooks/Loading";

export default function EliminarProductoDespacho({ productoId }) {
  const [loading, setLoading] = useState(false);

  const handleEliminarProductoDespacho = () => {
    setLoading(true);
    const url = `${
      import.meta.env.VITE_URL_API
    }/producto-despacho/${productoId}`;

    axios
      .delete(url, config)
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
      <button
        className="w-7 h-7 bg-red-500  flex items-center justify-center rounded-md "
        onClick={handleEliminarProductoDespacho}
      >
        <FaMinus className="text-white text-sm" />
      </button>
    </>
  );
}
