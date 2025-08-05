import React, { useEffect, useState } from "react";
import config from "../../../../../../utils/getToken";
import {
  Autocomplete,
  AutocompleteItem,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import axios from "axios";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../../../assets/classNames";
import { getTodayDate } from "../../../../../../assets/getTodayDate";
import { notasCreditos, notasDebitos } from "../../../../../../jsons/notas";

const CamposClienteNota = ({
  comprobanteElectronico,
  register,
  errors,
  dataSelects,
  setDataSelects,
}) => {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex   gap-4">
        <Select
          className="w-full "
          isRequired
          label="Tipo comprobante"
          labelPlacement="outside"
          isInvalid={!!errors.tipo_comprobante}
          color={errors.tipo_comprobante ? "danger" : "primary"}
          variant="bordered"
          defaultSelectedKeys={[dataSelects.tipo_comprobante]}
          radius="sm"
          size="sm"
          classNames={selectClassNames}
          value={dataSelects.tipo_comprobante}
          onChange={(e) =>
            setDataSelects({
              ...dataSelects,
              tipo_comprobante: e.target.value,
            })
          }
        >
          <SelectItem key="NOTA DE CREDITO">NOTA DE CREDITO</SelectItem>
          <SelectItem key="NOTA DE DEBITO">NOTA DE DEBITO</SelectItem>
        </Select>

        {dataSelects.tipo_comprobante === "NOTA DE CREDITO" ? (
          <Select
            className="w-full "
            isRequired
            label="Tipo nota de crédito "
            labelPlacement="outside"
            isInvalid={!!errors.motivo}
            color={errors.motivo ? "danger" : "primary"}
            variant="bordered"
            radius="sm"
            size="sm"
            classNames={selectClassNames}
            value={dataSelects.motivo}
            onChange={(e) =>
              setDataSelects({
                ...dataSelects,
                motivo: notasCreditos.find(
                  (notaCredito) => notaCredito.codigo === e.target.value
                ),
              })
            }
          >
            {notasCreditos.map((notaCredito) => (
              <SelectItem key={notaCredito.codigo}>
                {notaCredito.descripcion}
              </SelectItem>
            ))}
          </Select>
        ) : (
          <Select
            className="w-full "
            isRequired
            label="Tipo nota de débito "
            labelPlacement="outside"
            isInvalid={!!errors.motivo}
            color={errors.motivo ? "danger" : "primary"}
            variant="bordered"
            radius="sm"
            size="sm"
            classNames={selectClassNames}
            value={dataSelects.motivo}
            onChange={(e) =>
              setDataSelects({
                ...dataSelects,
                motivo: notasDebitos.find(
                  (notaDebito) => notaDebito.codigo === e.target.value
                ),
              })
            }
          >
            {notasDebitos.map((notaDebito) => (
              <SelectItem key={notaDebito.codigo}>
                {notaDebito.descripcion}
              </SelectItem>
            ))}
          </Select>
        )}
        <Input
          className="min-w-52 max-w-52"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Desscripción"
          {...register("descripcion", {
            required: "La descripcion  es obligatoria.",
          })}
          isInvalid={!!errors.descripcion}
          color={errors.descripcion ? "danger" : "primary"}
          errorMessage={errors.descripcion?.message}
          id="descripcion"
          radius="sm"
          size="sm"
        />
        <Input
          className="min-w-52 max-w-52"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="date"
          variant="bordered"
          label="Fec. Emisión"
          defaultValue={getTodayDate}
          {...register("fecha_emision", {
            required: "La fecha de emisión es obligatoria.",
          })}
          isInvalid={!!errors.fecha_emision}
          color={errors.fecha_emision ? "danger" : "primary"}
          errorMessage={errors.fecha_emision?.message}
          id="fecha_emision"
          radius="sm"
          size="sm"
        />
      </div>
      <div className="flex gap-4">
        <Input
          isDisabled
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Cliente"
          id="Cliente"
          radius="sm"
          size="sm"
          value={
            comprobanteElectronico?.cliente.nombreApellidos ||
            comprobanteElectronico?.cliente.nombreComercial
          }
        />
      </div>
      <div className="flex gap-4"></div>
    </div>
  );
};

export default CamposClienteNota;
