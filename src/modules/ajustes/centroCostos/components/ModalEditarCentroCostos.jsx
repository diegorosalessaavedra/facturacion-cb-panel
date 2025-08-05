import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../assets/classNames";
import axios from "axios";
import config from "../../../../utils/getToken";
import { toast } from "sonner";
import Loading from "../../../../hooks/Loading";

const ModalEditarCentroCostos = ({
  isOpen,
  onOpenChange,
  handleFindCentroCostos,
  selectedCentroCosto,
}) => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const submit = (data) => {
    setLoading(true);

    const url = `${import.meta.env.VITE_URL_API}/ajustes/centro-costos/${
      selectedCentroCosto.id
    }`;
    axios
      .patch(url, data, config)
      .then((res) => {
        handleFindCentroCostos(), reset();
        onOpenChange(false);
        toast.success("El centro de costos se edito correctamente");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Hubo un error al editar el centro de costos");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="xl"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-base">
          Editar Centro de Costo
        </ModalHeader>
        <ModalBody>
          {loading && <Loading />}

          <div className="w-full flex flex-col gap-4">
            <form
              className="flex flex-col gap-2"
              onSubmit={handleSubmit(submit)}
            >
              <div>
                <Select
                  className="w-full "
                  isRequired
                  classNames={{
                    ...selectClassNames,
                  }}
                  labelPlacement="outside"
                  label="Centro de costos"
                  variant="bordered"
                  {...register("glosa_centro_costos")}
                  errorMessage="El centro de costos es obligatorio."
                  description="Ingrese el nombre del centro de costos"
                  radius="sm"
                  size="sm"
                  defaultSelectedKeys={[
                    selectedCentroCosto.glosa_centro_costos,
                  ]}
                >
                  <SelectItem
                    key="COMAS (OPERACIONES)"
                    value="COMAS (OPERACIONES)"
                  >
                    COMAS (OPERACIONES)
                  </SelectItem>
                  <SelectItem
                    key="COMAS (ADMINISTRATIVOS)"
                    value="COMAS (ADMINISTRATIVOS)"
                  >
                    COMAS (ADMINISTRATIVOS)
                  </SelectItem>
                  <SelectItem key="COMAS (VENTAS)" value="COMAS (VENTAS)">
                    COMAS (VENTAS)
                  </SelectItem>
                </Select>
              </div>
              <div className="w-full flex gap-4">
                <Input
                  isRequired
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  label="Sub centro de costos"
                  placeholder="..."
                  {...register("cod_sub_centro_costo")}
                  color="primary"
                  errorMessage="El sub centro de costos es obligatorio."
                  description="Ingrese el código del sub centro de costos"
                  defaultValue={selectedCentroCosto.cod_sub_centro_costo}
                  radius="sm"
                  size="sm"
                  id="nombre"
                />
                <Input
                  isRequired
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  label="Glosa sub centro de costos"
                  placeholder="..."
                  {...register("glosa_sub_centro_costo")}
                  color="primary"
                  errorMessage="La glosa del sub centro de costos es obligatorio."
                  description="Ingrese la glosa del sub centro de costos"
                  defaultValue={selectedCentroCosto.glosa_sub_centro_costo}
                  radius="sm"
                  size="sm"
                  id="nombre"
                />
              </div>

              <div className="w-full flex items-center justify-end gap-3 p-4">
                <Button
                  color="danger"
                  type="button"
                  onPress={() => {
                    onOpenChange(false);
                    reset();
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

export default ModalEditarCentroCostos;
