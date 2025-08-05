import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { selectClassNames } from "../../../../assets/classNames";
import config from "../../../../utils/getToken";
import Loading from "../../../../hooks/Loading";

const ModalEstadoSolicitudVacaciones = ({
  isOpen,
  onOpenChange,
  selectSolicitudeVacaciones,
  handleFindSolicitudesVacaciones,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const submit = (data) => {
    setLoading(false);
    const url = `${import.meta.env.VITE_URL_API}/rrhh/vacaciones-solicitadas/${
      selectSolicitudeVacaciones.id
    }`;

    axios
      .patch(url, data, config)
      .then(() => {
        handleFindSolicitudesVacaciones(), reset();
        onOpenChange(false);
        toast.success(`La solicitud de vacaciones se edito correctamente`);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message ||
            "Hubo un error al registrar la solicitud de vacaciones"
        );
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
          Estado de la solicitud de las vacaciones{" "}
          {selectSolicitudeVacaciones?.colaborador?.nombre_colaborador}{" "}
          {selectSolicitudeVacaciones?.colaborador?.apellidos_colaborador}
        </ModalHeader>
        <ModalBody>
          {loading && <Loading />}
          <div className="w-full flex flex-col ">
            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(submit)}
            >
              <div className="w-full flex flex-col gap-2">
                <Select
                  isRequired
                  className="w-full"
                  label="Estado de autorizacion"
                  labelPlacement="outside"
                  {...register("pendiente_autorizacion")}
                  errorMessage={"El estado de la autorización es obligatorio"}
                  variant="bordered"
                  radius="sm"
                  classNames={selectClassNames}
                >
                  <SelectItem key="ACEPTADO" color="success">
                    ACEPTADO
                  </SelectItem>
                  <SelectItem key="RECHAZADO" color="danger">
                    RECHAZADO
                  </SelectItem>
                  <SelectItem key="ANULADO" color="danger">
                    ANULADO
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
                    setArchivosComplementarios([]); // Limpiar archivos complementarios al cancelar
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

export default ModalEstadoSolicitudVacaciones;
