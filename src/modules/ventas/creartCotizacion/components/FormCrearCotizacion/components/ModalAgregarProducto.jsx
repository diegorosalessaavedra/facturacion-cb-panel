import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../../../assets/classNames";
import axios from "axios";
import config from "../../../../../../utils/getToken";
import {
  onInputNumber,
  onInputPrice,
  onInputPriceCinco,
} from "../../../../../../assets/onInputs";
import { toast } from "sonner";

// Estado inicial del producto
const INITIAL_PRODUCT_STATE = {
  id: null,
  productoId: "",
  nombre: "",
  descripcion: "",
  cantidad: 1,
  precioUnitario: 0,
  total: 0,
  stock: 0,
  centroCostoId: null,
};

const ModalAgregarProducto = ({
  onOpenChange,
  isOpen,
  setProductos,
  tipo_productos,
  centroCostos,
}) => {
  const [selectProducto, setSelectProducto] = useState("");
  const [findProductos, setFindProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataProducto, setDataProducto] = useState(() => ({
    ...INITIAL_PRODUCT_STATE,
    id: Date.now(),
  }));

  // Memoizar si el tipo de producto es "Costos y gastos"
  const isCostosYGastos = useMemo(
    () => tipo_productos === "Costos y gastos",
    [tipo_productos]
  );

  // Obtener productos
  const handleFindProductos = useCallback(async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();

      if (tipo_productos) {
        queryParams.append("tipo_producto", tipo_productos);
      } else {
        toast.error("seleccione un tipo de productos ");
        onOpenChange(false);
      }

      queryParams.append("status", "Activo");

      const url = `${
        import.meta.env.VITE_URL_API
      }/productos/mis-productos?${queryParams.toString()}`;

      const response = await axios.get(url, config);
      setFindProductos(response.data.misProductos || []);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setFindProductos([]);
    } finally {
      setIsLoading(false);
    }
  }, [tipo_productos]);

  // Resetear formulario
  const resetForm = useCallback(() => {
    setDataProducto({
      ...INITIAL_PRODUCT_STATE,
      id: Date.now(),
    });
    setSelectProducto("");
  }, []);

  useEffect(() => {
    if (isOpen) {
      handleFindProductos();
      resetForm();
    }
  }, [isOpen, handleFindProductos, resetForm]);

  // Calcular total automáticamente
  const calculateTotal = useCallback((cantidad, precioUnitario) => {
    const cantidadNum = parseFloat(cantidad) || 0;
    const precioNum = parseFloat(precioUnitario) || 0;
    return parseFloat((cantidadNum * precioNum).toFixed(2));
  }, []);

  // Manejar cambios en los inputs
  const handleDataProductoChange = useCallback(
    (field) => (e) => {
      const value = e.target.value;

      setDataProducto((prevData) => {
        const updatedData = { ...prevData, [field]: value };

        // Recalcular total si cambia cantidad o precio unitario
        if (field === "cantidad" || field === "precioUnitario") {
          const cantidad = field === "cantidad" ? value : updatedData.cantidad;
          const precioUnitario =
            field === "precioUnitario" ? value : updatedData.precioUnitario;
          updatedData.total = calculateTotal(cantidad, precioUnitario);
        }

        return updatedData;
      });
    },
    [calculateTotal]
  );

  // Manejar selección de producto
  const onSelectionChange = useCallback(
    (value) => {
      setSelectProducto(value);

      const selectedProduct = findProductos.find(
        (product) => product.id.toString() === value
      );

      if (selectedProduct) {
        const total = calculateTotal(
          dataProducto.cantidad,
          selectedProduct.precioUnitario
        );

        setDataProducto((prevData) => ({
          ...prevData,
          stock: selectedProduct.stock || 0,
          nombre: selectedProduct.nombre || "",
          descripcion: selectedProduct.descripcion || "",
          productoId: selectedProduct.id,
          precioUnitario: selectedProduct.precioUnitario || 0,
          total,
        }));
      }
    },
    [findProductos, dataProducto.cantidad, calculateTotal]
  );

  // Agregar producto
  const pushProduct = useCallback(() => {
    if (!isFormValid) return;

    setProductos((prevProductos) => [...prevProductos, dataProducto]);
    resetForm();
  }, [dataProducto, setProductos, resetForm]);

  // Validar formulario
  const isFormValid = useMemo(() => {
    return (
      dataProducto.productoId !== "" &&
      dataProducto.cantidad > 0 &&
      dataProducto.precioUnitario > 0 &&
      (!isCostosYGastos || dataProducto.centroCostoId)
    );
  }, [dataProducto, isCostosYGastos]);

  // Producto seleccionado
  const selectedProduct = useMemo(
    () =>
      findProductos.find((product) => product.id.toString() === selectProducto),
    [findProductos, selectProducto]
  );

  // Determinar el tipo de input para cantidad
  const cantidadInputHandler = useMemo(() => {
    return selectedProduct?.codUnidad === "KGM" ? onInputPrice : onInputNumber;
  }, [selectedProduct?.codUnidad]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="2xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Agregar Producto
            </ModalHeader>

            <ModalBody>
              <div className="flex flex-col gap-4">
                {/* Selección de producto y cantidad */}
                <div className="flex gap-4">
                  <div className="w-full relative">
                    <Autocomplete
                      className="w-full"
                      inputProps={{
                        classNames: {
                          inputWrapper: "h-10 border-1.5 border-neutral-400",
                          label:
                            "pb-1 text-[0.8rem] text-neutral-800 font-semibold",
                        },
                      }}
                      labelPlacement="outside"
                      label="Producto"
                      placeholder="Buscar producto..."
                      variant="bordered"
                      color="primary"
                      radius="sm"
                      size="sm"
                      isLoading={isLoading}
                      onSelectionChange={onSelectionChange}
                      selectedKey={selectProducto}
                    >
                      {findProductos.map((producto) => (
                        <AutocompleteItem
                          key={producto.id}
                          value={producto.id.toString()}
                          textValue={producto.nombre}
                        >
                          {producto.nombre}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>

                    {selectedProduct && (
                      <p className="absolute top-0 right-0 text-xs text-red-500">
                        {selectedProduct.conStock ? "Con Stock" : "Sin stock"}
                      </p>
                    )}
                  </div>

                  <Input
                    className="min-w-52 max-w-52 h-10 border-neutral-400"
                    classNames={inputClassNames}
                    color="primary"
                    label="Cantidad"
                    labelPlacement="outside"
                    type="text"
                    variant="bordered"
                    radius="sm"
                    size="sm"
                    onInput={cantidadInputHandler}
                    value={dataProducto.cantidad}
                    onChange={handleDataProductoChange("cantidad")}
                  />
                </div>

                {/* Campos específicos para Costos y gastos */}
                {isCostosYGastos && (
                  <div className="w-full flex gap-4">
                    <Input
                      className="h-10 border-neutral-400"
                      classNames={inputClassNames}
                      color="primary"
                      label="Descripción"
                      labelPlacement="outside"
                      placeholder="Descripción del producto..."
                      type="text"
                      variant="bordered"
                      radius="sm"
                      size="sm"
                      value={dataProducto.descripcion}
                      onChange={handleDataProductoChange("descripcion")}
                    />

                    <Select
                      className="min-w-52 max-w-52 h-10"
                      isRequired
                      classNames={selectClassNames}
                      labelPlacement="outside"
                      label="Centro de costos"
                      variant="bordered"
                      errorMessage="El centro de costos es obligatorio."
                      radius="sm"
                      size="sm"
                      selectedKeys={
                        dataProducto.centroCostoId
                          ? [dataProducto.centroCostoId]
                          : []
                      }
                      onChange={(e) =>
                        setDataProducto((prevData) => ({
                          ...prevData,
                          centroCostoId: e.target.value,
                        }))
                      }
                    >
                      {centroCostos.map((centroCosto) => (
                        <SelectItem
                          key={centroCosto.id}
                          textValue={`${centroCosto.cod_sub_centro_costo}-${centroCosto.glosa_sub_centro_costo}`}
                        >
                          {centroCosto.cod_sub_centro_costo} -{" "}
                          {centroCosto.glosa_sub_centro_costo}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                )}

                {/* Stock, precio y total */}
                <div className="flex gap-4">
                  <Input
                    isDisabled
                    className="h-10 border-neutral-400"
                    classNames={inputClassNames}
                    color="primary"
                    label="Stock Disponible"
                    labelPlacement="outside"
                    type="text"
                    variant="bordered"
                    radius="sm"
                    size="sm"
                    value={dataProducto.stock?.toString() || "0"}
                    readOnly
                  />

                  <Input
                    className="h-10 border-neutral-400"
                    classNames={inputClassNames}
                    color="primary"
                    label="Precio Unitario"
                    labelPlacement="outside"
                    type="text"
                    variant="bordered"
                    radius="sm"
                    size="sm"
                    onInput={onInputPriceCinco}
                    value={dataProducto.precioUnitario}
                    onChange={handleDataProductoChange("precioUnitario")}
                  />

                  <Input
                    isDisabled
                    className="h-10 border-neutral-400"
                    classNames={inputClassNames}
                    color="primary"
                    label="Total"
                    labelPlacement="outside"
                    type="text"
                    variant="bordered"
                    radius="sm"
                    size="sm"
                    value={dataProducto.total?.toString() || "0"}
                    readOnly
                  />
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                Cancelar
              </Button>

              <Button
                color="primary"
                onPress={pushProduct}
                isDisabled={!isFormValid}
              >
                Guardar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalAgregarProducto;
