import { useEffect, useState, useCallback, useMemo } from "react";
import { FaPlus, FaWpforms } from "react-icons/fa";
import { Button, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import config from "../../../utils/getToken";
import TablaTusClientes from "./components/TablaTusClientes";
import ModalNuevoCliente from "./components/ModalNuevoCliente/ModalNuevoCliente";
import ModalEliminarCliente from "./components/ModalEliminarCliente";
import ModalEditarClientes from "./components/ModalEditarClientes/ModalEditarClientes";
import FiltrarClientes from "./components/FiltrarClientes";

const TusClientes = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [selectModal, setSelectModal] = useState();
  const [selectProveedor, setSelectProveedor] = useState();
  const [dataFilter, setDataFilter] = useState({
    numeroDoc: "",
    nombreComercial: "",
  });

  // Memoizar la función findClients para evitar recreaciones
  const findClients = useCallback(() => {
    const url = `${import.meta.env.VITE_URL_API}/clientes?numeroDoc=${
      dataFilter.numeroDoc
    }&nombreComercial=${dataFilter.nombreComercial}`;

    setLoading(true);

    axios
      .get(url, config)
      .then((res) => setClientes(res.data.clientes))
      .catch((error) => {
        console.error("Error al obtener clientes:", error);
        setClientes([]);
      })
      .finally(() => setLoading(false));
  }, [dataFilter.numeroDoc, dataFilter.nombreComercial]);

  // Memoizar el handler del botón nuevo
  const handleNuevoClick = useCallback(() => {
    setSelectModal("nuevo");
    onOpen();
  }, [onOpen]);

  // Memoizar el componente de filtros
  const filtrarClientes = useMemo(
    () => (
      <FiltrarClientes
        setDataFilter={setDataFilter}
        dataFilter={dataFilter}
        findClients={findClients}
      />
    ),
    [dataFilter, findClients]
  );

  // Memoizar la tabla de clientes
  const tablaClientes = useMemo(
    () => (
      <TablaTusClientes
        clientes={clientes}
        loading={loading}
        onOpen={onOpen}
        setSelectModal={setSelectModal}
        setSelectProveedor={setSelectProveedor}
      />
    ),
    [clientes, loading, onOpen]
  );

  // Cargar clientes al montar el componente
  useEffect(() => {
    findClients();
  }, []);

  // Renderizar modales condicionalmente
  const renderModal = () => {
    switch (selectModal) {
      case "nuevo":
        return (
          <ModalNuevoCliente
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            findClients={findClients}
          />
        );
      case "eliminar":
        return (
          <ModalEliminarCliente
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            findClients={findClients}
            selectProveedor={selectProveedor}
          />
        );
      case "editar":
        return (
          <ModalEditarClientes
            key={selectProveedor?.id}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            findClients={findClients}
            selectProveedor={selectProveedor}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      <div className="w-full h-full bg-white flex flex-col gap-2 py-4 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2 text-slate-600">
            <FaWpforms className="text-2xl" />
            <h2>Listado de clientes</h2>
          </div>
          <Button
            onPress={handleNuevoClick}
            color="primary"
            variant="solid"
            startContent={<FaPlus />}
          >
            Nuevo
          </Button>
        </div>

        {filtrarClientes}
        {tablaClientes}
      </div>

      {renderModal()}
    </div>
  );
};

export default TusClientes;
