import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import Loading from "../../../../../hooks/Loading";
import config from "../../../../../utils/getToken";
import { inputClassNames } from "../../../../../assets/classNames";

const ModalUpdateAgencia = ({
  isOpen,
  onOpenChange,
  findAgencias,
  selectAgencia,
}) => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const submit = (data) => {
    setLoading(true);
    const url = `${import.meta.env.VITE_URL_API}/agencias/${selectAgencia.id}`;

    axios
      .patch(url, data, config)
      .then((res) => {
        toast.success("Los datos de la agencia se actualizo correctamente");
        onOpenChange(false);
        findAgencias();
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.error ||
            "Hubo un error al actualizar los datos de la agencia por favor verifique bine los datos"
        );
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
      size="md"
    >
      {loading && <Loading />}
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-base">
          Editar Agencia
        </ModalHeader>
        <ModalBody>
          <form className="flex flex-col gap-2" onSubmit={handleSubmit(submit)}>
            <Input
              isRequired
              className="w-full"
              classNames={inputClassNames}
              labelPlacement="outside"
              type="text"
              variant="bordered"
              label="Nombre"
              placeholder="..."
              {...register("nombre_agencia")}
              color="primary"
              radius="sm"
              size="sm"
              defaultValue={selectAgencia?.nombre_agencia}
            />
            <Input
              isRequired
              className="w-full"
              classNames={inputClassNames}
              labelPlacement="outside"
              type="text"
              variant="bordered"
              label="Dirección 1"
              placeholder="..."
              {...register("direccion_1")}
              color="primary"
              radius="sm"
              size="sm"
              defaultValue={selectAgencia?.direccion_1}
            />
            <Input
              className="w-full"
              classNames={inputClassNames}
              labelPlacement="outside"
              type="text"
              variant="bordered"
              label="Dirección 2"
              placeholder="..."
              {...register("direccion_2")}
              color="primary"
              radius="sm"
              size="sm"
              defaultValue={selectAgencia?.direccion_2}
            />
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalUpdateAgencia;
