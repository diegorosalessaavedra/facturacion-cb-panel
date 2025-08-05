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
import { useEffect, useState, useMemo } from "react";

const EditarDatosPesonalesColaborador = ({
  register,
  setfoto,
  setDepartamento,
  setProvincia,
  setDistrito,
  selectColaborador,
}) => {
  const [selectDepartamento, setSelectDepartamento] = useState();
  const [selectProvincia, setSelectProvincia] = useState();
  const [selectDistrito, setSelectDistrito] = useState();

  const handleDepartamento = (e) => setSelectDepartamento(e.target.value);
  const handleProvincia = (e) => setSelectProvincia(e.target.value);
  const handleDistritos = (e) => setSelectDistrito(e.target.value);

  // Obtención inicial de valores seleccionados
  useEffect(() => {
    const dep = departamentos.find(
      (d) => d.Departamento === selectColaborador.departamento_colaborador
    );
    const prov = provincias.find(
      (p) => p.Provincia === selectColaborador.provincia_colaborador
    );
    const dist = distritos.find(
      (d) => d.Distrito === selectColaborador.distrito_colaborador
    );

    if (dep) setSelectDepartamento(String(dep.id));
    if (prov) setSelectProvincia(String(prov.id));
    if (dist) setSelectDistrito(String(dist.id));

    setDepartamento(dep);
    setProvincia(prov);
    setDistrito(dist);
  }, [selectColaborador]);

  // Actualizar valores por selección
  useEffect(() => {
    const dep = departamentos.find((d) => d.id === Number(selectDepartamento));
    const prov = provincias.find((p) => p.id === Number(selectProvincia));
    const dist = distritos.find((d) => d.id === Number(selectDistrito));

    setDepartamento(dep);
    setProvincia(prov);
    setDistrito(dist);
  }, [selectDepartamento, selectProvincia, selectDistrito]);

  // Manejo de imagen
  const {
    selectedImage,
    selectedFileImg,
    handleImageChange,
    handleOnClickImg,
  } = ViewSelectImg({ idElementImg: "foto_colaborador" });

  useEffect(() => {
    setfoto(selectedFileImg);
  }, [selectedFileImg]);

  // Provincias y distritos filtrados
  const provinciasFiltradas = useMemo(
    () => provincias.filter((p) => p.UbigeoId === Number(selectDepartamento)),
    [selectDepartamento]
  );

  const distritosFiltrados = useMemo(
    () => distritos.filter((d) => d.UbigeoProvId === Number(selectProvincia)),
    [selectProvincia]
  );

  return (
    <div className="w-full flex flex-col gap-4 border-b-2 border-neutral-300 pb-4">
      {/* DATOS PERSONALES */}
      <section className="flex flex-col gap-2">
        <h3 className="font-semibold text-sm text-blue-800">
          Datos personales del colaborador:
        </h3>
        <div className="flex gap-4">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex gap-2">
              <Input
                {...register("nombre_colaborador")}
                defaultValue={selectColaborador.nombre_colaborador}
                label="Nombre"
                classNames={inputClassNames}
                variant="bordered"
                labelPlacement="outside"
                isRequired
                type="text"
                size="sm"
              />
              <Input
                {...register("apellidos_colaborador")}
                defaultValue={selectColaborador.apellidos_colaborador}
                label="Apellidos"
                classNames={inputClassNames}
                variant="bordered"
                labelPlacement="outside"
                isRequired
                type="text"
                size="sm"
              />
            </div>
            <div className="flex gap-2">
              <Input
                {...register("fecha_nacimiento_colaborador")}
                defaultValue={selectColaborador.fecha_nacimiento_colaborador}
                label="Fecha de nacimiento"
                classNames={inputClassNames}
                variant="bordered"
                labelPlacement="outside"
                isRequired
                type="date"
                size="sm"
              />
              <Input
                {...register("dni_colaborador")}
                defaultValue={selectColaborador.dni_colaborador}
                label="DNI"
                classNames={inputClassNames}
                variant="bordered"
                labelPlacement="outside"
                isRequired
                onInput={onInputNumber}
                maxLength={8}
                size="sm"
              />
              <Input
                {...register("telefono_colaborador")}
                defaultValue={selectColaborador.telefono_colaborador}
                label="Teléfono"
                classNames={inputClassNames}
                variant="bordered"
                labelPlacement="outside"
                isRequired
                onInput={onInputNumber}
                maxLength={9}
                size="sm"
              />
            </div>
          </div>

          {/* FOTO */}
          <div className="w-64 flex flex-col items-center gap-1">
            <h3 className="font-bold text-sm text-neutral-700">
              Foto del colaborador:
            </h3>
            <Input
              id="foto_colaborador"
              className="absolute -z-10 opacity-0"
              type="file"
              accept="image/*"
              {...register("foto_colaborador")}
              onChange={handleImageChange}
            />
            {!selectedImage ? (
              <img
                className="w-32 h-32 cursor-pointer rounded-md"
                src={`${import.meta.env.VITE_LARAVEL_URL}/api/colaboradores/${
                  selectColaborador?.foto_colaborador
                }`}
                onClick={handleOnClickImg}
              />
            ) : (
              <img
                className="w-32 h-32 cursor-pointer rounded-md"
                src={selectedImage}
                onClick={handleOnClickImg}
                alt="Preview"
              />
            )}
          </div>
        </div>

        {/* CORREO Y DIRECCION */}
        <div className="flex gap-2">
          <Input
            {...register("correo_colaborador")}
            defaultValue={selectColaborador.correo_colaborador}
            label="Correo electrónico"
            classNames={inputClassNames}
            variant="bordered"
            labelPlacement="outside"
            isRequired
            type="email"
            size="sm"
          />
          <Input
            {...register("direccion_colaborador")}
            defaultValue={selectColaborador.direccion_colaborador}
            label="Dirección de Domicilio"
            classNames={inputClassNames}
            variant="bordered"
            labelPlacement="outside"
            isRequired
            type="text"
            size="sm"
          />
        </div>
      </section>

      {/* UBIGEO */}
      <section className="flex flex-col gap-2">
        <h3 className="font-semibold text-sm text-blue-800">
          Lugar de nacimiento:
        </h3>
        <div className="flex gap-2">
          <Select
            label="Departamento"
            selectedKeys={[selectDepartamento]}
            onChange={handleDepartamento}
            classNames={selectClassNames}
            isRequired
            size="sm"
            labelPlacement="outside"
            variant="bordered"
          >
            {departamentos.map((d) => (
              <SelectItem key={d.id}>{d.Departamento}</SelectItem>
            ))}
          </Select>
          <Select
            label="Provincia"
            selectedKeys={[selectProvincia]}
            onChange={handleProvincia}
            classNames={selectClassNames}
            isRequired
            size="sm"
            labelPlacement="outside"
            variant="bordered"
          >
            {provinciasFiltradas.map((p) => (
              <SelectItem key={p.id}>{p.Provincia}</SelectItem>
            ))}
          </Select>
          <Select
            label="Distrito"
            selectedKeys={[selectDistrito]}
            onChange={handleDistritos}
            classNames={selectClassNames}
            isRequired
            size="sm"
            labelPlacement="outside"
            variant="bordered"
          >
            {distritosFiltrados.map((d) => (
              <SelectItem key={d.id}>{d.Distrito}</SelectItem>
            ))}
          </Select>
        </div>
      </section>

      {/* CONTACTO DE EMERGENCIA */}
      <section className="flex flex-col gap-2">
        <h3 className="font-semibold text-sm text-blue-800">
          Contacto de emergencia del colaborador:
        </h3>
        <div className="flex gap-2">
          <Input
            {...register("nombre_contacto_emergencia")}
            defaultValue={selectColaborador.nombre_contacto_emergencia}
            label="Nombre"
            classNames={inputClassNames}
            variant="bordered"
            labelPlacement="outside"
            isRequired
            size="sm"
          />
          <Input
            {...register("apellidos_contacto_emergencia")}
            defaultValue={selectColaborador.apellidos_contacto_emergencia}
            label="Apellidos"
            classNames={inputClassNames}
            variant="bordered"
            labelPlacement="outside"
            isRequired
            size="sm"
          />
          <Input
            {...register("telefono_contacto_emergencia")}
            defaultValue={selectColaborador.telefono_contacto_emergencia}
            label="Teléfono"
            classNames={inputClassNames}
            variant="bordered"
            labelPlacement="outside"
            isRequired
            onInput={onInputNumber}
            maxLength={9}
            size="sm"
          />
        </div>
        <Input
          {...register("vinculo_contacto_emergencia")}
          defaultValue={selectColaborador.vinculo_contacto_emergencia}
          label="Vínculo"
          classNames={inputClassNames}
          variant="bordered"
          labelPlacement="outside"
          isRequired
          size="sm"
        />
      </section>

      {/* SEGUNDO CONTACTO DE EMERGENCIA */}
      <section className="flex flex-col gap-2">
        <h3 className="font-semibold text-sm text-blue-800">
          Segundo contacto de emergencia del colaborador:
        </h3>
        <div className="flex gap-2">
          <Input
            {...register("nombre_contacto_emergencia2")}
            defaultValue={selectColaborador.nombre_contacto_emergencia2 || ""}
            label="Nombre"
            classNames={inputClassNames}
            variant="bordered"
            labelPlacement="outside"
            size="sm"
          />
          <Input
            {...register("apellidos_contacto_emergencia2")}
            defaultValue={
              selectColaborador.apellidos_contacto_emergencia2 || ""
            }
            label="Apellidos"
            classNames={inputClassNames}
            variant="bordered"
            labelPlacement="outside"
            size="sm"
          />
          <Input
            {...register("telefono_contacto_emergencia2")}
            defaultValue={selectColaborador.telefono_contacto_emergencia2 || ""}
            label="Teléfono"
            classNames={inputClassNames}
            variant="bordered"
            labelPlacement="outside"
            onInput={onInputNumber}
            maxLength={9}
            size="sm"
          />
        </div>
        <Input
          {...register("vinculo_contacto_emergencia2")}
          defaultValue={selectColaborador.vinculo_contacto_emergencia2 || ""}
          label="Vínculo"
          classNames={inputClassNames}
          variant="bordered"
          labelPlacement="outside"
          size="sm"
        />
      </section>
    </div>
  );
};

export default EditarDatosPesonalesColaborador;
