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
import {
  inputClassNames,
  selectClassNames,
} from "../../../../../assets/classNames";
import { API } from "../../../../../utils/api";
import axios from "axios";
import config from "../../../../../utils/getToken";
import { handleAxiosError } from "../../../../../utils/handleAxiosError";
import LoadingSpinner from "../../../../../components/LoadingSpinner";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { areasCentros } from "./CreateTrabajador";

const UpdateTrabajador = ({
  isOpen,
  onOpenChange,
  handleFindTrabajadores,
  selectTrabajador,
}) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: selectTrabajador,
  });
  const [loading, setLoading] = useState(false);

  const submit = (data) => {
    setLoading(false);

    const url = `${API}/caja-chica/trabajador/${selectTrabajador.id}`;
    axios
      .patch(url, data, config)
      .then(() => {
        toast.success("El trabajador se edito correctamente");
        handleFindTrabajadores();
        reset();
        onOpenChange();
      })
      .catch((err) => {
        handleAxiosError(err);
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
      size="lg"
    >
      {loading && <LoadingSpinner />}
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-base">
          Editar Trabajador
        </ModalHeader>
        <ModalBody>
          <div className="w-full flex flex-col ">
            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(submit)}
            >
              <Input
                isRequired
                className="w-full"
                classNames={inputClassNames}
                labelPlacement="outside"
                type="text"
                variant="bordered"
                label="Nombre del Trabajador"
                placeholder="..."
                {...register("nombre_trabajador")}
                radius="sm"
                size="sm"
              />
              <div className="flex gap-2">
                <Input
                  isRequired
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  label="Cod. del Trabajador"
                  placeholder="..."
                  {...register("codigo_trabajador")}
                  radius="sm"
                  size="sm"
                />
                <Input
                  isRequired
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  label="Dni"
                  placeholder="..."
                  {...register("dni_trabajador")}
                  radius="sm"
                  size="sm"
                />
                <Input
                  isRequired
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  label="Centro de Costo"
                  placeholder="..."
                  {...register("centro_costo")}
                  radius="sm"
                  size="sm"
                />
              </div>
              <Select
                isRequired
                classNames={selectClassNames}
                labelPlacement="outside"
                label="Ara de Centro Costos"
                {...register("area_centro_costo")}
                variant="bordered"
                radius="sm"
                size="sm"
                selectionMode="single"
              >
                {areasCentros.map((a) => (
                  <SelectItem key={a}>{a}</SelectItem>
                ))}
              </Select>
              <Select
                isRequired
                classNames={selectClassNames}
                labelPlacement="outside"
                label="Asignar Areas"
                {...register("area_centro_costo")}
                variant="bordered"
                radius="sm"
                size="sm"
                selectionMode="multiple"
                defaultSelectedKeys={selectTrabajador?.areas_asignadas || []}
              >
                <SelectItem key="RENDIDORES DE CAJA CHICA">
                  RENDIDORES DE CAJA CHICA
                </SelectItem>
                <SelectItem key="RESPONSABLE DE CAJA">
                  RESPONSABLE DE CAJA
                </SelectItem>{" "}
                <SelectItem key="SUPERVISORES DE CAJA CHICA">
                  SUPERVISORES DE CAJA CHICA
                </SelectItem>
              </Select>

              <div className="w-full flex items-center justify-end gap-3 ">
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

export default UpdateTrabajador;
