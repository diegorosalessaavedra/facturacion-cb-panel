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
import {
  inputClassNames,
  selectClassNames,
} from "../../../../../../assets/classNames";
import axios from "axios";
import config from "../../../../../../utils/getToken";

const CampoDatosProveedorOrdenCompra = ({
  setSelectModal,
  register,
  errors,
  ordenCompra,
  selectProveedor,
  setSelectProveedor,
  onOpen,
  proveedores,
  dataSelects,
  setDataSelects,
}) => {
  const [autorizados, setAutorizados] = useState([]);
  const [compradores, setCompradores] = useState([]);

  const findAprobados = () => {
    const url = `${
      import.meta.env.VITE_URL_API
    }/ajustes/encargado?cargo=Autorizado`;

    axios.get(url, config).then((res) => setAutorizados(res.data.encargados));
  };

  const findCompradores = () => {
    const url = `${
      import.meta.env.VITE_URL_API
    }/ajustes/encargado?cargo=Comprador`;

    axios.get(url, config).then((res) => setCompradores(res.data.encargados));
  };

  useEffect(() => {
    findAprobados();
    findCompradores();
  }, []);

  const onSelectionChange = (value) => {
    setSelectProveedor(value);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex gap-4">
        <div className="relative w-full">
          <Button
            className="absolute top-[-12px] right-0 scale-85"
            size="sm"
            color="primary"
            onClick={() => {
              onOpen();
              setSelectModal("proveedor");
            }}
          >
            <FaPlus />
            Proveedor
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
            label="Proveedor"
            placeholder="Ingrese el nombre o dni del Proveedor"
            variant="bordered"
            {...register("proveedor", {
              required: "El Proveedor es obligatorio.",
            })}
            isInvalid={!!errors.proveedor}
            color={errors.proveedor ? "danger" : "primary"}
            errorMessage={errors.proveedor?.message}
            id="proveedor"
            radius="sm"
            innerWrapper
            size="sm"
            value={selectProveedor}
            defaultSelectedKey={`${ordenCompra?.proveedorId}`}
            onSelectionChange={onSelectionChange}
          >
            {proveedores?.map((proveedor) => (
              <AutocompleteItem
                key={proveedor.id}
                value={proveedor.id}
                textValue={`${
                  proveedor.nombreApellidos || proveedor.nombreComercial
                } -  ${proveedor.numeroDoc}`}
              >
                <p className="text-xs">
                  {proveedor.nombreApellidos || proveedor.nombreComercial} -{" "}
                  {proveedor.numeroDoc}
                </p>
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>
        <Input
          className="min-w-44 max-w-44"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Serie y numero "
          placeholder="."
          {...register("serie", {
            required: "La fecha de emisión es obligatoria.",
          })}
          isInvalid={!!errors.serie}
          color={errors.serie ? "danger" : "primary"}
          errorMessage={errors.serie?.message}
          defaultValue={ordenCompra.serie}
          id="serie"
          radius="sm"
          size="sm"
        />
        <Input
          className="min-w-44 max-w-44"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="date"
          variant="bordered"
          label="Fec. Emisión"
          defaultValue={ordenCompra.fechaEmision}
          {...register("fechaEmision", {
            required: "La fecha de emisión es obligatoria.",
          })}
          isInvalid={!!errors.fechaEmision}
          color={errors.fechaEmision ? "danger" : "primary"}
          errorMessage={errors.fechaEmision?.message}
          id="fechaEmision"
          radius="sm"
          size="sm"
        />
        <Input
          className="min-w-44 max-w-44"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="date"
          variant="bordered"
          label="Fec. Vencimiento"
          defaultValue={ordenCompra.fechaVencimiento}
          {...register("fechaVencimiento", {
            required: "La fecha de vencimiento es obligatoria.",
          })}
          isInvalid={!!errors.fechaVencimiento}
          color={errors.fechaVencimiento ? "danger" : "primary"}
          errorMessage={errors.fechaVencimiento?.message}
          id="fechaVencimiento"
          radius="sm"
          size="sm"
        />
      </div>
      <div className="flex gap-4">
        <Select
          label="Tipo de Comprobante "
          placeholder="..."
          labelPlacement="outside"
          {...register("tipoComprobante", {
            required: "El tipo de tipo comprobante es obligatoria.",
          })}
          isInvalid={!!errors.tipoComprobante}
          color={errors.tipoComprobante ? "danger" : "primary"}
          errorMessage={errors.tipoCambio?.tipoComprobante}
          variant="bordered"
          defaultSelectedKeys={[ordenCompra.tipoComprobante]}
          radius="sm"
          size="sm"
          classNames={{
            trigger: ["min-h-10  border-1.5 border-neutral-400"],
            label: [" text-[0.8rem] text-neutral-800 font-semibold"],
          }}
        >
          <SelectItem key="FACTURA ELECTRÓNICA" textValue="FACTURA ELECTRÓNICA">
            FACTURA ELECTRÓNICA
          </SelectItem>
          <SelectItem key="BOLETA DE VENTA" textValue="BOLETA DE VENTA">
            BOLETA DE VENTA
          </SelectItem>
          <SelectItem key="NOTA DE CRÉDITO" textValue="NOTA DE CRÉDITO">
            NOTA DE CRÉDITO
          </SelectItem>
          <SelectItem key="NOTA DE ENTRADA" textValue="NOTA DE ENTRADA">
            NOTA DE ENTRADA
          </SelectItem>
          <SelectItem
            key="RECIBO POR HONORARIOS"
            textValue="RECIBO POR HONORARIOS"
          >
            RECIBO POR HONORARIOS
          </SelectItem>
        </Select>

        <Select
          className="min-w-60 max-w-60"
          label="Moneda"
          labelPlacement="outside"
          {...register("moneda", {
            required: "El tipo de moneda es obligatoria.",
          })}
          isInvalid={!!errors.moneda}
          color={errors.moneda ? "danger" : "primary"}
          errorMessage={errors.tipoCambio?.moneda}
          variant="bordered"
          value={dataSelects.moneda}
          defaultSelectedKeys={[ordenCompra.moneda]}
          onChange={(e) =>
            setDataSelects({
              ...dataSelects,
              moneda: e.target.value,
            })
          }
          radius="sm"
          classNames={selectClassNames}
        >
          <SelectItem key="Soles">Soles</SelectItem>
          <SelectItem key="Dólares Americanos">Dólares Americanos</SelectItem>
        </Select>
        <Input
          className="min-w-60 max-w-60"
          classNames={inputClassNames}
          defaultValue={ordenCompra?.tipoCambio}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Tipo de cambio"
          {...register("tipoCambio", {
            required: "El tipo de cambio es obligatorio.",
            pattern: {
              value: /^\d+(\.\d{1,3})?$/,
              message: "Solo se permiten números y puntos.",
            },
          })}
          isInvalid={!!errors.tipoCambio}
          color={errors.tipoCambio ? "danger" : ""}
          errorMessage={errors.tipoCambio?.message}
          id="tipoCambio"
          radius="sm"
          size="sm"
        />
      </div>
      <div className="w-full flex gap-4">
        <Input
          variant="bordered"
          label="Observación "
          labelPlacement="outside"
          placeholder="..."
          {...register("observacion")}
          classNames={inputClassNames}
          id="observacion"
          defaultValue={ordenCompra.observacion}
          radius="sm"
          size="sm"
          color="primary"
        />
        <Select
          className="min-w-60 max-w-60"
          isRequired
          labelPlacement="outside"
          label="Autorizado"
          {...register("autorizado")}
          variant="bordered"
          radius="sm"
          size="sm"
          classNames={selectClassNames}
          value={dataSelects.autorizado}
          defaultSelectedKeys={[ordenCompra.autorizado]}
          onChange={(e) =>
            setDataSelects({
              ...dataSelects,
              autorizado: e.target.value,
            })
          }
        >
          {autorizados.map((autorizado) => (
            <SelectItem
              key={autorizado.nombre}
              value={autorizado.nombre}
              textValue={autorizado.nombre}
            >
              {autorizado.nombre}
            </SelectItem>
          ))}
        </Select>
        <Select
          className="min-w-60 max-w-60"
          isRequired
          labelPlacement="outside"
          label="Comprador"
          {...register("comprador")}
          variant="bordered"
          radius="sm"
          size="sm"
          classNames={selectClassNames}
          value={dataSelects.comprador}
          defaultSelectedKeys={[ordenCompra.comprador]}
          onChange={(e) =>
            setDataSelects({
              ...dataSelects,
              comprador: e.target.value,
            })
          }
        >
          {compradores.map((comprador) => (
            <SelectItem
              key={comprador.nombre}
              value={comprador.nombre}
              textValue={comprador.nombre}
            >
              {comprador.nombre}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default CampoDatosProveedorOrdenCompra;
