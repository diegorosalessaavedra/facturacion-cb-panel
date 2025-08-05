import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
  RangeCalendar,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { today, getLocalTimeZone } from "@internationalized/date";
import config from "../../../../../../utils/getToken";
import Loading from "../../../../../../hooks/Loading";
import { inputClassNames } from "../../../../../../assets/classNames";

const ModalSolicitarVacaciones = ({
  isOpen,
  onOpenChange,
  selectPeriodo,
  selectColaborador,
  handleFindDescanzoMedicos,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [date, setDate] = React.useState({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ weeks: 1 }),
  });
  const [loading, setLoading] = useState(false);

  const submit = (data) => {
    setLoading(false);
    const url = `${import.meta.env.VITE_URL_API}/rrhh/vacaciones-solicitadas/${
      selectPeriodo.id
    }`;

    const formData = new FormData();
    formData.append("colaborador_id", selectColaborador.id);
    formData.append(
      "fecha_inicio",
      `${date.start.year}-${date.start.month}-${date.start.day}`
    );
    formData.append(
      "fecha_final",
      `${date.end.year}-${date.end.month}-${date.end.day}`
    );

    if (data?.solicitud_adjunto[0]) {
      formData.append("file", data?.solicitud_adjunto[0]);
    }

    axios
      .post(url, formData, config)
      .then(() => {
        handleFindDescanzoMedicos(), reset();
        onOpenChange(false);
        toast.success(`La solicitud de vacaciones se registro correctamente`);
      })
      .catch((err) => {
        console.log(err);

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
          Solicitar Vacaciones {selectPeriodo.periodo}{" "}
        </ModalHeader>
        <ModalBody>
          {loading && <Loading />}
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
                  label="Adjutar solicitud"
                  placeholder="..."
                  {...register("solicitud_adjunto")}
                  radius="sm"
                  errorMessage="Adjunte la solicitud de vacaciones"
                  size="sm"
                />
              </div>
              <div className=" flex flex-col gap-2 text-center  ">
                <h4 className="text-sm font-semibold text-blue-600">
                  Fecha de inico a fecha final
                </h4>
                <RangeCalendar
                  aria-label="Date (Visible Month)"
                  classNames={{
                    prevButton: "text-neutral-50",
                    nextButton: "text-neutral-50",
                    title: "text-neutral-50",
                    gridHeaderRow:
                      " bg-neutral-900 text-neutral-50 border-t-1 pt-2",
                    headerWrapper: "bg-neutral-900 text-neutral-50",
                  }}
                  visibleMonths={2}
                  value={date}
                  onChange={setDate}
                  minValue={today(getLocalTimeZone())}
                  color="danger"
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
      </ModalContent>
    </Modal>
  );
};

export default ModalSolicitarVacaciones;
