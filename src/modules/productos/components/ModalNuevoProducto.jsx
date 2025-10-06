import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
  Checkbox,
  Select,
  SelectItem,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";
import config from "../../../utils/getToken";
import { useForm } from "react-hook-form";
import { inputClassNames, selectClassNames } from "../../../assets/classNames";
import { onInputPrice } from "../../../assets/onInputs";
import { unidades } from "../../../jsons/unidades";

const ModalNuevoProducto = ({
  isOpen,
  onOpenChange,
  handleFindProductos,
  costos_gastos,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [isSelected, setIsSelected] = useState(true);

  const submit = (data) => {
    const url = `${import.meta.env.VITE_URL_API}/productos/mis-productos`;
    axios
      .post(
        url,
        {
          ...data,
          conStock: costos_gastos ? false : isSelected,
          tipo_producto: costos_gastos
            ? "Costos y gastos"
            : "Comercialización y servicios",
        },
        config
      )
      .then(() => {
        handleFindProductos();
        reset();
        onOpenChange(false);
        toast.success("El producto  se agrego correctamente");
      })
      .catch((err) => {
        toast.error("Hubo un error al agregar el producto ");
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
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(submit)}
            >
              <div className="w-full flex gap-4">
                <Input
                  isRequired
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
                  color="primary"
                  errorMessage="El  nombre del Producto es obligatorio."
                  radius="sm"
                  size="sm"
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
                  isRequired
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  label="Precio Unitario"
                  placeholder="..."
                  {...register("precioUnitario")}
                  color="primary"
                  errorMessage="El  precio unitario del Producto es obligatorio."
                  radius="sm"
                  size="sm"
                  id="precioUnitario"
                  onInput={onInputPrice}
                />

                {!costos_gastos && (
                  <Input
                    isRequired
                    className="w-full"
                    classNames={inputClassNames}
                    labelPlacement="outside"
                    type="text"
                    variant="bordered"
                    label="Código Sunat"
                    placeholder="..."
                    {...register("codigoSunat")}
                    color="primary"
                    errorMessage="El codigo sunat del Producto es obligatorio."
                    radius="sm"
                    size="sm"
                    id="codigoSunat"
                  />
                )}
                <Input
                  isRequired
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  label="Código interno"
                  placeholder="..."
                  {...register("codigoInterno")}
                  color="primary"
                  errorMessage="El codigo interno del Producto es obligatorio."
                  radius="sm"
                  size="sm"
                  id="codigoInterno"
                />
              </div>

              {!costos_gastos && (
                <div className="w-full flex gap-4">
                  <Select
                    isRequired
                    label="UNIDAD"
                    labelPlacement="outside"
                    {...register("codUnidad")}
                    color="primary"
                    errorMessage="La unidad es obligatorio."
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
                  <Input
                    isRequired
                    className="w-full"
                    classNames={inputClassNames}
                    labelPlacement="outside"
                    type="text"
                    variant="bordered"
                    label="Código Compra"
                    placeholder="..."
                    {...register("codigoCompra")}
                    color="primary"
                    errorMessage="El codigo de compra del Producto es obligatorio."
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
                    {...register("codigoVenta")}
                    color="primary"
                    errorMessage="El codigo de venta del Producto es obligatorio."
                    radius="sm"
                    size="sm"
                    id="codigoVenta"
                  />
                </div>
              )}

              <div className="w-full flex items-center justify-end gap-3 p-4">
                <Button
                  color="danger"
                  type="button"
                  onPress={() => {
                    reset();
                    onOpenChange(false);
                  }}
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

export default ModalNuevoProducto;
