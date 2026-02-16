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

const UpdateConceptoRendicion = ({
  isOpen,
  onOpenChange,
  handleFindConcepto,
  selectConcepto,
}) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: selectConcepto,
  });
  const [loading, setLoading] = useState(false);

  const submit = (data) => {
    setLoading(false);

    const url = `${API}/caja-chica/conceptos-rendicion/${selectConcepto.id}`;
    axios
      .patch(url, data, config)
      .then(() => {
        handleFindConcepto();
        reset();
        onOpenChange(false);
        toast.success("El conceptop de rendición  se edito correctamente");
      })
      .catch((err) => {
        handleAxiosError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" size="">
      {loading && <LoadingSpinner />}
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-base">
          Editar Concepto de Rendición
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
                label="Concepto"
                placeholder="..."
                {...register("conceptos")}
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
                label="Descripción"
                placeholder="..."
                {...register("descripcion")}
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

export default UpdateConceptoRendicion;
