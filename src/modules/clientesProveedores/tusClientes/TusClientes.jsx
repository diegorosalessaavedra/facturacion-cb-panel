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

  // 🟢 1. Nuevos estados para Paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectModal, setSelectModal] = useState();
  const [selectProveedor, setSelectProveedor] = useState();
  const [dataFilter, setDataFilter] = useState({
    numeroDoc: "",
    nombreComercial: "",
    permiso_credito: "todos",
  });

  // 🟢 2. Modificamos el setFilter para que cada que busques, te regrese a la página 1
  const handleDataFilter = (newFilter) => {
    setDataFilter(newFilter);
    setPage(1);
  };

  const findClients = useCallback(() => {
    // 🟢 3. Agregamos "page" a la URL de consulta
    let url = `${API}/clientes/page?page=${page}&numeroDoc=${dataFilter.numeroDoc}&nombreComercial=${dataFilter.nombreComercial}`;

    if (dataFilter.permiso_credito && dataFilter.permiso_credito !== "todos") {
      url += `&permiso_credito=${dataFilter.permiso_credito}`;
    }

    setLoading(true);

    axios
      .get(url, config)
      .then((res) => {
        setClientes(res.data.clientes);
        // 🟢 4. Extraemos el total de páginas desde la metadata de tu backend
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
    page, // 🟢 La función ahora reacciona a cambios de página
  ]);

  const handleNuevoClick = useCallback(() => {
    setSelectModal("nuevo");
    onOpen();
  }, []);

  const tablaClientes = useMemo(
    () => (
      <TablaTusClientes
        clientes={clientes}
        loading={loading}
        onOpen={onOpen}
        setSelectModal={setSelectModal}
        setSelectProveedor={setSelectProveedor}
        // 🟢 5. Pasamos los estados de paginación a la tabla
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

  useEffect(() => {
    findClients();
    findsinRevendedor();
  }, []);

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      <div className="w-full h-full bg-white flex flex-col gap-2 py-4  px-4 rounded-md overflow-y-auto">
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
          setDataFilter={handleDataFilter} // Usamos nuestra nueva función wrapper
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
