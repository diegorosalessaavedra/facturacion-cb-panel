import React, { useEffect, useCallback, useMemo, useState } from "react";
import { FaPlus, FaWpforms } from "react-icons/fa";
import { Button, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import config from "../../../utils/getToken";
import TablaTusProveedores from "./components/TablaTusProveedores";
import ModalNuevoProveedor from "./components/ModalNuevoProveedor/ModalNuevoProveedor";
import ModalEliminarProveedor from "./components/ModalEliminarProveedor";
import ModalEditarProveedor from "./components/ModalEditarProveedor/ModalEditarProveedor";
import FiltrarClientes from "../tusClientes/components/FiltrarClientes";
import EEccProveedores from "./components/EEccProveedores";
import { handleAxiosError } from "../../../utils/handleAxiosError";

const TusProveedores = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [proveedores, setProveedores] = useState([]);
  const [selectModal, setSelectModal] = useState(null);
  const [selectProveedor, setSelectProveedor] = useState(null);
  const [dataFilter, setDataFilter] = useState({
    numeroDoc: "",
    nombreComercial: "",
  });

  // 1. Optimización: useCallback evita que esta función se re-cree innecesariamente
  const findProveedores = useCallback(() => {
    setLoading(true); // Fundamental para mostrar el loader al aplicar filtros

    const url = `${import.meta.env.VITE_URL_API}/proveedores?numeroDoc=${dataFilter.numeroDoc}&nombreComercial=${dataFilter.nombreComercial}`;

    axios
      .get(url, config)
      .then((res) => setProveedores(res.data.proveedores))
      .catch((err) => handleAxiosError(err))
      .finally(() => setLoading(false));
  }, [dataFilter.numeroDoc, dataFilter.nombreComercial]);

  useEffect(() => {
    findProveedores();
  }, [findProveedores]);

  const filtrarClientes = useMemo(
    () => (
      <FiltrarClientes
        setDataFilter={setDataFilter}
        dataFilter={dataFilter}
        findClients={findProveedores}
      />
    ),
    [dataFilter, findProveedores],
  );

  return (
    <div className="w-full h-screen bg-slate-100 p-4 pt-[90px] overflow-x-hidden overflow-y-auto">
      {/* Contenedor principal estilo Tarjeta */}
      <div className="w-full flex-1 bg-white flex flex-col gap-6 p-5 md:p-6 rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Cabecera Responsiva */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-slate-800">
            {/* Ícono destacado para darle un toque más premium */}
            <div className="p-2.5 bg-amber-50 rounded-lg text-amber-500">
              <FaWpforms className="text-xl" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Listado de Proveedores
            </h2>
          </div>

          <Button
            onPress={() => {
              setSelectModal("nuevo");
              onOpen();
            }}
            color="primary"
            startContent={<FaPlus />}
            className="font-medium w-full sm:w-auto bg-slate-900"
          >
            Nuevo Proveedor
          </Button>
        </div>

        {/* Zona de Filtros */}
        <div className="w-full">{filtrarClientes}</div>

        {/* Zona de la Tabla (flex-1 para que tome el espacio restante) */}
        <div className=" flex-1 border border-slate-50 rounded-lg">
          <TablaTusProveedores
            proveedores={proveedores}
            loading={loading}
            onOpen={onOpen}
            setSelectModal={setSelectModal}
            setSelectProveedor={setSelectProveedor}
          />
        </div>
      </div>

      {/* Renderizado Condicional de Modales */}
      {selectModal === "nuevo" && (
        <ModalNuevoProveedor
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          findProveedores={findProveedores}
        />
      )}

      {selectModal === "eliminar" && selectProveedor && (
        <ModalEliminarProveedor
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          findProveedores={findProveedores}
          selectProveedor={selectProveedor}
        />
      )}

      {selectModal === "editar" && selectProveedor && (
        <ModalEditarProveedor
          key={selectProveedor.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          findProveedores={findProveedores}
          selectProveedor={selectProveedor}
        />
      )}
      {selectModal === "eecc" && selectProveedor && (
        <EEccProveedores
          key={selectProveedor.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          selectProveedor={selectProveedor}
        />
      )}
    </div>
  );
};

export default TusProveedores;
