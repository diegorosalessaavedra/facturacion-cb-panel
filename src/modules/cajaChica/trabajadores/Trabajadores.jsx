import { Button, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { handleAxiosError } from "../../../utils/handleAxiosError";
import config from "../../../utils/getToken";
import axios from "axios";
import { API } from "../../../utils/api";
import { FaPlus, FaUsers } from "react-icons/fa";
import TablaTrabajadores from "./components/TablaTrabajadores";
import CreateTrabajador from "./components/crudTrabajador/CreateTrabajador";
import UpdateTrabajador from "./components/crudTrabajador/UpdateTrabajador";
import DeleteTrabajador from "./components/crudTrabajador/DeleteTrabajador";
import LoadingSpinner from "../../../components/LoadingSpinner";

const Trabajadores = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [selectModal, setSelectModal] = useState("");
  const [trabajadores, setTrabajadores] = useState([]);
  const [selectTrabajador, setSelectTrabajador] = useState(null);

  const handleFindTrabajadores = () => {
    setLoading(true);
    const url = `${API}/caja-chica/trabajador`;

    axios
      .get(url, config)
      .then((res) => setTrabajadores(res.data.trabajadores))
      .catch((err) => {
        handleAxiosError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleFindTrabajadores();
  }, []);

  return (
    <main className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      {loading && <LoadingSpinner />}
      <div className="w-full h-full bg-white flex flex-col gap-2 p-4 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2 text-slate-600">
            <FaUsers className="text-2xl" />
            <h2>TRABAJADORES</h2>
          </div>
          <Button
            className="bg-slate-900"
            onPress={() => {
              setSelectModal("create");
              onOpen();
            }}
            color="primary"
            startContent={<FaPlus />}
          >
            Trabajador
          </Button>
        </div>

        <TablaTrabajadores
          trabajadores={trabajadores}
          setSelectTrabajador={setSelectTrabajador}
          setSelectModal={setSelectModal}
          onOpen={onOpen}
        />
      </div>
      {selectModal === "create" && (
        <CreateTrabajador
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindTrabajadores={handleFindTrabajadores}
        />
      )}
      {selectModal === "update" && selectTrabajador && (
        <UpdateTrabajador
          key={selectTrabajador.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindTrabajadores={handleFindTrabajadores}
          selectTrabajador={selectTrabajador}
        />
      )}
      {selectModal === "delete" && selectTrabajador && (
        <DeleteTrabajador
          key={selectTrabajador.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindTrabajadores={handleFindTrabajadores}
          selectTrabajador={selectTrabajador}
        />
      )}
    </main>
  );
};

export default Trabajadores;
