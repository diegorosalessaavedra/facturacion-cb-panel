import React, { useEffect, useMemo, useState } from "react";
import { FaPlus, FaWpforms } from "react-icons/fa";
import { Button, select, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import config from "../../../utils/getToken";
import TablaTusProveedores from "./components/TablaTusProveedores";
import ModalNuevoProveedor from "./components/ModalNuevoProveedor/ModalNuevoProveedor";
import ModalEliminarProveedor from "./components/ModalEliminarProveedor";
import ModalEditarProveedor from "./components/ModalEditarProveedor/ModalEditarProveedor";
import FiltrarClientes from "../tusClientes/components/FiltrarClientes";

const TusProveedores = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [proveedores, setProveedores] = useState([]);
  const [selectModal, setSelectModal] = useState();
  const [selectProveedor, setSelectProveedor] = useState();
  const [dataFilter, setDataFilter] = useState({
    numeroDoc: "",
    nombreComercial: "",
  });

  const findProveedores = () => {
    const url = `${import.meta.env.VITE_URL_API}/proveedores?numeroDoc=${
      dataFilter.numeroDoc
    }&nombreComercial=${dataFilter.nombreComercial}`;

    axios
      .get(url, config)
      .then((res) => setProveedores(res.data.proveedores))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    findProveedores();
  }, []);

  const filtrarClientes = useMemo(
    () => (
      <FiltrarClientes
        setDataFilter={setDataFilter}
        dataFilter={dataFilter}
        findClients={findProveedores}
      />
    ),
    [dataFilter, findProveedores]
  );

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      <div className="w-full h-full bg-white flex flex-col gap-4 py-4 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 ">
          <div className="flex items-center gap-2 text-slate-600">
            <FaWpforms className="text-2xl" />
            <h2>Listado de Proveedores</h2>
          </div>
          <Button
            onPress={() => {
              onOpen();
              setSelectModal("nuevo");
            }}
            color="primary"
            variant="solid"
            startContent={<FaPlus />}
          >
            Nuevo
          </Button>
        </div>
        {filtrarClientes}

        <TablaTusProveedores
          proveedores={proveedores}
          loading={loading}
          onOpen={onOpen}
          setSelectModal={setSelectModal}
          setSelectProveedor={setSelectProveedor}
        />
      </div>
      {selectModal === "nuevo" && (
        <ModalNuevoProveedor
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          findProveedores={findProveedores}
        />
      )}

      {selectModal === "eliminar" && (
        <ModalEliminarProveedor
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          findProveedores={findProveedores}
          selectProveedor={selectProveedor}
        />
      )}
      {selectModal === "editar" && (
        <ModalEditarProveedor
          key={selectProveedor.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          findProveedores={findProveedores}
          selectProveedor={selectProveedor}
        />
      )}
    </div>
  );
};

export default TusProveedores;
