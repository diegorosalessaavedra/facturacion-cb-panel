import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../../../assets/classNames";
import config from "../../../../../../utils/getToken";
import { getTodayDate } from "../../../../../../assets/getTodayDate";

const CamposDatosCliente = ({
  setSelectModal,
  register,
  errors,
  clientes,
  findClients,
  selectCliente,
  setSelectCliente,
  onOpen,
}) => {
  const [vendedores, setVendedores] = useState([]);

  const findvendedores = () => {
    const url = `${
      import.meta.env.VITE_URL_API
    }/ajustes/encargado?cargo=Vendedor`;

    axios.get(url, config).then((res) => setVendedores(res.data.encargados));
  };

  useEffect(() => {
    findClients();
    findvendedores();
  }, []);

  const onSelectionChange = (value) => {
    setSelectCliente(value);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex gap-6">
        <div className="relative w-full">
          <Button
            className="absolute top-[-12px] right-0 scale-85"
            size="sm"
            color="primary"
            onClick={() => {
              onOpen();
              setSelectModal("cliente");
            }}
          >
            <FaPlus />
            Cliente
          </Button>
          <Autocomplete
            className="w-full "
            inputProps={{
              classNames: {
                input: "text-xs",
                inputWrapper: "min-h-10 border-1.5 border-neutral-400 ",
                label: "pb-1 text-[0.8rem] text-neutral-800 font-semibold",
              },
            }}
            labelPlacement="outside"
            label="Cliente"
            placeholder="Ingrese el nombre o dni del cliente"
            variant="bordered"
            {...register("cliente", {
              required: "El cliente es obligatorio.",
            })}
            isInvalid={!!errors?.cliente}
            color={errors?.cliente ? "danger" : "primary"}
            errorMessage={errors?.cliente?.message}
            id="cliente"
            radius="sm"
            innerWrapper
            size="sm"
            value={selectCliente}
            onSelectionChange={onSelectionChange}
          >
            {clientes.map((cliente) => (
              <AutocompleteItem
                key={cliente.id}
                value={cliente.id}
                textValue={`${
                  cliente.nombreApellidos || cliente.nombreComercial
                } -  ${cliente.numeroDoc}`}
              >
                <p className="text-xs">
                  {cliente.nombreApellidos || cliente.nombreComercial} -{" "}
                  {cliente.numeroDoc}
                </p>
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>

        <Select
          isRequired
          className="min-w-52 max-w-52"
          labelPlacement="outside"
          label="Tip. Envío"
          {...register("tipoEnvio")}
          variant="bordered"
          radius="sm"
          classNames={selectClassNames}
          defaultSelectedKeys={["Aéreo"]}
        >
          <SelectItem key="Aéreo">Aéreo</SelectItem>
          <SelectItem key="Terrestre">Terrestre</SelectItem>{" "}
          <SelectItem key="Almacen">Almacen</SelectItem>
        </Select>

        <Input
          className="min-w-52 max-w-52"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="date"
          variant="bordered"
          label="Fec. Emisión"
          {...register("fecEmision", {
            required: "La fecha de emisión es obligatoria.",
          })}
          isInvalid={!!errors?.fecEmision}
          color={errors?.fecEmision ? "danger" : "primary"}
          errorMessage={errors?.fecEmision?.message}
          id="fecEmision"
          radius="sm"
          size="sm"
          defaultValue={getTodayDate}
        />
        <Input
          className="min-w-52 max-w-52"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="date"
          variant="bordered"
          label="Fec. Entrega"
          {...register("fecEntrega", {
            required: "La fecha de Entrega es obligatoria.",
          })}
          isInvalid={!!errors?.fecEntrega}
          color={errors?.fecEntrega ? "danger" : "primary"}
          errorMessage={errors?.fecEntrega?.message}
          id="fecEntrega"
          radius="sm"
          size="sm"
          defaultValue={getTodayDate}
        />
      </div>
      <div className="flex gap-6">
        <Input
          className="w-full"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Dirección de envío"
          placeholder="..."
          {...register("direccionEnvio", {
            required: "La direeción de envío es obligatoria.",
          })}
          isInvalid={!!errors?.direccionEnvio}
          color={errors?.direccionEnvio ? "danger" : "primary"}
          errorMessage={errors?.direccionEnvio?.message}
          id="direccionEnvio"
          radius="sm"
          size="sm"
        />
        <Select
          className="min-w-60 max-w-[300px]"
          label="Tipo de Cotización "
          placeholder="..."
          labelPlacement="outside"
          {...register("tipoCotizacion", {
            required: "El tipo de tipo de cotizacion  es obligatoria.",
          })}
          isInvalid={!!errors.tipoCotizacion}
          color={errors.tipoCotizacion ? "danger" : "primary"}
          variant="bordered"
          defaultSelectedKeys={["Mercadería"]}
          radius="sm"
          classNames={{
            trigger: ["min-10  border-1.5 border-neutral-400"],
            label: [" text-[0.8rem] text-neutral-800 font-semibold"],
          }}
        >
          <SelectItem key="Mercadería" textValue="Mercadería">
            Mercadería
          </SelectItem>
          <SelectItem key="Servicios" textValue="Servicios">
            Servicios
          </SelectItem>
          <SelectItem key="Alquileres" textValue="Alquileres">
            Alquileres
          </SelectItem>
          <SelectItem key="Suministros" textValue="Suministros">
            Suministros
          </SelectItem>
          <SelectItem key="Otros" textValue="Otros">
            Otros
          </SelectItem>
        </Select>

        <Select
          isRequired
          className="min-w-60 max-w-[300px]"
          labelPlacement="outside"
          label="Vendedor"
          {...register("vendedor")}
          variant="bordered"
          radius="sm"
          classNames={selectClassNames}
        >
          {vendedores.map((vendedor) => (
            <SelectItem
              key={vendedor.nombre}
              value={vendedor.nombre}
              textValue={vendedor.nombre}
            >
              {vendedor.nombre}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default CamposDatosCliente;
