import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import config from "../../../../utils/getToken";
import { inputClassNames } from "../../../../assets/classNames";
import { onInputNumber } from "../../../../assets/onInputs";

// Ícono de Papelera (Rojo)
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg>
);

// Ícono de Advertencia (Ámbar)
const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-14 h-14 text-amber-500 drop-shadow-sm"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const ModalVerSueldos = ({
  isOpen,
  onOpenChange,
  selectColaborador,
  handleFindColaboradores,
}) => {
  const { register, handleSubmit, reset } = useForm();

  // Controladores de estado principal
  const [loading, setLoading] = useState(false);

  // Controladores para el Modal de Eliminación
  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onOpenChange: onOpenChangeDelete,
  } = useDisclosure();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [sueldoToDelete, setSueldoToDelete] = useState(null);

  // --- FUNCIÓN PARA AGREGAR SUELDO ---
  const submit = (data) => {
    setLoading(true);
    const url = `${import.meta.env.VITE_URL_API}/rrhh/colaboradores/sueldo/${selectColaborador.id}`;

    axios
      .post(url, data, config)
      .then(() => {
        handleFindColaboradores();
        reset();
        toast.success(`El sueldo se registró correctamente`);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message ||
            "Hubo un error al registrar el sueldo",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // --- PREPARAR ELIMINACIÓN (Abre el modal) ---
  const handleOpenDelete = (sueldoInfo) => {
    setSueldoToDelete(sueldoInfo);
    onOpenDelete();
  };

  // --- FUNCIÓN QUE EJECUTA LA ELIMINACIÓN ---
  const executeDelete = () => {
    if (!sueldoToDelete) return;

    setLoadingDelete(true);
    const url = `${import.meta.env.VITE_URL_API}/rrhh/colaboradores/sueldo/${sueldoToDelete.id}`;

    axios
      .delete(url, config)
      .then(() => {
        handleFindColaboradores();
        toast.success(`El sueldo se eliminó correctamente`);
        onOpenChangeDelete(false); // Cierra el modal de confirmación
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message || "Hubo un error al eliminar el sueldo",
        );
      })
      .finally(() => {
        setLoadingDelete(false);
        setSueldoToDelete(null);
      });
  };

  // Función auxiliar para formatear la moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(value);
  };

  return (
    <>
      {/* MODAL PRINCIPAL: LISTA Y AGREGAR */}
      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          onOpenChange(open);
          if (!open) reset();
        }}
        backdrop="blur"
        size="lg"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 pb-2">
            <h2 className="text-xl font-bold text-slate-900">
              Gestión de Sueldos
            </h2>
            <span className="text-sm font-normal text-slate-600">
              Colaborador:{" "}
              <span className="font-medium text-slate-900">
                {selectColaborador?.nombre_colaborador}{" "}
                {selectColaborador?.apellidos_colaborador}
              </span>
            </span>
          </ModalHeader>

          <ModalBody className="pb-6">
            {/* --- FORMULARIO PARA AGREGAR SUELDO --- */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider">
                Registrar Nuevo Sueldo
              </h3>
              <form
                onSubmit={handleSubmit(submit)}
                className="flex w-full items-end gap-3"
              >
                <Input
                  isRequired
                  className="w-full"
                  classNames={inputClassNames}
                  labelPlacement="outside"
                  type="text"
                  step="0.01"
                  label="Monto (S/)"
                  variant="bordered"
                  placeholder="Ej. 1500.00"
                  {...register("sueldo")}
                  radius="sm"
                  onInput={onInputNumber}
                />
                <Button
                  type="submit"
                  isLoading={loading}
                  // Aplicando verde brillante para agregar
                  className="font-medium px-6 h-10 shadow-md bg-green-600 text-white hover:bg-green-700"
                  radius="sm"
                >
                  Agregar
                </Button>
              </form>
            </div>

            {/* --- TABLA PARA VER Y ELIMINAR SUELDOS --- */}
            <div className="mt-2">
              <h3 className="text-xs font-bold uppercase text-slate-500 mb-2 tracking-wider">
                Historial Registrado
              </h3>
              <Table
                aria-label="Tabla de sueldos"
                shadow="none"
                classNames={{
                  base: "min-w-full max-h-[40vh] overflow-y-auto border border-slate-200 rounded-xl",
                  wrapper: "p-0 rounded-xl shadow-none",
                  // Aplicando slate-900 en la cabecera de la tabla
                  th: "bg-slate-900 text-slate-50 font-semibold text-xs uppercase tracking-wider border-b border-slate-900",
                  td: "text-sm",
                }}
                isCompact
                removeWrapper
                isHeaderSticky
              >
                <TableHeader>
                  <TableColumn className="w-12 text-center">#</TableColumn>
                  <TableColumn>Sueldo Base</TableColumn>
                  <TableColumn className="text-center w-24">
                    Acciones
                  </TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No hay sueldos registrados."}>
                  {selectColaborador?.sueldos?.map((i, index) => (
                    <TableRow
                      key={i.id}
                      className="hover:bg-slate-100 transition-colors border-b border-slate-100 last:border-b-0"
                    >
                      <TableCell className="text-center text-slate-500 font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-800">
                        {formatCurrency(i.sueldo)}
                      </TableCell>
                      <TableCell className="flex justify-center py-2">
                        <Button
                          size="sm"
                          isIconOnly
                          radius="md"
                          onPress={() => handleOpenDelete(i)}
                          title="Eliminar sueldo"
                          // Aplicando rojo sutil para el icono de borrar dentro de la tabla
                          className="bg-transparent text-red-500 hover:bg-red-100 hover:text-red-700"
                        >
                          <TrashIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ModalBody>

          <ModalFooter className="border-t border-slate-200">
            <Button
              onPress={() => {
                onOpenChange(false);
                reset();
              }}
              radius="sm"
              color="primary"
              className="bg-amber-500 text-slate-900"
            >
              Cerrar Ventana
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* MODAL SECUNDARIO: CONFIRMACIÓN DE ELIMINACIÓN */}
      <Modal
        isOpen={isDeleteOpen}
        onOpenChange={onOpenChangeDelete}
        backdrop="opaque"
        size="sm"
        placement="center"
        classNames={{
          backdrop: "bg-slate-900/60 backdrop-blur-sm", // Fondo oscuro slate
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="py-8 flex flex-col items-center text-center">
                <WarningIcon />
                <h2 className="text-xl font-bold text-slate-900 mt-4">
                  ¿Eliminar Sueldo?
                </h2>
                <p className="text-sm text-slate-600 mt-2">
                  Estás a punto de eliminar el sueldo por un monto de{" "}
                  <span className="font-bold text-red-600">
                    {sueldoToDelete
                      ? formatCurrency(sueldoToDelete.sueldo)
                      : ""}
                  </span>
                  . Esta acción es permanente y no se puede deshacer.
                </p>
              </ModalBody>
              <ModalFooter className="flex justify-center w-full pb-6 pt-0 gap-3">
                <Button
                  variant="bordered"
                  radius="sm"
                  onPress={onClose}
                  className="font-medium w-full border-slate-300 text-slate-700 hover:bg-slate-100"
                  disabled={loadingDelete}
                >
                  Cancelar
                </Button>
                <Button
                  isLoading={loadingDelete}
                  onPress={executeDelete}
                  // Aplicando el rojo puro para la confirmación de borrar
                  className="font-medium w-full shadow-md bg-red-600 text-white hover:bg-red-700"
                  radius="sm"
                >
                  Sí, Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalVerSueldos;
