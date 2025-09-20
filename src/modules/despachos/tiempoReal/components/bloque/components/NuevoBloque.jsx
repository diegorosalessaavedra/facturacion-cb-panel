import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import React, { useState } from "react";
import config from "../../../../../../utils/getToken";
import Loading from "../../../../../../hooks/Loading";
import { useForm } from "react-hook-form";
import { inputClassNames } from "../../../../../../assets/classNames";
import { toast } from "sonner";

const NuevoBloque = ({ handleFindBloquesDespacho }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const submit = (data) => {
    setLoading(true);
    const url = `${import.meta.env.VITE_URL_API}/bloque-despacho`;

    axios
      .post(url, data, config)
      .then((res) => {
        handleFindBloquesDespacho();
        toast.success("El bloque se creo correctamente");
      })
      .finally(() => {
        setLoading(false);
        onOpenChange(false);
        reset();
      });
  };

  return (
    <>
      {loading && <Loading />}
      <Button color="primary" size="sm" onPress={onOpen}>
        NUEVO BLOQUE
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Agregar Bloque
              </ModalHeader>
              <ModalBody>
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
                      label="Nombre del bloque"
                      placeholder="..."
                      {...register("nombre_bloque")}
                      errorMessage="El nombre del bloque es obligatorio"
                      radius="sm"
                      size="sm"
                      id="cargo"
                    />
                  </div>

                  <div className="w-full flex items-center justify-end gap-3 p-4">
                    <Button
                      color="danger"
                      type="button"
                      onPress={() => {
                        onOpenChange();
                        reset();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button color="primary" type="submit">
                      Agregar
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default NuevoBloque;
