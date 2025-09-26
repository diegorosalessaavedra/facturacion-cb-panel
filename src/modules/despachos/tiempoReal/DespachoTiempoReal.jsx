import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../utils/getToken";
import NuevoBloque from "./components/bloque/components/NuevoBloque";
import { FaBoxOpen, FaPlus } from "react-icons/fa";
import CardBloque from "./components/bloque/CardBloque";
import { useSocketContext } from "../../../context/SocketContext";
import useEncargadosStore from "../../../stores/encargados.store";
import useClientesStore from "../../../stores/clientes.store";
import { Button, useDisclosure } from "@nextui-org/react";
import ModalNuevoCliente from "../../clientesProveedores/tusClientes/components/ModalNuevoCliente/ModalNuevoCliente";
import useCuentasBancariasStore from "../../../stores/cuentasBancarias.store";
import useMetodosPagosStore from "../../../stores/metodosPagos.store";
import useProveedoresStore from "../../../stores/proveedores.store";

const DespachoTiempoReal = () => {
  const socket = useSocketContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { fetchEncargados } = useEncargadosStore();
  const { fetchClientes } = useClientesStore();
  const { fetchProveedores } = useProveedoresStore();
  const { fetchCuentasBancarias } = useCuentasBancariasStore();
  const { fetchMetodosPagos } = useMetodosPagosStore();

  const [bloquesDespacho, setBloquesDespacho] = useState([]);

  const handleFindBloquesDespacho = () => {
    const url = `${import.meta.env.VITE_URL_API}/bloque-despacho`;

    axios.get(url, config).then((res) => {
      setBloquesDespacho(res.data.bloques);
    });
  };

  useEffect(() => {
    handleFindBloquesDespacho();
    fetchEncargados();
    fetchClientes();
    fetchProveedores();
    fetchCuentasBancarias();
    fetchMetodosPagos();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleCreated = (bloque) => {
      if (bloque) {
        setBloquesDespacho((prev) => [...prev, bloque]);
      }
    };

    const handleDeleted = (bloque) => {
      setBloquesDespacho((prev) => prev.filter((p) => p.id !== bloque.id));
    };

    socket.on("bloque:created", handleCreated);
    socket.on("bloque:delete", handleDeleted);

    return () => {
      socket.off("bloque:created", handleCreated);
      socket.off("bloque:delete", handleDeleted);
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
            <Button
              className="bg-amber-500"
              size="sm"
              color="primary"
              onPress={() => {
                onOpen();
              }}
            >
              <FaPlus />
              Cliente
            </Button>
            <NuevoBloque
              handleFindBloquesDespacho={handleFindBloquesDespacho}
            />
          </div>
        </div>
        <div className="w-full flex flex-col gap-4 px-4 overflow-y-auto">
          {bloquesDespacho.map((bloque, index) => (
            <CardBloque
              key={bloque.id}
              bloque={bloque}
              index={index}
              handleFindBloquesDespacho={handleFindBloquesDespacho}
            />
          ))}
        </div>
      </div>
      <ModalNuevoCliente
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        findClients={fetchClientes}
      />
    </div>
  );
};

export default DespachoTiempoReal;
