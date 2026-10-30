import React, { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { toast } from "sonner";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { FiTrash2 } from "react-icons/fi"; // <-- Importamos el icono de eliminar

import { handleAxiosError } from "../../../../../utils/handleAxiosError";
import { API } from "../../../../../utils/api";
import config from "../../../../../utils/getToken";
import { inputClassNames } from "../../../../../assets/classNames";
import { onInputNumber, onInputPrice } from "../../../../../assets/onInputs";

const NuevaSolicitudPrestamo = ({
  isOpen,
  onOpenChange,
  colaboradores = [],
  fetchPrestamos,
}) => {
  // <-- Agregamos setValue para actualizar el input al eliminar filas
  const { control, handleSubmit, watch, getValues, setValue } = useForm({
    defaultValues: {
      colaborador_id: "",
      tipo_prestamo: "PRESTAMOS",
      desembolso: "",
      fecha_solicitud: "",
      fecha_desembolso: "",
      fecha_cuota_inicial: "",
      numero_cuotas: "",
      importe_cuota: "",
    },
  });

  const [cronograma, setCronograma] = useState([]);
  const [loadingSave, setLoadingSave] = useState(false);

  const generarBorrador = () => {
    const values = getValues();
    const numCuotas = parseInt(values.numero_cuotas);
    const importe = parseFloat(values.importe_cuota);

    if (!numCuotas || !importe || !values.fecha_cuota_inicial) {
      toast.error("Faltan datos para generar el cronograma");
      return;
    }

    const fechaBase = new Date(values.fecha_cuota_inicial + "T00:00:00");

    const nuevoCronograma = Array.from({ length: numCuotas }).map((_, i) => {
      const fechaCuota = new Date(fechaBase);
      fechaCuota.setDate(fechaCuota.getDate() + i * 7);

      const year = fechaCuota.getFullYear();
      const month = String(fechaCuota.getMonth() + 1).padStart(2, "0");
      const day = String(fechaCuota.getDate()).padStart(2, "0");
      const fechaFormateada = `${year}-${month}-${day}`;

      return {
        numero_cuota: i + 1,
        importe_cuota: importe.toFixed(2),
        fecha_descuento: fechaFormateada,
      };
    });

    setCronograma(nuevoCronograma);
    toast.success(
      "Borrador de cronograma generado. Puedes editarlo antes de guardar.",
    );
  };

  const handleEditCuota = (index, campo, valor) => {
    const nuevosDatos = [...cronograma];
    nuevosDatos[index][campo] = valor;
    setCronograma(nuevosDatos);
  };

  // <-- NUEVA FUNCIÓN: Eliminar cuota y reordenar
  const handleEliminarCuota = (indexToRemove) => {
    const nuevosDatos = cronograma.filter(
      (_, index) => index !== indexToRemove,
    );

    // Reindexar los números de cuota
    const datosReindexados = nuevosDatos.map((cuota, i) => ({
      ...cuota,
      numero_cuota: i + 1,
    }));

    setCronograma(datosReindexados);

    // Actualizar el valor en el formulario
    setValue("numero_cuotas", String(datosReindexados.length));
  };

  const submit = async (data) => {
    if (cronograma.length === 0) {
      toast.error("Debe generar el cronograma antes de guardar");
      return;
    }

    setLoadingSave(true);

    const payload = {
      prestamo: {
        colaborador_id: data.colaborador_id,
        tipo_prestamo: data.tipo_prestamo,
        fecha_solicitud: data.fecha_solicitud,
        fecha_desembolso: data.fecha_desembolso,
        importe_cuota: data.importe_cuota,
      },
      cronograma: cronograma,
    };

    const url = `${API}/prestamos`;

    axios
      .post(url, payload, config)
      .then((res) => {
        toast.success("Descuento guardado correctamente");
        if (fetchPrestamos) fetchPrestamos(); // <-- Actualiza la tabla principal si se pasa la prop
        onOpenChange();
      })
      .catch((err) => {
        handleAxiosError(err);
      })
      .finally(() => {
        setLoadingSave(false);
      });
  };

  const totalCronograma = cronograma.reduce(
    (acc, cuota) => acc + Number(cuota.importe_cuota || 0),
    0,
  );

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="5xl"
      classNames={{
        base: "rounded-[24px] bg-slate-50",
        header: "p-6 pb-2",
        body: "p-6",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-xl font-bold text-slate-900">
              Nueva Solicitud de Descuento
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                {/* LADO IZQUIERDO: FORMULARIO */}
                <div className="flex flex-col gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-md font-semibold text-slate-900 mb-2">
                    Datos del Descuento
                  </h3>
                  <form
                    id="form-prestamo"
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit(submit)}
                  >
                    <Controller
                      name="colaborador_id"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          label="Trabajador"
                          inputProps={{
                            classNames: {
                              input: "text-xs",
                              inputWrapper:
                                "min-h-10 border-1.5 border-slate-300 hover:border-slate-400 focus-within:!border-green-600",
                              label:
                                "pb-1 text-[0.8rem] text-slate-900 font-semibold",
                            },
                          }}
                          placeholder="Seleccione o escriba..."
                          labelPlacement="outside"
                          variant="bordered"
                          radius="sm"
                          size="sm"
                          selectedKey={field.value ? String(field.value) : null}
                          onSelectionChange={(key) => field.onChange(key)}
                        >
                          {colaboradores.map((col) => (
                            <AutocompleteItem
                              key={col.id}
                              value={String(col.id)}
                              textValue={`${col.nombre_colaborador} ${col.apellidos_colaborador}`}
                            >
                              <p className="text-[11px] text-slate-700">
                                {col.nombre_colaborador}{" "}
                                {col.apellidos_colaborador}
                              </p>
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                      )}
                    />

                    <Controller
                      name="tipo_prestamo"
                      control={control}
                      render={({ field }) => (
                        <Select
                          label="Tipo de Descuento"
                          placeholder="Seleccione un tipo"
                          labelPlacement="outside"
                          variant="bordered"
                          radius="sm"
                          size="sm"
                          classNames={{
                            trigger:
                              "min-h-10 border-1.5 border-slate-300 hover:border-slate-400 focus-within:!border-green-600",
                            label:
                              "pb-1 text-[0.8rem] text-slate-900 font-semibold",
                          }}
                          selectedKeys={field.value ? [field.value] : []}
                          onSelectionChange={(keys) =>
                            field.onChange(Array.from(keys)[0])
                          }
                        >
                          <SelectItem key="PRESTAMOS" value="PRESTAMOS">
                            Préstamos
                          </SelectItem>
                          <SelectItem key="SINIESTROS" value="SINIESTROS">
                            Siniestros
                          </SelectItem>
                          <SelectItem key="OTROS" value="OTROS">
                            Otros
                          </SelectItem>
                        </Select>
                      )}
                    />

                    <Controller
                      name="desembolso"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Desembolso (S/)"
                          placeholder="0.00"
                          classNames={inputClassNames}
                          labelPlacement="outside"
                          type="text"
                          variant="bordered"
                          radius="sm"
                          size="sm"
                          onInput={onInputPrice}
                        />
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Controller
                        name="fecha_solicitud"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="date"
                            label="Fecha de Solicitud"
                            classNames={inputClassNames}
                            labelPlacement="outside"
                            variant="bordered"
                            radius="sm"
                            size="sm"
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                      <Controller
                        name="fecha_desembolso"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="date"
                            label="Fecha de Desembolso"
                            classNames={inputClassNames}
                            labelPlacement="outside"
                            variant="bordered"
                            radius="sm"
                            size="sm"
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </div>

                    <Divider className="my-2 bg-slate-100" />

                    <div className="grid grid-cols-2 gap-4">
                      <Controller
                        name="fecha_cuota_inicial"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="date"
                            label="Fecha Cuota Inicial"
                            classNames={inputClassNames}
                            labelPlacement="outside"
                            variant="bordered"
                            radius="sm"
                            size="sm"
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                      <Controller
                        name="numero_cuotas"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text"
                            label="Nº Cuotas"
                            placeholder="Ej: 20"
                            classNames={inputClassNames}
                            labelPlacement="outside"
                            variant="bordered"
                            radius="sm"
                            size="sm"
                            onInput={onInputNumber}
                          />
                        )}
                      />
                    </div>

                    <Controller
                      name="importe_cuota"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text"
                          label="Importe Cuota (S/)"
                          placeholder="100.00"
                          classNames={inputClassNames}
                          labelPlacement="outside"
                          variant="bordered"
                          radius="sm"
                          size="sm"
                          onInput={onInputPrice}
                        />
                      )}
                    />

                    <div className="flex gap-3 mt-4">
                      <Button
                        variant="flat"
                        onPress={onClose}
                        className="w-full text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium"
                      >
                        Cerrar
                      </Button>
                      <Button
                        onPress={generarBorrador}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold shadow-sm"
                      >
                        Generar Cronograma
                      </Button>
                    </div>
                  </form>
                </div>

                {/* LADO DERECHO: CRONOGRAMA EDITABLE */}
                <div className="flex flex-col gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-semibold text-slate-900">
                      Cronograma de Pagos
                    </h3>
                    <div className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-md border border-green-100">
                      Total: S/ {totalCronograma.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex-grow overflow-auto max-h-[400px] border border-slate-100 rounded-lg">
                    <Table
                      aria-label="Cronograma de pagos"
                      removeWrapper
                      size="sm"
                      classNames={{
                        th: "bg-slate-50 text-slate-900 font-bold text-[10px] uppercase",
                        td: "py-1.5",
                      }}
                      className="w-full"
                    >
                      <TableHeader>
                        <TableColumn>Nº</TableColumn>
                        <TableColumn>IMPORTE (S/)</TableColumn>
                        <TableColumn>FECHA</TableColumn>
                        <TableColumn align="center">ACCIONES</TableColumn>{" "}
                        {/* <-- Nueva columna */}
                      </TableHeader>
                      <TableBody
                        emptyContent={
                          <span className="text-slate-500 text-sm">
                            Aún no se ha generado un cronograma.
                          </span>
                        }
                      >
                        {cronograma.map((cuota, index) => (
                          <TableRow
                            key={index}
                            className="border-b border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors"
                          >
                            <TableCell className="font-semibold text-slate-600 text-center text-xs">
                              {cuota.numero_cuota}
                            </TableCell>
                            <TableCell>
                              <input
                                type="text"
                                className="w-[85px] bg-white border border-slate-200 hover:border-slate-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none rounded text-xs px-2 py-1 text-slate-800 transition-all"
                                value={cuota.importe_cuota}
                                onChange={(e) =>
                                  handleEditCuota(
                                    index,
                                    "importe_cuota",
                                    e.target.value,
                                  )
                                }
                                onInput={onInputPrice}
                                aria-label={`Importe cuota ${cuota.numero_cuota}`}
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                type="date"
                                className="w-[110px] bg-white border border-slate-200 hover:border-slate-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none rounded text-xs px-2 py-1 text-slate-800 transition-all cursor-pointer"
                                value={cuota.fecha_descuento}
                                onChange={(e) =>
                                  handleEditCuota(
                                    index,
                                    "fecha_descuento",
                                    e.target.value,
                                  )
                                }
                                aria-label={`Fecha cuota ${cuota.numero_cuota}`}
                              />
                            </TableCell>
                            {/* <-- Celda con el botón de eliminar */}
                            <TableCell>
                              <div className="flex justify-center">
                                <Button
                                  isIconOnly
                                  size="sm"
                                  className="bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 h-6 w-6 min-w-6"
                                  onPress={() => handleEliminarCuota(index)}
                                  aria-label="Eliminar cuota"
                                >
                                  <FiTrash2 size={12} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-end mt-4 pt-4 border-t border-slate-200">
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white font-bold w-full md:w-auto px-10 shadow-md"
                      isLoading={loadingSave}
                      form="form-prestamo"
                      type="submit"
                    >
                      GUARDAR TODO
                    </Button>
                  </div>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default NuevaSolicitudPrestamo;
