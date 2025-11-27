import { Button, Select, Input, SelectItem } from "@nextui-org/react";
import React, { useState } from "react";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../../assets/classNames";
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";

const DatosEditarProveedor = ({
  register,
  errors,
  numero,
  setNumero,
  dataRuc,
  setDataRuc,
  tipoDoc,
  setTipoDoc,
  setNombre,
  nombre,
  selectProveedor,
}) => {
  const [errorFind, seterrorFind] = useState();

  const handleTipoDoc = (e) => {
    setTipoDoc(e.target.value);
  };

  const handleNumero = (e) => {
    setNumero(e.target.value);
  };

  const findDni = () => {
    if (numero.length !== 8) {
      seterrorFind("El DNI debe tener 8 dígitos");
      return;
    }

    const url = `${import.meta.env.VITE_URL_API}/apiPeru/dni?dni=${numero}`;
    axios.get(url).then((res) => {
      {
        setDataRuc({
          nombre_o_razon_social: "",
          direccion: "",
        });
        setNombre(res.data.data.nombre_completo);
        seterrorFind("");
      }
    });
  };

  const findRuc = () => {
    if (numero?.length !== 11) {
      seterrorFind("El ruc debe tener 11 dígitos");
      return;
    }

    const url = `${import.meta.env.VITE_URL_API}/apiPeru/ruc?ruc=${numero}`;
    axios.get(url).then((res) => {
      {
        setDataRuc(res.data.data);
        seterrorFind("");
        setNombre();
      }
    });
  };

  const handleRuc = (e) => {
    setDataRuc((prev) => ({ ...prev, nombre_o_razon_social: e.target.value }));
  };

  return (
    <>
      <div className="flex gap-4">
        <Select
          className="w-full"
          isRequired
          classNames={selectClassNames}
          labelPlacement="outside"
          label="Tipo Doc. Identidad"
          placeholder="..."
          variant="bordered"
          {...register("tipoDocumento")}
          isInvalid={!!errors?.tipoDocumento}
          color={errors?.tipoDocumento ? "danger" : "primary"}
          errorMessage={errors?.tipoDocumento?.message}
          radius="sm"
          size="sm"
          onChange={handleTipoDoc}
          selectedKeys={[tipoDoc]}
        >
          {["Doc.trib.no.dom.sin.ruc", "DNI", "CE", "RUC", "Pasaporte"].map(
            (item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            )
          )}
        </Select>
        <div className="relative w-full flex items-end gap-1">
          <span className="absolute top-[0px] left-[70px] text-[10px] text-red-500">
            {errorFind}
          </span>

          <Input
            isRequired
            classNames={inputClassNames}
            labelPlacement="outside"
            type="text"
            variant="bordered"
            label="Número"
            placeholder="..."
            value={numero}
            {...register("numero")}
            isInvalid={!!errors?.numero}
            color={errors?.numero ? "danger" : "primary"}
            errorMessage={errors?.numero?.message}
            onInput={handleNumero}
            radius="sm"
            size="sm"
          />
          {(tipoDoc === "DNI" || tipoDoc === "RUC") && (
            <Button
              className="font-extralight text-xs"
              radius="sm"
              color="primary"
              startContent={<IoSearchOutline className="w-10 text-xl" />}
              type="button"
              onClick={() => (tipoDoc === "DNI" ? findDni() : findRuc())}
            >
              {tipoDoc === "DNI" ? "RENIEC" : "SUNAT"}
            </Button>
          )}
        </div>
      </div>
      <div className="w-full flex gap-4">
        {tipoDoc !== "RUC" && (
          <Input
            className="w-full"
            isRequired
            classNames={inputClassNames}
            labelPlacement="outside"
            type="text"
            variant="bordered"
            label="Nombre y apellidos"
            placeholder="..."
            {...register("nombre")}
            isInvalid={!!errors?.nombre}
            color={errors?.nombre ? "danger" : "primary"}
            errorMessage={errors?.nombre?.message}
            radius="sm"
            size="sm"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        )}
        {tipoDoc === "RUC" && (
          <Input
            className="w-full"
            isRequired
            classNames={inputClassNames}
            labelPlacement="outside"
            type="text"
            variant="bordered"
            label="Razon Social"
            placeholder="..."
            {...register("nombreComercial")}
            isInvalid={!!errors?.nombreComercial}
            color={errors?.nombreComercial ? "danger" : "primary"}
            errorMessage={errors?.nombreComercial?.message}
            radius="sm"
            size="sm"
            value={dataRuc?.nombre_o_razon_social}
            onChange={handleRuc}
          />
        )}
        <Input
          isRequired
          className="w-1/3"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Teléfono"
          placeholder="..."
          {...register("telefono")}
          color="primary"
          radius="sm"
          size="sm"
          maxLength={9}
          onInput={onInputNumber}
          defaultValue={selectProveedor.telefono}
        />
      </div>
    </>
  );
};

export default DatosEditarProveedor;
