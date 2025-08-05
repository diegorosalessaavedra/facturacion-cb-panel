import { Button, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { FaPlus, FaWpforms } from "react-icons/fa";
import TablaUsuarios from "./components/TablaUsuarios";
import axios from "axios";
import config from "../../utils/getToken";
import ModalNuevoUsuario from "./components/ModalNuevoUsuario";
import ModalEditarUsuario from "./components/ModalEditarUsuario";
import ModalEliminarUsuario from "./components/ModalEliminarUsuario";

const Usuarios = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [selectModal, setSelectModal] = useState();
  const [usuarios, setUsuarios] = useState([]);
  const [selectUsuario, setSelectUsuario] = useState();

  const handleFindUsuarios = () => {
    const url = `${import.meta.env.VITE_URL_API}/users`;

    axios
      .get(url, config)
      .then((res) => {
        setUsuarios(res.data.users);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleFindUsuarios();
  }, []);

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-auto">
      <div className="w-full h-full bg-white flex flex-col gap-4 py-4 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 ">
          <div className="flex items-center gap-2 text-slate-600">
            <FaWpforms className="text-2xl" />
            <h2>Usuarios</h2>
          </div>
          <Button
            onPress={() => {
              setSelectModal("nuevo");
              onOpen();
            }}
            color="primary"
            variant="solid"
            startContent={<FaPlus />}
          >
            Nuevo
          </Button>
        </div>
        <TablaUsuarios
          onOpen={onOpen}
          usuarios={usuarios}
          loading={loading}
          setSelectUsuario={setSelectUsuario}
          setSelectModal={setSelectModal}
        />
      </div>
      {selectModal === "nuevo" && (
        <ModalNuevoUsuario
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindUsuarios={handleFindUsuarios}
        />
      )}
      {selectModal === "editar" && (
        <ModalEditarUsuario
          key={selectUsuario.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindUsuarios={handleFindUsuarios}
          selectUsuario={selectUsuario}
        />
      )}
      {selectModal === "eliminar" && (
        <ModalEliminarUsuario
          key={selectUsuario.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindUsuarios={handleFindUsuarios}
          selectUsuario={selectUsuario}
        />
      )}
    </div>
  );
};

export default Usuarios;
