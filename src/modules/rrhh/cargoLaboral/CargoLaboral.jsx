import { Button, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaPlus, FaWpforms } from "react-icons/fa";
import axios from "axios";
import config from "../../../utils/getToken";
import TablaCargoLaboral from "./components/TablaCargoLaboral";
import ModalNuevaCargaLaboral from "./components/ModalNuevaCargaLaboral";
import ModalEditarCargoLaboral from "./components/ModalEditarCargoLaboral";
import ModalEliminarCargoLaboral from "./components/ModalEliminarCargoLaboral";

const CargoLaboral = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [selectModal, setSelectModal] = useState();
  const [cargoLaborales, setCargoLaborales] = useState([]);
  const [selectCargoLaboral, setSelectCargoLaboral] = useState();

  const handleFindCargoLaboral = () => {
    const url = `${import.meta.env.VITE_URL_API}/rrhh/cargo-laboral`;

    axios
      .get(url, config)
      .then((res) => {
        setCargoLaborales(res.data.cargoLaborales);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleFindCargoLaboral();
  }, []);

  return (
    <div className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-auto">
      <div className="w-full h-full bg-white flex flex-col gap-4 py-4 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 ">
          <div className="flex items-center gap-2 text-slate-600">
            <FaWpforms className="text-2xl" />
            <h2>Cargo Laboral</h2>
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
        <TablaCargoLaboral
          onOpen={onOpen}
          cargoLaborales={cargoLaborales}
          loading={loading}
          setSelectCargoLaboral={setSelectCargoLaboral}
          setSelectModal={setSelectModal}
        />
      </div>
      {selectModal === "nuevo" && (
        <ModalNuevaCargaLaboral
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindCargoLaboral={handleFindCargoLaboral}
        />
      )}
      {selectModal === "editar" && (
        <ModalEditarCargoLaboral
          key={selectCargoLaboral.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindCargoLaboral={handleFindCargoLaboral}
          selectCargoLaboral={selectCargoLaboral}
        />
      )}
      {selectModal === "eliminar" && (
        <ModalEliminarCargoLaboral
          key={selectCargoLaboral.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindCargoLaboral={handleFindCargoLaboral}
          selectCargoLaboral={selectCargoLaboral}
        />
      )}
    </div>
  );
};

export default CargoLaboral;
