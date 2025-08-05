import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import TablaHistorialCompraProducto from "./components/TablaHistorialCompraProducto";
import axios from "axios";
import config from "../../../../utils/getToken";
import { getTodayDate } from "../../../../assets/getTodayDate";

const ModalHistorialProducto = ({ isOpen, onOpenChange, selectProducto }) => {
  const [selectedNav, setSelectedNav] = useState("compra");
  const [fechaInicio, setFechaInicio] = useState(getTodayDate());
  const [fechaFinal, setFechaFinal] = useState(getTodayDate());

  const [ordenesCompra, setOrdenesCompra] = useState([]);

  const handleFindOrdenCompra = () => {
    const url = `${
      import.meta.env.VITE_URL_API
    }/compras/productos-orden-compra/producto/${selectProducto.id}`;

    axios.get(url, config).then((res) => {
      setOrdenesCompra(res.data.productosOrdenCompras);
    });
  };
  useEffect(() => {
    handleFindOrdenCompra();
  }, [selectProducto]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="5xl"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-base">
          Agregar nuevo Producto
        </ModalHeader>
        <ModalBody className="min-h-[70vh] ">
          <div className=" flex gap-2">
            <button
              className={`p-2 ${
                selectedNav === "compra"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              } border-1 border-blue-500 text-sm rounded-md transition-all duration-300`}
              onClick={() => setSelectedNav("compra")}
            >
              Orden Compra
            </button>
            <button
              className={`p-2 ${
                selectedNav === "venta"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              } border-1 border-blue-500 text-sm rounded-md transition-all duration-300`}
              onClick={() => setSelectedNav("venta")}
            >
              Ventas
            </button>
          </div>
          {selectedNav === "compra" && (
            <TablaHistorialCompraProducto ordenesCompra={ordenesCompra} />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalHistorialProducto;
