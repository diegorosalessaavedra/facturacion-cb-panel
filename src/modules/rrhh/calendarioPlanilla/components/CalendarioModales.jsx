import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Select,
  SelectItem,
  Switch, // <-- IMPORTANTE: Agregado Switch de NextUI
} from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form"; // <-- IMPORTANTE: Agregado Controller
import { inputClassNames } from "../../../../assets/classNames";
import { onInputNumber } from "../../../../assets/onInputs";

// ==========================================
// SUB-COMPONENTES DE FORMULARIOS (CRUD)
// ==========================================

const FormYear = ({ onSubmit, isSubmitting }) => {
  const { register, handleSubmit } = useForm();
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        isRequired
        label="Año"
        labelPlacement="outside"
        classNames={inputClassNames}
        placeholder="Ej. 2026"
        type="text"
        variant="bordered"
        radius="sm"
        {...register("year")}
        onInput={onInputNumber}
      />
      <Button
        type="submit"
        isLoading={isSubmitting}
        className="bg-slate-900 text-white font-medium"
        radius="sm"
      >
        Guardar Año
      </Button>
    </form>
  );
};

const FormMes = ({ onSubmit, isSubmitting }) => {
  const { register, handleSubmit } = useForm();
  const mesesArr = [
    { name: "Enero" },
    { name: "Febrero" },
    { name: "Marzo" },
    { name: "Abril" },
    { name: "Mayo" },
    { name: "Junio" },
    { name: "Julio" },
    { name: "Agosto" },
    { name: "Septiembre" },
    { name: "Octubre" },
    { name: "Noviembre" },
    { name: "Diciembre" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Select
        isRequired
        label="Mes"
        labelPlacement="outside"
        placeholder="Selecciona el mes"
        variant="bordered"
        radius="sm"
        {...register("mes")}
      >
        {mesesArr.map((m) => (
          <SelectItem key={m.name} textValue={m.name}>
            {m.name}
          </SelectItem>
        ))}
      </Select>
      <Button
        type="submit"
        isLoading={isSubmitting}
        className="bg-amber-500 text-slate-900 font-medium"
        radius="sm"
      >
        Guardar Mes
      </Button>
    </form>
  );
};

const FormSemana = ({ onSubmit, onCancel, isSubmitting }) => (
  <div className="p-4 text-center flex flex-col items-center">
    <div className="bg-green-100 p-4 rounded-full mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-8 h-8 text-green-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    </div>
    <h2 className="text-xl font-bold text-slate-900">Agregar Nueva Semana</h2>
    <p className="text-sm text-slate-500 mt-2">
      El número de semana se asignará automáticamente. ¿Estás seguro de agregar
      una nueva semana a este mes?
    </p>
    <div className="flex w-full gap-3 mt-6">
      <Button
        variant="bordered"
        className="w-full font-medium border-slate-300 text-slate-700"
        onPress={onCancel}
        radius="sm"
        isDisabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button
        className="w-full font-medium bg-green-600 text-white shadow-md hover:bg-green-700"
        onPress={() => onSubmit({})}
        radius="sm"
        isLoading={isSubmitting}
      >
        Sí, Agregar
      </Button>
    </div>
  </div>
);

// --- MODIFICADO: FormDia ahora incluye el Switch para el feriado ---
const FormDia = ({ onSubmit, isSubmitting }) => {
  const { register, handleSubmit, control } = useForm(); // <-- Importamos control

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 ">
      <Input
        isRequired
        label="Fecha (Día de la planilla)"
        labelPlacement="outside"
        type="date"
        variant="bordered"
        radius="sm"
        {...register("dia_plantilla")}
      />

      {/* Switch controlado por React Hook Form */}
      <Controller
        name="bonificacion_feriado"
        control={control}
        defaultValue={false}
        render={({ field: { onChange, value } }) => (
          <Switch
            isSelected={value}
            onValueChange={onChange}
            size="sm"
            classNames={{
              wrapper: "group-data-[selected=true]:bg-red-600",
            }}
          >
            <span className="text-sm font-medium text-slate-700">
              ¿Es Feriado? (Aplica bonificación)
            </span>
          </Switch>
        )}
      />

      <Button
        type="submit"
        isLoading={isSubmitting}
        className="bg-slate-900 text-white font-medium mt-2 shadow-md"
        radius="sm"
      >
        Guardar Día
      </Button>
    </form>
  );
};

const FormEliminar = ({ onSubmit, onCancel, isSubmitting, tipo }) => (
  <div className="p-4 text-center flex flex-col items-center">
    <div className="bg-red-100 p-4 rounded-full mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-8 h-8 text-red-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    </div>
    <h2 className="text-xl font-bold text-slate-900">Confirmar Eliminación</h2>
    <p className="text-sm text-slate-500 mt-2">
      Estás a punto de eliminar el registro de tipo{" "}
      <span className="font-bold text-slate-700 capitalize">{tipo}</span>. Esta
      acción es permanente.
    </p>
    <div className="flex w-full gap-3 mt-6">
      <Button
        variant="bordered"
        className="w-full font-medium border-slate-300 text-slate-700"
        onPress={onCancel}
        radius="sm"
        isDisabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button
        className="w-full font-medium bg-red-600 text-white shadow-md hover:bg-red-700"
        onPress={onSubmit}
        radius="sm"
        isLoading={isSubmitting}
      >
        Sí, Eliminar
      </Button>
    </div>
  </div>
);

// ==========================================
// COMPONENTE PRINCIPAL (MODAL CONTENEDOR)
// ==========================================

const CalendarioModales = ({
  selectModal,
  setSelectModal,
  modalContext,
  onSubmitData,
  isSubmitting,
}) => {
  const handleClose = () => {
    if (!isSubmitting) setSelectModal(null);
  };

  const handleFormSubmit = (data = {}) => {
    const payload = { ...data, ...modalContext };
    onSubmitData(selectModal, payload);
  };

  // Mapeo dinámico de componentes y títulos
  const renderContent = () => {
    switch (selectModal) {
      case "agregar_year":
        return {
          title: "Crear Nuevo Año",
          content: (
            <FormYear onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
          ),
        };
      case "agregar_mes":
        return {
          title: "Agregar Mes",
          content: (
            <FormMes onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
          ),
        };
      case "agregar_semana":
        return {
          title: null,
          content: (
            <FormSemana
              onSubmit={handleFormSubmit}
              onCancel={handleClose}
              isSubmitting={isSubmitting}
            />
          ),
        };
      case "agregar_dia":
        return {
          title: "Agregar Día",
          content: (
            <FormDia onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
          ),
        };
      case "eliminar_registro":
        return {
          title: null,
          content: (
            <FormEliminar
              onSubmit={() => handleFormSubmit()}
              onCancel={handleClose}
              isSubmitting={isSubmitting}
              tipo={modalContext?.tipo}
            />
          ),
        };
      default:
        return { title: "", content: null };
    }
  };

  const currentView = renderContent();
  const hideHeader =
    selectModal === "eliminar_registro" || selectModal === "agregar_semana";

  return (
    <Modal
      isOpen={!!selectModal}
      onOpenChange={handleClose}
      backdrop="blur"
      size="sm"
      isDismissable={!isSubmitting}
      hideCloseButton={hideHeader}
    >
      <ModalContent>
        {currentView.title && (
          <ModalHeader className="flex flex-col gap-1 text-slate-900 pb-2">
            {currentView.title}
          </ModalHeader>
        )}
        <ModalBody className={currentView.title ? "pb-6" : "p-0 pt-6"}>
          {currentView.content}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CalendarioModales;
