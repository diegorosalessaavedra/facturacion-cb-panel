import React, { useEffect, useState } from "react";
import TablaProductos from "../components/TablaProductos";
import { Button, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import config from "../../../utils/getToken";
import { FaPlus } from "react-icons/fa";
import ModalNuevoProducto from "../components/ModalNuevoProducto";
import ModalEliminarProducto from "../components/ModalEliminarProducto";
import ModalHistorialProducto from "../components/ModalHistorialProducto/ModalHistorialProducto";
import ModalEditarProducto from "../components/ModalEditarProducto";
import FiltrarProductos from "../components/FiltrarProductos";

const ComercializacionServicios = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [productos, setProductos] = useState([]);
  const [selectModal, setSelectModal] = useState();
  const [selectProducto, setSelectProducto] = useState();
  const [selectStatus, setSelectStatus] = useState("Activo");

  const handleFindProductos = () => {
    const url = `${
      import.meta.env.VITE_URL_API
    }/productos/mis-productos?tipo_producto=Comercialización y servicios&status=${selectStatus}`;

    axios.get(url, config).then((res) => setProductos(res.data.misProductos));
  };

  useEffect(() => {
    handleFindProductos();
  }, []);

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      <div className="w-full h-full bg-white flex flex-col gap-4 rounded-md  overflow-y-auto overflow-x-hidden">
        <div className="w-full px-6 py-3 bg-blue-600 flex items-center     justify-between">
          <h2 className=" text-white font-normal text-lg">
            Productos de comercialización y servicios
          </h2>
          <Button
            className="bg-white"
            size="sm"
            startContent={<FaPlus />}
            onPress={() => {
              onOpen(), setSelectModal("nuevo");
            }}
          >
            Nuevo
          </Button>
        </div>
        <FiltrarProductos
          setSelectStatus={setSelectStatus}
          selectStatus={selectStatus}
          handleFindProductos={handleFindProductos}
        />
        <TablaProductos
          productos={productos}
          onOpen={onOpen}
          setSelectModal={setSelectModal}
          setSelectProducto={setSelectProducto}
        />
        {selectModal === "nuevo" && (
          <ModalNuevoProducto
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            handleFindProductos={handleFindProductos}
          />
        )}
        {selectModal === "eliminar" && (
          <ModalEliminarProducto
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            handleFindProductos={handleFindProductos}
            selectProducto={selectProducto}
          />
        )}
        {selectProducto && selectModal === "editar" && (
          <ModalEditarProducto
            key={selectProducto.id}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            handleFindProductos={handleFindProductos}
            selectProducto={selectProducto}
          />
        )}
        {selectModal === "historial" && (
          <ModalHistorialProducto
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            handleFindProductos={handleFindProductos}
            selectProducto={selectProducto}
          />
        )}
      </div>
    </div>
  );
};

export default ComercializacionServicios;
