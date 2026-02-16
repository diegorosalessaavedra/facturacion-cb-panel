import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
  Textarea,
} from "@nextui-org/react";
import { inputClassNames } from "../../../../../assets/classNames";
import { API } from "../../../../../utils/api";
import axios from "axios";
import config from "../../../../../utils/getToken";
import { handleAxiosError } from "../../../../../utils/handleAxiosError";
import LoadingSpinner from "../../../../../components/LoadingSpinner";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";

const CreateCategoriaGasto = ({
  isOpen,
  onOpenChange,
  handleFindCategoria,
}) => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const submit = (data) => {
    setLoading(false);

    const url = `${API}/caja-chica/categoria-gasto`;
    axios
      .post(url, data, config)
      .then(() => {
        handleFindCategoria();
        reset();
        onOpenChange();
        toast.success("La categoria de gasto  se agrego correctamente");
      })
      .catch((err) => {
        handleAxiosError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      {loading && <LoadingSpinner />}
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-base">
          Agregar nueva Categoría de Gasto
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
                label="Categoría"
                placeholder="..."
                {...register("categoria")}
                color="primary"
                radius="sm"
                size="sm"
              />

              <Textarea
                isRequired
                className="w-full"
                classNames={inputClassNames}
                labelPlacement="outside"
                type="text"
                variant="bordered"
                label="Sugerencia para detalle"
                placeholder="..."
                {...register("sugerencia_detalle")}
                color="primary"
                radius="sm"
                size="sm"
              />

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

export default CreateCategoriaGasto;
