import { useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
} from "@nextui-org/react";
import { FiCalendar, FiEdit, FiSave } from "react-icons/fi";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import config from "../../../../../utils/getToken";
import { inputClassNames } from "../../../../../assets/classNames";
import { handleAxiosError } from "../../../../../utils/handleAxiosError";
import { onInputNumber, onInputPrice } from "../../../../../assets/onInputs";

const ModalEditarUit = ({ isOpen, onOpenChange, handleFindUit, selectUit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  useEffect(() => {
    if (selectUit && isOpen) {
      reset({
        year: selectUit.year ?? "",
        monto: selectUit.monto ?? "",
      });
    }
  }, [selectUit, isOpen, reset]);

  const handleClose = (open) => {
    if (!open) reset();
    onOpenChange(open);
  };

  const submit = async (data) => {
    const url = `${import.meta.env.VITE_URL_API}/rrhh/uit/${selectUit?.id}`;
    try {
      // Cambia a axios.put si tu backend usa PUT en lugar de PATCH
      await axios.patch(url, data, config);
      handleFindUit();
      reset();
      onOpenChange(false);
      toast.success("La UIT se actualizó correctamente");
    } catch (err) {
      handleAxiosError(err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      backdrop="blur"
      size="md"
      radius="lg"
      classNames={{
        base: "border border-slate-200/80 shadow-xl",
        header: "border-b border-slate-100 bg-slate-50/50 py-4 px-5",
        body: "py-5 px-5",
        footer: "border-t border-slate-100 bg-slate-50/50 py-3 px-5",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(submit)} noValidate>
            <ModalHeader className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                <FiEdit size={18} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-slate-800 leading-tight">
                  Editar UIT {selectUit?.year ? `(${selectUit.year})` : ""}
                </h3>
                <p className="text-xs font-normal text-slate-400">
                  Modifica el año fiscal o el valor vigente en soles.
                </p>
              </div>
            </ModalHeader>

            <ModalBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  isRequired
                  label="Año"
                  labelPlacement="outside"
                  placeholder="Ej. 2026"
                  type="text"
                  variant="bordered"
                  radius="md"
                  size="md"
                  classNames={inputClassNames}
                  startContent={
                    <FiCalendar className="text-slate-400 shrink-0" size={16} />
                  }
                  onInput={onInputNumber}
                  isInvalid={!!errors.year}
                  errorMessage={errors.year?.message}
                  {...register("year", {
                    required: "Ingresa el año",
                    min: { value: 2000, message: "Año no válido" },
                    max: { value: 2100, message: "Año no válido" },
                  })}
                />

                <Input
                  isRequired
                  label="Monto UIT"
                  labelPlacement="outside"
                  placeholder="Ej. 5350.00"
                  type="text"
                  variant="bordered"
                  radius="md"
                  size="md"
                  onInput={onInputPrice}
                  classNames={inputClassNames}
                  startContent={
                    <span className="text-slate-400 text-xs font-semibold">
                      S/
                    </span>
                  }
                  isInvalid={!!errors.monto}
                  errorMessage={errors.monto?.message}
                  {...register("monto", {
                    required: "Ingresa el monto",
                  })}
                />
              </div>
            </ModalBody>

            <ModalFooter className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="light"
                radius="md"
                className="text-slate-600 font-medium hover:bg-slate-200/60"
                isDisabled={isSubmitting}
                onPress={() => {
                  reset();
                  onClose();
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                radius="md"
                isLoading={isSubmitting}
                startContent={!isSubmitting && <FiSave size={15} />}
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold shadow-sm"
              >
                Actualizar UIT
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalEditarUit;
