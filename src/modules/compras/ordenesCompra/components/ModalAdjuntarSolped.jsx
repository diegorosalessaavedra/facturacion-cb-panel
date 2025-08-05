import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";
import config from "../../../../utils/getToken";
import { useForm } from "react-hook-form";
import { inputClassNames } from "../../../../assets/classNames";

const ModalAdjuntarSolped = ({
  isOpen,
  onOpenChange,
  handleFindOrdenCompras,
  selectOrdenCompra,
  setLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const submit = (data) => {
    setLoading(true);

    const url = `${
      import.meta.env.VITE_URL_API
    }/compras/orden-compra/adjuntar-solped/${selectOrdenCompra?.id}`;

    const formData = new FormData();
    if (data?.solped_adjunto[0]) {
      formData.append("file", data?.solped_adjunto[0]);
    }
    axios
      .patch(url, formData, config)
      .then((res) => {
        toast.success(`El solped se adjunto correctamente`);
        handleFindOrdenCompras();
        onOpenChange(false);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "hubo un error ");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Adjuntar Comprobante
            </ModalHeader>
            <ModalBody>
              <div className="w-full flex flex-col ">
                <form
                  className="flex flex-col gap-3"
                  onSubmit={handleSubmit(submit)}
                >
                  <div className="w-full flex flex-col gap-2">
                    <Input
                      isRequired
                      className="w-full"
                      classNames={inputClassNames}
                      labelPlacement="outside"
                      type="file"
                      variant="bordered"
                      label="Adjutar comprobante SOLPED"
                      placeholder="..."
                      {...register("solped_adjunto")}
                      radius="sm"
                      errorMessage="Adjunte el  comprobante SOLPED"
                      size="sm"
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
                      Guardar
                    </Button>
                  </div>
                </form>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalAdjuntarSolped;
