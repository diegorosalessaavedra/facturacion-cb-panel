import { Input, Textarea } from "@nextui-org/react";
import React, { useState } from "react";
import { TiPlus } from "react-icons/ti";
import { inputClassNames } from "../../../../../../assets/classNames";

const EditarCamposInformacionAdicional = ({ register, errors, cotizacion }) => {
  return (
    <div className="w-full flex flex-col gap-6  pt-4 border-t-1.5 ">
      <div className="flex gap-2 items-center text-blue-500 text-sm">
        <TiPlus />
        <h2>Información Adicional</h2>
      </div>
      <div className="w-full flex gap-4">
        <Input
          className="min-w-52 "
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Consignatario"
          placeholder="..."
          {...register("consignatario")}
          color="primary"
          id="consignatario"
          radius="sm"
          size="sm"
          defaultValue={cotizacion.consignatario}
        />
        <Input
          className="min-w-52 max-w-52"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="N° Documento"
          placeholder="..."
          {...register("consignatarioDni")}
          color="primary"
          id="consignatarioDni"
          minLength={8}
          maxLength={8}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
          }}
          radius="sm"
          size="sm"
          defaultValue={cotizacion.consignatarioDni}
        />
        <Input
          className="min-w-52 max-w-52"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Teléfono"
          placeholder="..."
          minLength={9}
          maxLength={9}
          {...register("consignatarioTelefono")}
          color="primary"
          id="consignatarioTelefono"
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
          }}
          radius="sm"
          size="sm"
          defaultValue={cotizacion.consignatarioTelefono}
        />
        <Input
          className="min-w-52 "
          classNames={inputClassNames}
          variant="bordered"
          label="Observación "
          labelPlacement="outside"
          placeholder="..."
          {...register("observacion")}
          id="observacion"
          radius="sm"
          size="sm"
          defaultValue={cotizacion.observacion}
          color="primary"
        />
      </div>
      <div className="w-full flex gap-4">
        <Input
          className="min-w-52 "
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Consignatario 2"
          placeholder="..."
          {...register("consignatario2")}
          color="primary"
          id="consignatario2"
          radius="sm"
          size="sm"
          defaultValue={cotizacion.consignatario2}
        />
        <Input
          className="min-w-52 max-w-52"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="N° Documento 2"
          placeholder="..."
          {...register("consignatarioDni2")}
          color="primary"
          id="consignatarioDni2"
          minLength={8}
          maxLength={8}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
          }}
          radius="sm"
          size="sm"
          defaultValue={cotizacion.consignatarioDni2}
        />
        <Input
          className="min-w-52 max-w-52"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Teléfono 2"
          placeholder="..."
          minLength={9}
          maxLength={9}
          {...register("consignatarioTelefono2")}
          color="primary"
          id="consignatarioTelefono 2"
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
          }}
          radius="sm"
          size="sm"
          defaultValue={cotizacion.consignatarioTelefono2}
        />
        <Input
          className="min-w-52 "
          classNames={inputClassNames}
          variant="bordered"
          label="Observación 2"
          labelPlacement="outside"
          placeholder="..."
          {...register("observacion2")}
          id="observacion2"
          radius="sm"
          size="sm"
          defaultValue={cotizacion.observacion2}
          color="primary"
        />
      </div>
    </div>
  );
};

export default EditarCamposInformacionAdicional;
