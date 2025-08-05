import { Input, Select, SelectItem } from "@nextui-org/react";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../../../assets/classNames";
import { onInputNumber } from "../../../../../../assets/onInputs";
import { departamentos } from "../../../../../../jsons/ubigeos/departamentos";
import { provincias } from "../../../../../../jsons/ubigeos/provincias";
import { distritos } from "../../../../../../jsons/ubigeos/distritos";
import ViewSelectImg from "../../../../../../hooks/PreviewImage";
import { MdAddPhotoAlternate } from "react-icons/md";
import { useEffect, useState } from "react";

const DatosPesonalesColaborador = ({
  register,
  setfoto,
  setDepartamento,
  setProvincia,
  setDistrito,
}) => {
  const [selectDepartamento, setSelectDepartamento] = useState();
  const [selectProvincia, setSelectProvincia] = useState();
  const [selectDistrito, setSelectDistrito] = useState();

  const handleDepartamento = (e) => setSelectDepartamento(e.target.value);
  const handleProvincia = (e) => setSelectProvincia(e.target.value);
  const handleDistritos = (e) => setSelectDistrito(e.target.value);

  useEffect(() => {
    const departamentoSeleccionado = departamentos.find(
      (departamento) => departamento.id === Number(selectDepartamento)
    );
    const provinciaSeleccionada = provincias.find(
      (provincia) => provincia.id === Number(selectProvincia)
    );
    const distritoSeleccionado = distritos.find(
      (distrito) => distrito.id === Number(selectDistrito)
    );

    setDepartamento(departamentoSeleccionado);
    setProvincia(provinciaSeleccionada);
    setDistrito(distritoSeleccionado);
  }, [selectDepartamento, selectProvincia, selectDistrito]);

  const {
    selectedImage,
    selectedFileImg,
    handleImageChange,
    handleOnClickImg,
    deleteSelectImgClick,
  } = ViewSelectImg({ idElementImg: "foto_colaborador" });

  useEffect(() => {
    setfoto(selectedFileImg);
  }, [selectedFileImg]);

  return (
    <div className="w-full flex flex-col gap-2 border-b-2 border-neutral-300 pb-4">
      <div className="w-full flex flex-col gap-2  pb-2">
        <h3 className="font-semibold text-sm text-blue-800">
          Datos personales del colaborador:
        </h3>
        <div className="w-full flex gap-4">
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex gap-2">
              <Input
                isRequired
                className="w-full"
                classNames={inputClassNames}
                labelPlacement="outside"
                type="text"
                variant="bordered"
                label="Nombre"
                placeholder="..."
                {...register("nombre_colaborador")}
                errorMessage="El  nombre  es obligatorio."
                radius="sm"
                size="sm"
              />
              <Input
                isRequired
                className="w-full"
                classNames={inputClassNames}
                labelPlacement="outside"
                type="text"
                variant="bordered"
                label="Apellidos"
                placeholder="..."
                {...register("apellidos_colaborador")}
                errorMessage="El  apellido  es obligatorio."
                radius="sm"
                size="sm"
              />
            </div>
            <div className="w-full flex gap-2">
              <Input
                isRequired
                classNames={inputClassNames}
                labelPlacement="outside"
                type="date"
                variant="bordered"
                label="Fecha de nacimiento"
                placeholder="..."
                {...register("fecha_nacimiento_colaborador")}
                errorMessage="La fecha de nacimiento  es obligatorio."
                radius="sm"
                size="sm"
              />

              <Input
                isRequired
                classNames={inputClassNames}
                labelPlacement="outside"
                type="text"
                variant="bordered"
                label="DNI"
                placeholder="..."
                {...register("dni_colaborador")}
                errorMessage="El  DNI  es obligatorio."
                radius="sm"
                size="sm"
                onInput={onInputNumber}
                maxLength={8}
              />
              <Input
                isRequired
                classNames={inputClassNames}
                labelPlacement="outside"
                type="text"
                variant="bordered"
                label="Telefono"
                placeholder="..."
                {...register("telefono_colaborador")}
                errorMessage="El  teléfono  es obligatorio."
                radius="sm"
                size="sm"
                onInput={onInputNumber}
                maxLength={9}
              />
            </div>
          </div>
          <div className="w-64 flex flex-col items-center gap-1">
            <h3 className="font-bold text-sm text-neutral-700">
              Foto del colaborador:
            </h3>
            <div className="custom-file-input">
              <Input
                className="absolute -z-10 opacity-0"
                id="foto_colaborador"
                type="file"
                accept="image/*"
                {...register("foto_colaborador")}
                onChange={handleImageChange}
                isRequired
                errorMessage={"La foto del colaborador es obligatorio."}
              />
              {!selectedImage && (
                <MdAddPhotoAlternate
                  className="text-8xl cursor-pointer"
                  onClick={handleOnClickImg}
                />
              )}
            </div>
            {selectedImage && (
              <img
                className="w-32 h-32 cursor-pointer rounded-md"
                src={selectedImage}
                onClick={handleOnClickImg}
                alt="Preview"
              />
            )}
          </div>
        </div>

        <div className="w-full flex gap-2">
          <Input
            isRequired
            className="w-full"
            classNames={inputClassNames}
            labelPlacement="outside"
            type="email"
            variant="bordered"
            label="Correo electronico"
            placeholder="..."
            {...register("correo_colaborador")}
            errorMessage="El  correo electronico  es obligatorio."
            radius="sm"
            size="sm"
          />
          <Input
            isRequired
            className="w-full"
            classNames={inputClassNames}
            labelPlacement="outside"
            type="text"
            variant="bordered"
            label="Dirección de Domicilio"
            placeholder="..."
            {...register("direccion_colaborador")}
            errorMessage="La dirección de domicilio es obligatorio."
            radius="sm"
            size="sm"
          />
        </div>
      </div>
      <div className="w-full flex flex-col gap-2  pb-2">
        <h3 className="font-semibold text-sm text-blue-800">
          Lugar de nacimiento:
        </h3>

        <div className="w-full flex gap-2">
          <Select
            className="w-full"
            isRequired
            classNames={{
              ...selectClassNames,
            }}
            labelPlacement="outside"
            variant="bordered"
            label="Departamento"
            placeholder="..."
            errorMessage="El departamento es obligatorio."
            radius="sm"
            size="sm"
            selectedKeys={[selectDepartamento]}
            onChange={handleDepartamento}
          >
            {departamentos.map((departamento) => (
              <SelectItem key={departamento.id} value={departamento.id}>
                {departamento?.Departamento}
              </SelectItem>
            ))}
          </Select>

          <Select
            className="w-full"
            isRequired
            classNames={{
              ...selectClassNames,
              value: "text-[0.8rem]",
            }}
            labelPlacement="outside"
            label="Provincia"
            placeholder="..."
            variant="bordered"
            errorMessage="La provincia es obligatoria."
            radius="sm"
            size="sm"
            selectedKeys={[selectProvincia]}
            onChange={handleProvincia}
          >
            {provincias
              .filter(
                (provincia) => provincia.UbigeoId === Number(selectDepartamento)
              )
              .map((provincia) => (
                <SelectItem key={provincia.id} value={provincia.id}>
                  {provincia.Provincia}
                </SelectItem>
              ))}
          </Select>
          <Select
            className="w-full"
            isRequired
            classNames={{
              ...selectClassNames,
              value: "text-[0.8rem]",
            }}
            labelPlacement="outside"
            label="Distrito"
            placeholder="..."
            variant="bordered"
            errorMessage="El distrito es obligatorio."
            radius="sm"
            size="sm"
            selectedKeys={[selectDistrito]}
            onChange={handleDistritos}
          >
            {distritos
              .filter(
                (distrito) => distrito.UbigeoProvId === Number(selectProvincia)
              )
              .map((distrito) => (
                <SelectItem key={distrito.id} value={distrito.id}>
                  {distrito.Distrito}
                </SelectItem>
              ))}
          </Select>
        </div>
      </div>

      <h3 className="font-semibold text-sm text-blue-800">
        Contacto de emergencia del colaborador:
      </h3>
      <div className="w-full flex gap-2">
        <Input
          isRequired
          className="w-full"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Nombre"
          placeholder="..."
          {...register("nombre_contacto_emergencia")}
          errorMessage="El  nombre  es obligatorio."
          radius="sm"
          size="sm"
        />
        <Input
          isRequired
          className="w-full"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Apellidos"
          placeholder="..."
          {...register("apellidos_contacto_emergencia")}
          errorMessage="El  apellido  es obligatorio."
          radius="sm"
          size="sm"
        />
        <Input
          isRequired
          className="min-w-52 max-w-52"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Telefono"
          placeholder="..."
          {...register("telefono_contacto_emergencia")}
          errorMessage="El  teléfono  es obligatorio."
          radius="sm"
          size="sm"
          onInput={onInputNumber}
          maxLength={9}
        />
      </div>
      <Input
        isRequired
        className="min-w-52 max-w-52"
        classNames={inputClassNames}
        labelPlacement="outside"
        type="text"
        variant="bordered"
        label="Vinculo"
        placeholder="..."
        {...register("vinculo_contacto_emergencia")}
        errorMessage="El  vínculo  es obligatorio."
        radius="sm"
        size="sm"
      />
      <h3 className="font-semibold text-sm text-blue-800">
        Segundo contacto de emergencia del colaborador:
      </h3>
      <div className="w-full flex gap-2">
        <Input
          className="w-full"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Nombre"
          placeholder="..."
          {...register("nombre_contacto_emergencia2")}
          radius="sm"
          size="sm"
        />
        <Input
          className="w-full"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Apellidos"
          placeholder="..."
          {...register("apellidos_contacto_emergencia2")}
          radius="sm"
          size="sm"
        />
        <Input
          className="min-w-52 max-w-52"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Telefono"
          placeholder="..."
          {...register("telefono_contacto_emergencia2")}
          radius="sm"
          size="sm"
          onInput={onInputNumber}
          maxLength={9}
        />
      </div>
      <Input
        className="min-w-52 max-w-52"
        classNames={inputClassNames}
        labelPlacement="outside"
        type="text"
        variant="bordered"
        label="Vinculo"
        placeholder="..."
        {...register("vinculo_contacto_emergencia2")}
        radius="sm"
        size="sm"
      />
    </div>
  );
};

export default DatosPesonalesColaborador;
