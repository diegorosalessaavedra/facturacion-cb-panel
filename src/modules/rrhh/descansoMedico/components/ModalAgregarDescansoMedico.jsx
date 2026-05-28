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
// IMPORTAMOS I18nProvider PARA EL IDIOMA
import { I18nProvider } from "@react-aria/i18n";

import config from "../../../../utils/getToken";
import { inputClassNames } from "../../../../assets/classNames";
import { today, getLocalTimeZone } from "@internationalized/date";
import Loading from "../../../../hooks/Loading";

const ModalAgregarDescansoMedico = ({
  isOpen,
  onOpenChange,
  handleFindDescansoMedicos,
  selectColaborador,
}) => {
  const { register, handleSubmit, reset } = useForm();
  const [date, setDate] = React.useState({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ weeks: 1 }),
  });
  const [loading, setLoading] = useState(false);

  const submit = (data) => {
    setLoading(true);
    const url = `${import.meta.env.VITE_URL_API}/rrhh/descanso-medico/${
      selectColaborador.id
    }`;
    const formData = new FormData();

    formData.append(
      "periodo_inicio",
      `${date.start.day}/${date.start.month}/${date.start.year}`,
    );
    formData.append(
      "periodo_final",
      `${date.end.day}/${date.end.month}/${date.end.year}`,
    );
    formData.append("titulo_descanso_medico", data.titulo_descanso_medico);
    if (data.archivo_descanso_medico && data.archivo_descanso_medico[0]) {
      formData.append("file", data.archivo_descanso_medico[0]);
    }

    axios
      .post(url, formData, config)
      .then(() => {
        handleFindDescansoMedicos();
        reset();
        onOpenChange(false);
        toast.success(`El descanso medico se registro correctamente`);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.error ||
            "Hubo un error al registrar el descanso medico ",
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
      size="xl"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-base">
          Agregar Descanso Médico para {selectColaborador.nombre_colaborador}
        </ModalHeader>
        <ModalBody>
          {loading && <Loading />}
          <div className="w-full flex flex-col">
            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(submit)}
            >
              <div className="m-auto">
                {/* ENVOLVEMOS EL CALENDARIO CON EL PROVIDER EN ESPAÑOL */}
                <I18nProvider locale="es-ES">
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
                    color="danger"
                  />
                </I18nProvider>
              </div>
              <div className="w-full flex flex-col gap-2">
                <Input
                  isRequired // <-- Cambiado de isrequired a isRequired
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  label="Diagnostico"
                  variant="bordered" // <-- Agregado para que tenga estilo coherente (cambiado de "Titulo")
                  placeholder="..."
                  {...register("titulo_descanso_medico")}
                  errorMessage="El título del diagnóstico es obligatorio."
                  radius="sm"
                  size="sm"
                />
                <Input
                  isRequired // <-- Cambiado de isrequired a isRequired
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="file"
                  variant="bordered"
                  label="Adjuntar descanso medico"
                  placeholder="..."
                  {...register("archivo_descanso_medico")}
                  errorMessage="El archivo del descanso medico es obligatorio."
                  radius="sm"
                  size="sm"
                />
              </div>
              <div className="w-full flex items-center justify-end gap-3 p-4">
                <Button
                  color="danger"
                  type="button"
                  onPress={() => {
                    onOpenChange(false);
                    reset();
                    // setArchivosComplementarios([]); // <-- Lo comenté porque no está declarado en este componente
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

export default ModalAgregarDescansoMedico;
