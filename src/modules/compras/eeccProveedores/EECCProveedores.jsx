import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { motion } from "framer-motion";
import { API } from "../../../utils/api";
import axios from "axios";
import config from "../../../utils/getToken";
import { handleAxiosError } from "../../../utils/handleAxiosError";
import {
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
} from "@nextui-org/react";
import TablaEECCProvedores from "./components/TablaEECCProvedores";
import { selectClassNames } from "../../../assets/classNames";

const EECCProveedores = () => {
  const [loading, setLoading] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [selectProveedor, setSelectProveedor] = useState(null);
  const [productos, setProductos] = useState([]);
  const [selectProducto, setSelectProducto] = useState(null);

  const findProveedores = useCallback(() => {
    setLoading(true); // Fundamental para mostrar el loader al aplicar filtros

    const url = `${API}/proveedores`;

    axios
      .get(url, config)
      .then((res) => setProveedores(res.data.proveedores))
      .catch((err) => handleAxiosError(err))
      .finally(() => setLoading(false));
  }, []);

  const handleFindProductos = useCallback(() => {
    const url = `${API}/productos/mis-productos?tipo_producto=Comercialización y servicios&status=Activo`;

    axios.get(url, config).then((res) => setProductos(res.data.misProductos));
  }, []);

  useEffect(() => {
    findProveedores();
    handleFindProductos();
  }, [findProveedores, handleFindProductos]);

  const onSelectionChange = (value) => {
    setSelectProveedor(value);
  };

  const onSelectionProdcutoChange = (e) => {
    setSelectProducto(e.target.value);
  };

  console.log({ productos });

  return (
    <main className="w-full h-[100vh] bg-slate-100 p-4 pt-[90px] overflow-hidden">
      {loading && <LoadingSpinner />}

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-[1800px] h-full mx-auto overflow-y-auto overflow-x-hidden bg-white p-4 rounded-xl flex flex-col gap-4 shadow-xl"
      >
        <header className="flex-none relative w-full min-h-[68px] bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg shadow-md overflow-hidden p-2 flex items-center justify-between">
          <div className="flex items-center gap-6 relative z-10">
            <div className="bg-white p-2 rounded-md shadow-md">
              <img
                className="w-12 h-12 object-contain"
                src="/logo.jpg"
                alt="logo"
              />
            </div>
            <div className="text-white">
              <h1 className="text-xl font-bold tracking-tight">
                EECC Provedores
              </h1>
            </div>
          </div>
        </header>

        <main className="flex-1 min-h-0 h-full flex flex-col gap-4">
          {/* Título */}
          <div className="flex-none px-2 pt-2 flex items-center gap-2">
            <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
            <h2 className="text-md font-semibold text-slate-700">
              EECC Proveedor
            </h2>
          </div>

          <section className="flex gap-4 max-w-3xl px-4">
            <Autocomplete
              aria-label="Seleccione un Proveedor"
              label="Seleccione un Proveedor"
              inputProps={{
                classNames: {
                  input: "text-xs  bg-white",
                  inputWrapper:
                    "min-h-10 border-1.5 bg-white border-neutral-400",
                  label: "text-[0.8rem] text-neutral-800 font-semibold",
                },
              }}
              labelPlacement="outside"
              variant="bordered"
              onSelectionChange={onSelectionChange}
              size="sm"
              maxListboxHeight={200}
            >
              {proveedores.map((item) => (
                <AutocompleteItem
                  key={item.id}
                  value={item.id}
                  textValue={`${item.nombreComercial || item.nombreApellidos} -  ${
                    item.numeroDoc
                  }`}
                >
                  <p className="text-[11px]">
                    {item.nombreComercial || item.nombreApellidos} -{" "}
                    {item.numeroDoc}
                  </p>
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <Select
              className="w-[100%] max-w-[300px]"
              label="Filtrar por producto: "
              labelPlacement="outside"
              variant="bordered"
              selectedKeys={[selectProducto]}
              radius="sm"
              size="sm"
              onChange={onSelectionProdcutoChange}
              classNames={selectClassNames}
            >
              <SelectItem key="TODOS" textValue="TODOS">
                TODOS
              </SelectItem>
              {productos.map((p) => (
                <SelectItem key={p.id} textValue={p.nombre}>
                  {p.nombre}
                </SelectItem>
              ))}
            </Select>
          </section>
          {selectProveedor && (
            <TablaEECCProvedores
              key={selectProveedor}
              selectProveedor={selectProveedor}
              selectProducto={selectProducto}
            />
          )}
        </main>
      </motion.div>
    </main>
  );
};

export default EECCProveedores;
