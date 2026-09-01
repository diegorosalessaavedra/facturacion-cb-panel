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
import { API } from "../../../utils/api";
import ClientesRevendedor from "./components/ClientesRevendedor";

const TusClientes = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [sinRevendedor, setSinRevendedor] = useState([]);

  // 🟢 Estados para Paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectModal, setSelectModal] = useState();
  const [selectProveedor, setSelectProveedor] = useState();
  const [dataFilter, setDataFilter] = useState({
    numeroDoc: "",
    nombreComercial: "",
    permiso_credito: "todos",
    tipo_cliente: "todos",
  });

  // Al filtrar, regresamos a la página 1
  const handleDataFilter = (newFilter) => {
    setDataFilter(newFilter);
    setPage(1);
  };

  const findClients = useCallback(() => {
    // 🟢 Agregamos explícitamente limit=10 a la URL para que coincida con tu tabla
    let url = `${API}/clientes/page?page=${page}&limit=30&numeroDoc=${dataFilter.numeroDoc}&nombreComercial=${dataFilter.nombreComercial}`;

    if (dataFilter.permiso_credito && dataFilter.permiso_credito !== "todos") {
      url += `&permiso_credito=${dataFilter.permiso_credito}`;
    }

    if (dataFilter.tipo_cliente && dataFilter.tipo_cliente !== "todos") {
      url += `&tipo_cliente=${dataFilter.tipo_cliente}`;
    }

    setLoading(true);

    axios
      .get(url, config)
      .then((res) => {
        setClientes(res.data.clientes);
        // Extraemos el total de páginas desde la metadata de tu backend
        setTotalPages(res.data.pagination?.total_pages || 1);
      })
      .catch((error) => {
        console.error("Error al obtener clientes:", error);
        setClientes([]);
      })
      .finally(() => setLoading(false));
  }, [
    dataFilter.numeroDoc,
    dataFilter.nombreComercial,
    dataFilter.permiso_credito,
    dataFilter.tipo_cliente,
    page, // 🟢 La función reacciona a cambios de página
  ]);

  const handleNuevoClick = useCallback(() => {
    setSelectModal("nuevo");
    onOpen();
  }, [onOpen]);

  const tablaClientes = useMemo(
    () => (
      <TablaTusClientes
        clientes={clientes}
        loading={loading}
        onOpen={onOpen}
        setSelectModal={setSelectModal}
        setSelectProveedor={setSelectProveedor}
        // 🟢 Pasamos los estados de paginación a la tabla
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    ),
    [clientes, loading, onOpen, page, totalPages],
  );

  const findsinRevendedor = () => {
    const url = `${import.meta.env.VITE_URL_API}/clientes/sin-revendedor`;

    axios.get(url, config).then((res) => {
      setSinRevendedor(res.data.clientes);
    });
  };

  // 🟢 useEffect 1: Se ejecuta cada vez que findClients cambia (es decir, cuando cambia la página o un filtro)
  useEffect(() => {
    findClients();
  }, [findClients]);

  // 🟢 useEffect 2: Se ejecuta SOLO una vez al montar el componente para los revendedores
  useEffect(() => {
    findsinRevendedor();
  }, []);

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      <div className="w-full h-full bg-white flex flex-col gap-2 py-4 px-4 rounded-md overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 text-slate-600">
            <FaWpforms className="text-2xl" />
            <h2>Listado de Clientes</h2>
          </div>
          <Button
            className="bg-slate-950"
            onPress={handleNuevoClick}
            color="primary"
            variant="solid"
            startContent={<FaPlus />}
          >
            Nuevo
          </Button>
        </div>

        <FiltrarClientes
          setDataFilter={handleDataFilter}
          dataFilter={dataFilter}
          findClients={findClients}
        />

        {tablaClientes}
      </div>

      {selectModal === "nuevo" && (
        <ModalNuevoCliente
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          findClients={findClients}
        />
      )}
      {selectModal === "eliminar" && selectProveedor && (
        <ModalEliminarCliente
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          findClients={findClients}
          selectProveedor={selectProveedor}
        />
      )}
      {selectModal === "editar" && selectProveedor && (
        <ModalEditarClientes
          key={selectProveedor?.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          findClients={findClients}
          selectProveedor={selectProveedor}
        />
      )}
      {selectModal === "revendedor" && selectProveedor && (
        <ClientesRevendedor
          key={selectProveedor?.id}
          sinRevendedor={sinRevendedor}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          findClients={findClients}
          selectCliente={selectProveedor}
        />
      )}
    </div>
  );
};

export default TusClientes;
