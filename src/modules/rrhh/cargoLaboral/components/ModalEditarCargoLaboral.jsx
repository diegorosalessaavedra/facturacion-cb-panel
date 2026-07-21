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
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../assets/classNames";
import config from "../../../../utils/getToken";

const ModalEditarCargoLaboral = ({
  isOpen,
  onOpenChange,
  handleFindCargoLaboral,
  selectCargoLaboral,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const submit = (data) => {
    const url = `${import.meta.env.VITE_URL_API}/rrhh/cargo-laboral/${
      selectCargoLaboral.id
    }`;

    axios
      .patch(url, data, config)
      .then(() => {
        (handleFindCargoLaboral(), reset());
        onOpenChange(false);
        toast.success(`El cargo laboral se edito correctamente`);
      })
      .catch((err) => {
        toast.error("Hubo un error en editar el cargo laboral ");
      });
  };
  console.log(selectCargoLaboral);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="2xl"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-base">
          Editar cargo laboral
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
                  label="Cargo"
                  placeholder="..."
                  {...register("cargo", {
                    required: "El  cargo  es obligatorio.",
                  })}
                  isInvalid={!!errors.cargo}
                  color={errors.cargo ? "danger" : "primary"}
                  errorMessage={errors.cargo?.message}
                  defaultValue={selectCargoLaboral.cargo}
                  radius="sm"
                  size="sm"
                />
                <Select
                  className="w-full"
                  isRequired
                  classNames={{
                    ...selectClassNames,
                    value: "text-[0.8rem]",
                  }}
                  labelPlacement="outside"
                  label="Agrupación"
                  placeholder="..."
                  variant="bordered"
                  errorMessage="La agrupación es obligatorio."
                  radius="sm"
                  size="sm"
                  {...register("agrupacion_cargo")}
                  defaultSelectedKeys={[selectCargoLaboral.agrupacion_cargo]}
                >
                  <SelectItem key="OPERATIVOS" value="OPERATIVOS">
                    OPERATIVOS
                  </SelectItem>
                  <SelectItem key="ADMINISTRATIVOS" value="ADMINISTRATIVOS">
                    ADMINISTRATIVOS
                  </SelectItem>
                </Select>
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
      </ModalContent>
    </Modal>
  );
};

export default ModalEditarCargoLaboral;
