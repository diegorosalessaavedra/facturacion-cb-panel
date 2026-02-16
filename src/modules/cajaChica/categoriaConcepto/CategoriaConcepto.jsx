import { useEffect, useState } from "react";
import { API } from "../../../utils/api";
import axios from "axios";
import config from "../../../utils/getToken";
import { handleAxiosError } from "../../../utils/handleAxiosError";
import TablaConceptosRendicion from "./components/TablaConceptosRendicion";
import { useDisclosure } from "@nextui-org/react";
import CreateConceptoRendicion from "./components/crudConceptoRendicion/CreateConceptoRendicion";
import UpdateConceptoRendicion from "./components/crudConceptoRendicion/UpdateConceptoRendicion";
import DeleteConceptoRendicion from "./components/crudConceptoRendicion/DeleteConceptoRendicion";
import TablaCategoriaGasto from "./components/TablaCategoriaGasto";
import CreateCategoriaGasto from "./components/crudCategoriaGasto/CreateCategoriaGasto";
import UpdateCategoriaGasto from "./components/crudCategoriaGasto/UpdateCategoriaGasto";
import DeleteCategoriaGasto from "./components/crudCategoriaGasto/DeleteCategoriaGasto";
import LoadingSpinner from "../../../components/LoadingSpinner";

const CategoriaConcepto = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [selectModal, setSelectModal] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [selectCategoria, setSelectCategoria] = useState(null);
  const [conceptos, setConceptos] = useState([]);
  const [selectConcepto, setSelectConcepto] = useState(null);

  const handleFindCategoria = () => {
    setLoading(true);
    const url = `${API}/caja-chica/categoria-gasto`;

    axios
      .get(url, config)
      .then((res) => setCategorias(res.data.categoriaGastos))
      .catch((err) => {
        handleAxiosError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFindConcepto = () => {
    setLoading(true);
    const url = `${API}/caja-chica/conceptos-rendicion`;

    axios
      .get(url, config)
      .then((res) => setConceptos(res.data.conceptoRendiciones))
      .catch((err) => {
        handleAxiosError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleFindCategoria();
    handleFindConcepto();
  }, []);

  return (
    <main className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      {loading && <LoadingSpinner />}
      <div className="w-full h-full bg-white flex flex-col gap-2 p-4 rounded-md overflow-hidden">
        <div className="flex justify-between  gap-10 ">
          <TablaCategoriaGasto
            categorias={categorias}
            setSelectCategoria={setSelectCategoria}
            setSelectModal={setSelectModal}
            onOpen={onOpen}
          />
          <TablaConceptosRendicion
            conceptos={conceptos}
            setSelectConcepto={setSelectConcepto}
            setSelectModal={setSelectModal}
            onOpen={onOpen}
          />
        </div>
      </div>
      {selectModal === "create_concepto" && (
        <CreateConceptoRendicion
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindConcepto={handleFindConcepto}
        />
      )}
      {selectModal === "update_concepto" && selectConcepto && (
        <UpdateConceptoRendicion
          key={selectConcepto.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindConcepto={handleFindConcepto}
          selectConcepto={selectConcepto}
        />
      )}
      {selectModal === "delete_concepto" && selectConcepto && (
        <DeleteConceptoRendicion
          key={selectConcepto.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindConcepto={handleFindConcepto}
          selectConcepto={selectConcepto}
        />
      )}
      {selectModal === "create_categoria" && (
        <CreateCategoriaGasto
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindCategoria={handleFindCategoria}
        />
      )}
      {selectModal === "update_categoria" && selectCategoria && (
        <UpdateCategoriaGasto
          key={selectCategoria.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindCategoria={handleFindCategoria}
          selectCategoria={selectCategoria}
        />
      )}
      {selectModal === "delete_categoria" && selectCategoria && (
        <DeleteCategoriaGasto
          key={selectCategoria.id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          handleFindCategoria={handleFindCategoria}
          selectCategoria={selectCategoria}
        />
      )}
    </main>
  );
};

export default CategoriaConcepto;
