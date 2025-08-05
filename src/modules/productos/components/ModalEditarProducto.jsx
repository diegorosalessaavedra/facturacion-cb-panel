import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
  Select,
  SelectItem,
  Checkbox,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { inputClassNames, selectClassNames } from "../../../assets/classNames";
import { onInputPrice } from "../../../assets/onInputs";
import { unidades } from "../../../jsons/unidades";
import config from "../../../utils/getToken";

const ModalEditarProducto = ({
  isOpen,
  onOpenChange,
  handleFindProductos,
  selectProducto,
  costos_gastos,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [dataSelects, setDataSelects] = useState({
    codUnidad: "",
  });
  const [isSelected, setIsSelected] = useState(true);

  useEffect(() => {
    setDataSelects({
      codUnidad: selectProducto?.codUnidad,
      status: selectProducto?.status,
    });
    setIsSelected(selectProducto.conStock);
  }, [selectProducto]);

  const submit = (data) => {
    const url = `${import.meta.env.VITE_URL_API}/productos/mis-productos/${
      selectProducto?.id
    }`;
    axios
      .patch(
        url,
        {
          ...data,
          codUnidad: dataSelects.codUnidad,
          conStock: costos_gastos ? false : isSelected,
          status: dataSelects.status,
        },
        config
      )
      .then(() => {
        handleFindProductos(), reset();
        onOpenChange(false);
        toast.success("El producto  se edito correctamente");
      })
      .catch((err) => {
        toast.error("Hubo un error al editar el producto ");
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="3xl"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-base">
          Agregar nuevo Producto
        </ModalHeader>
        <ModalBody>
          <div className="w-full flex flex-col ">
            <form
              key={selectProducto.id}
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(submit)}
            >
              <div className="w-full flex gap-4">
                <Input
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  label="Nombre"
                  placeholder="..."
                  {...register("nombre", {
                    required: "El  nombre del Producto es obligatorio.",
                  })}
                  isInvalid={!!errors.nombre}
                  color={errors.nombre ? "danger" : "primary"}
                  errorMessage={errors.nombre?.message}
                  radius="sm"
                  size="sm"
                  defaultValue={selectProducto?.nombre}
                  id="nombreProducto"
                />
                {!costos_gastos && (
                  <Checkbox
                    className="min-w-[100px] flex flex-col-reverse"
                    isSelected={isSelected}
                    onValueChange={setIsSelected}
                  >
                    Con Stock
                  </Checkbox>
                )}
              </div>

              <div className="w-full flex gap-4">
                <Input
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  label="Precio Unitario"
                  placeholder="..."
                  {...register("precioUnitario", {
                    required:
                      "El  precio unitario del Producto es obligatorio.",
                  })}
                  isInvalid={!!errors.precioUnitario}
                  color={errors.precioUnitario ? "danger" : "primary"}
                  errorMessage={errors.precioUnitario?.message}
                  defaultValue={selectProducto?.precioUnitario}
                  radius="sm"
                  size="sm"
                  id="precioUnitario"
                  onInput={onInputPrice}
                />
                {!costos_gastos && (
                  <Input
                    className="w-full"
                    classNames={inputClassNames}
                    labelPlacement="outside"
                    type="text"
                    variant="bordered"
                    label="Código Sunat"
                    placeholder="..."
                    {...register("codigoSunat", {
                      required: "El codigo sunat del Producto es obligatorio.",
                    })}
                    isInvalid={!!errors.codigoSunat}
                    color={errors.codigoSunat ? "danger" : "primary"}
                    errorMessage={errors.codigoSunat?.message}
                    defaultValue={selectProducto?.codigoSunat}
                    radius="sm"
                    size="sm"
                    id="codigoSunat"
                  />
                )}

                <Input
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  label="Código interno"
                  placeholder="..."
                  {...register("codigoInterno", {
                    required: "El codigo interno del Producto es obligatorio.",
                  })}
                  isInvalid={!!errors.codigoInterno}
                  color={errors.codigoInterno ? "danger" : "primary"}
                  errorMessage={errors.codigoInterno?.message}
                  defaultValue={selectProducto?.codigoInterno}
                  radius="sm"
                  size="sm"
                  id="codigoInterno"
                />
              </div>
              <div className="w-full flex gap-4">
                {!costos_gastos && (
                  <Select
                    isRequired
                    label="UNIDAD"
                    labelPlacement="outside"
                    value={dataSelects.codUnidad}
                    defaultSelectedKeys={[selectProducto.codUnidad]}
                    onChange={(e) =>
                      setDataSelects({
                        ...dataSelects,
                        codUnidad: e.target.value,
                      })
                    }
                    variant="bordered"
                    radius="sm"
                    size="sm"
                    classNames={selectClassNames}
                  >
                    {unidades.map((unidad) => (
                      <SelectItem
                        key={unidad.codigo}
                        textValue={unidad.descripcion}
                      >
                        {unidad.descripcion}
                      </SelectItem>
                    ))}
                  </Select>
                )}

                <Input
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  label="Código Compra"
                  placeholder="..."
                  {...register("codigoCompra", {
                    required:
                      "El codigo de compra del Producto es obligatorio.",
                  })}
                  isInvalid={!!errors.codigoCompra}
                  color={errors.codigoCompra ? "danger" : "primary"}
                  errorMessage={errors.codigoCompra?.message}
                  defaultValue={selectProducto?.codigoCompra}
                  radius="sm"
                  size="sm"
                  id="codigoCompra"
                />
                <Input
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  label="Código Venta"
                  placeholder="..."
                  {...register("codigoVenta", {
                    required: "El codigo de venta del Producto es obligatorio.",
                  })}
                  isInvalid={!!errors.codigoVenta}
                  color={errors.codigoVenta ? "danger" : "primary"}
                  errorMessage={errors.codigoVenta?.message}
                  defaultValue={selectProducto?.codigoVenta}
                  radius="sm"
                  size="sm"
                  id="codigoVenta"
                />
              </div>
              <div className="w-1/2 flex gap-4">
                <Select
                  isRequired
                  label="Estado"
                  labelPlacement="outside"
                  value={dataSelects.status}
                  defaultSelectedKeys={[selectProducto.status]}
                  onChange={(e) =>
                    setDataSelects({
                      ...dataSelects,
                      status: e.target.value,
                    })
                  }
                  errorMessage="El estado del Producto es obligatorio."
                  variant="bordered"
                  radius="sm"
                  size="sm"
                  classNames={selectClassNames}
                >
                  <SelectItem key="Activo" textValue="Activo">
                    Activo
                  </SelectItem>
                  <SelectItem key="Inactivo" textValue="Inactivo">
                    Inactivo
                  </SelectItem>
                </Select>
              </div>
              <div className="w-full flex items-center justify-end gap-3 p-4">
                <Button
                  color="danger"
                  type="button"
                  onPress={onOpenChange}
                  onClick={() => reset()}
                >
                  Cancelar
                </Button>
                <Button color="primary" type="submit">
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default ModalEditarProducto;
