import { Select, SelectItem } from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { selectClassNames } from "../../../../../assets/classNames";

const UbigeoEditarProveedor = ({
  register,
  errors,
  idDepartamento,
  setIdDepartamento,
  idProvincia,
  setIdProvincia,
  idDistrito,
  setIdDistrito,
  dataRuc,
  selectProveedor,
}) => {
  const [departamentos, setDepartamentos] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);

  // Fetch departamentos
  useEffect(() => {
    const url = `${import.meta.env.VITE_URL_API}/departamentos`;
    axios.get(url).then((res) => setDepartamentos(res.data.departamentos));
  }, []);

  useEffect(() => {
    if (idDepartamento) {
      const url = `${
        import.meta.env.VITE_URL_API
      }/provincias/${idDepartamento}`;
      axios.get(url).then((res) => {
        setProvincias(res.data.provincias);

        if (dataRuc?.provincia || selectProveedor.provinciaId) {
          const provincia = res.data.provincias.find(
            (p) =>
              p.provincia === dataRuc.provincia ||
              p.id === selectProveedor.provinciaId
          );
          if (provincia) {
            setIdProvincia(`${provincia.id}`);
          }
        }
      });
    }
  }, [idDepartamento]);

  // Fetch distritos when provincia changes
  useEffect(() => {
    if (idProvincia) {
      const url = `${import.meta.env.VITE_URL_API}/distritos/${idProvincia}`;
      axios.get(url).then((res) => {
        setDistritos(res.data.distritos);
        if (dataRuc?.distrito || selectProveedor.distritoId) {
          const distrito = res.data.distritos.find(
            (d) =>
              d.distrito === dataRuc.distrito ||
              d.id === selectProveedor.distritoId
          );
          if (distrito) {
            setIdDistrito(`${distrito.id}`);
          }
        }
      });
    }
  }, [idProvincia]);

  useEffect(() => {
    if (departamentos.length > 4) {
      const departamento = departamentos.find(
        (d) =>
          d.departamento === dataRuc.departamento ||
          d.id === selectProveedor.departamentoId
      );
      if (departamento) {
        setIdDepartamento(`${departamento.id}`);
      }
    }
  }, [dataRuc, selectProveedor, departamentos]);

  const handleDepartamento = (e) => setIdDepartamento(e.target.value);
  const handleProvincia = (e) => setIdProvincia(e.target.value);
  const handleDistritos = (e) => setIdDistrito(e.target.value);

  return (
    <div className="flex gap-4">
      <Select
        className="w-full"
        isRequired
        classNames={{
          ...selectClassNames,
          value: "text-[0.8rem]",
        }}
        labelPlacement="outside"
        label="Departamento"
        placeholder="..."
        variant="bordered"
        isInvalid={!!errors?.departamento}
        color={errors?.departamento ? "danger" : "primary"}
        errorMessage={errors?.departamento?.message}
        radius="sm"
        size="sm"
        selectedKeys={[idDepartamento]}
        onChange={handleDepartamento}
      >
        {departamentos.map((departamento) => (
          <SelectItem key={departamento.id} value={departamento.id}>
            {departamento.departamento}
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
        isInvalid={!!errors?.provincia}
        color={errors?.provincia ? "danger" : "primary"}
        errorMessage={errors?.provincia?.message}
        radius="sm"
        size="sm"
        selectedKeys={[idProvincia]}
        onChange={handleProvincia}
      >
        {provincias.map((provincia) => (
          <SelectItem key={provincia.id} value={provincia.id}>
            {provincia.provincia}
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
        isInvalid={!!errors?.distrito}
        color={errors?.distrito ? "danger" : "primary"}
        errorMessage={errors?.distrito?.message}
        radius="sm"
        size="sm"
        selectedKeys={[idDistrito]}
        onChange={handleDistritos}
      >
        {distritos.map((distrito) => (
          <SelectItem key={distrito.id} value={distrito.id}>
            {distrito.distrito}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default UbigeoEditarProveedor;
