import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../utils/getToken";
import NuevoBloque from "./components/bloque/components/NuevoBloque";
import { FaBoxOpen } from "react-icons/fa";
import CardBloque from "./components/bloque/CardBloque";
import { useSocketContext } from "../../../context/SocketContext";

export default function DespachoTiempoReal() {
  const socket = useSocketContext();

  const [bloquesDespacho, setBloquesDespacho] = useState([]);

  const handleFindBloquesDespacho = () => {
    const url = `${import.meta.env.VITE_URL_API}/bloque-despacho`;

    axios.get(url, config).then((res) => {
      setBloquesDespacho(res.data.bloques);
    });
  };

  useEffect(() => {
    handleFindBloquesDespacho();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("bloque:created", (bloque) => {
      if (bloque) {
        setBloquesDespacho((prev) => [...prev, bloque]);
      }
    });

    return () => {
      socket.off("bloque:created");
    };
  }, [socket]);

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      <div className="w-full h-full bg-white flex flex-col gap-4 py-4 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 ">
          <div className="flex items-center gap-2 text-slate-600">
            <FaBoxOpen className="text-2xl" />
            <h2>Despachos</h2>
          </div>
          <div className="flex gap-2">
            <NuevoBloque
              handleFindBloquesDespacho={handleFindBloquesDespacho}
            />
          </div>
        </div>
        <div className="w-full flex flex-col gap-4 px-4 overflow-y-auto">
          {bloquesDespacho.map((bloque, index) => (
            <CardBloque key={bloque.id} bloque={bloque} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
