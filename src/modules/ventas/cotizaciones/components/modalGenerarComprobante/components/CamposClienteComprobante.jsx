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
import { codigosBienes } from "../../../../../../jsons/codigosBienes";
import { mediosDePago } from "../../../../../../jsons/mediosPago";
import { onInputPrice } from "../../../../../../assets/onInputs";

const CamposClienteComprobante = ({
  selectCotizacion,
  register,
  errors,
  setSelectCliente,
  selectCliente,
  dataSelects,
  setDataSelects,
  setTipoOperacion,
  tipoOperacion,
  monto,
  setMonto,
  porcentaje,
  setPorcentaje,
}) => {
  const [clientes, setClientes] = useState([]);
  const [vendedores, setVendedores] = useState([]);

  useEffect(() => {
    const url = `${
      import.meta.env.VITE_URL_API
    }/ajustes/encargado?cargo=Vendedor`;

    axios.get(url, config).then((res) => setVendedores(res.data.encargados));
  }, []);

  useEffect(() => {
    const url = `${import.meta.env.VITE_URL_API}/clientes`;

    axios.get(url, config).then((res) => setClientes(res.data.clientes));
  }, []);

  const onSelectionChange = (value) => {
    setSelectCliente(value);
  };

  useEffect(() => {
    const total = selectCotizacion.productos.reduce(
      (acc, producto) => acc + Number(producto.total),
      0
    );
    // Calcular el monto basado en el porcentaje
    setMonto((total * porcentaje) / 100);
  }, [selectCotizacion]);

  const handleOnchagePorcentaje = (e) => {
    const value = e.target.value;
    setPorcentaje(value);
    const total = selectCotizacion.productos.reduce(
      (acc, producto) => acc + Number(producto.total),
      0
    );
    // Calcular el monto cuando cambia el porcentaje
    setMonto((total * value) / 100);
  };

  const handleOnchageMonto = (e) => {
    const value = e.target.value;
    const total = selectCotizacion.productos.reduce(
      (acc, producto) => acc + Number(producto.total),
      0
    );
    setMonto(value);
    setPorcentaje((value * 100) / total);
  };

  const cliente = clientes.find((cliente) => cliente.id === selectCliente);

  return (
    <div className="w-full flex flex-col gap-3">
      <Autocomplete
        isRequired
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
        {...register("cliente")}
        id="cliente"
        radius="sm"
        size="sm"
        innerWrapper
        selectedKey={selectCliente}
        onSelectionChange={onSelectionChange}
      >
        {clientes.map((cliente) => (
          <AutocompleteItem
            key={cliente.id}
            value={cliente.id}
            textValue={`${
              cliente.nombreApellidos || cliente.nombreComercial
            }  - ${cliente.numeroDoc}`}
          >
            <p className="text-xs">
              {cliente.nombreApellidos || cliente.nombreComercial} -{" "}
              {cliente.numeroDoc}
            </p>
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <div className="flex gap-4">
        <Select
          label="Tipo comprobante"
          labelPlacement="outside"
          {...register("tipoComprobante", {
            required: "El  tipo de comprobante es obligatorio.",
          })}
          isInvalid={!!errors.tipoComprobante}
          color={errors.tipoComprobante ? "danger" : "primary"}
          errorMessage={errors.tipoComprobante?.message}
          variant="bordered"
          radius="sm"
          size="sm"
          classNames={selectClassNames}
        >
          <SelectItem key="FACTURA ELECTRÓNICA">FACTURA ELECTRÓNICA</SelectItem>
          <SelectItem key="BOLETA DE VENTA">BOLETA DE VENTA</SelectItem>
          <SelectItem key="NOTA DE VENTA">NOTA DE VENTA</SelectItem>
        </Select>
        <Select
          isRequired
          label="Tipo Operación"
          labelPlacement="outside"
          variant="bordered"
          {...register("tipoOperacion", {
            required: "El  tipo de operacion es obligatorio.",
          })}
          isInvalid={!!errors.tipoOperacion}
          color={errors.tipoOperacion ? "danger" : "primary"}
          errorMessage={errors.tipoOperacion?.message}
          defaultSelectedKeys={["VENTA INTERNA"]}
          value={[tipoOperacion]}
          radius="sm"
          size="sm"
          onChange={(e) => setTipoOperacion(e.target.value)}
          classNames={selectClassNames}
        >
          <SelectItem key="VENTA INTERNA" textValue="VENTA INTERNA">
            VENTA INTERNA
          </SelectItem>
          <SelectItem
            key="OPERACIÓN SUJETA A DETRACCIÓN"
            textValue="OPERACIÓN SUJETA A DETRACCIÓN"
          >
            OPERACIÓN SUJETA A DETRACCIÓN
          </SelectItem>
        </Select>
        <Select
          isRequired
          label="Tipo de factura"
          labelPlacement="outside"
          {...register("tipo_factura")}
          errorMessage="El  tipo de factura es obligatorio."
          variant="bordered"
          radius="sm"
          size="sm"
          defaultSelectedKeys={["VENTA"]}
          classNames={selectClassNames}
        >
          <SelectItem key="VENTA">VENTA</SelectItem>

          <SelectItem key="GRATUITA">GRATUITA</SelectItem>
        </Select>
      </div>
      {tipoOperacion === "OPERACIÓN SUJETA A DETRACCIÓN" && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Select
              isRequired
              label="Bienes y servicios sujetos a detracciones"
              labelPlacement="outside"
              {...register("codBienDetraccion", {
                required: "Este campo es obligatorio.",
              })}
              isInvalid={!!errors.codBienDetraccion}
              color={errors.codBienDetraccion ? "danger" : "primary"}
              errorMessage={errors.codBienDetraccion?.message}
              variant="bordered"
              radius="sm"
              size="sm"
              classNames={selectClassNames}
            >
              {codigosBienes.map((codigo) => (
                <SelectItem key={codigo.codigo} textValue={codigo.descripcion}>
                  {codigo.codigo} - {codigo.descripcion}
                </SelectItem>
              ))}
            </Select>
            <Select
              className="max-w-[50%]"
              isRequired
              label="Método pago - Detracción"
              labelPlacement="outside"
              {...register("codMedioPago", {
                required: "Este campo es obligatorio.",
              })}
              isInvalid={!!errors.codMedioPago}
              color={errors.codMedioPago ? "danger" : "primary"}
              errorMessage={errors.codMedioPago?.message}
              variant="bordered"
              defaultSelectedKeys={[mediosDePago[0].codigo]}
              radius="sm"
              size="sm"
              classNames={selectClassNames}
            >
              {mediosDePago.map((metodoPago) => (
                <SelectItem
                  key={metodoPago.codigo}
                  textValue={metodoPago.descripcion}
                >
                  <p className="text-xs">{metodoPago.descripcion}</p>{" "}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex gap-2">
            <Input
              isRequired
              classNames={inputClassNames}
              labelPlacement="outside"
              type="text"
              variant="bordered"
              label="N° Cta Detracciones"
              {...register("ctaBancaria", {
                required: "El N° Cta Detracciones es obligatoria.",
              })}
              isInvalid={!!errors.ctaBancaria}
              color={errors.ctaBancaria ? "danger" : "primary"}
              errorMessage={errors.ctaBancaria?.message}
              id="ctaBancaria"
              radius="sm"
              size="sm"
            />
            <Input
              isRequired
              classNames={inputClassNames}
              labelPlacement="outside"
              type="text"
              variant="bordered"
              label="Porcentaje"
              {...register("porcentaje", {
                required: "El porcentaje es obligatorio.",
              })}
              isInvalid={!!errors.porcentaje}
              color={errors.porcentaje ? "danger" : "primary"}
              errorMessage={errors.porcentaje?.message}
              id="porcentaje"
              radius="sm"
              size="sm"
              value={porcentaje}
              onChange={handleOnchagePorcentaje}
              onInput={onInputPrice}
            />
            <Input
              isRequired
              classNames={inputClassNames}
              labelPlacement="outside"
              type="text"
              variant="bordered"
              label="Monto de la detracción "
              {...register("montoDetraccion", {
                required: "El montoDetraccion es obligatorio.",
              })}
              isInvalid={!!errors.montoDetraccion}
              color={errors.montoDetraccion ? "danger" : "primary"}
              errorMessage={errors.montoDetraccion?.message}
              id="montoDetraccion"
              radius="sm"
              size="sm"
              value={monto}
              onChange={handleOnchageMonto}
              onInput={onInputPrice}
            />
          </div>
        </div>
      )}
      <Input
        className="min-w-52 "
        classNames={inputClassNames}
        labelPlacement="outside"
        type="text"
        variant="bordered"
        label="Observación"
        placeholder="..."
        {...register("observacion")}
        color="primary"
        id="observacion"
        radius="sm"
        size="sm"
      />
      <div className="flex gap-4">
        <Input
          classNames={inputClassNames}
          labelPlacement="outside"
          type="date"
          variant="bordered"
          label="Fec. Emisión"
          defaultValue={getTodayDate}
          {...register("fecEmision", {
            required: "La fecha de emisión es obligatoria.",
          })}
          isInvalid={!!errors.fecEmision}
          color={errors.fecEmision ? "danger" : "primary"}
          errorMessage={errors.fecEmision?.message}
          id="fecEmision"
          radius="sm"
          size="sm"
        />
        <Input
          classNames={inputClassNames}
          labelPlacement="outside"
          type="date"
          variant="bordered"
          label="Fec. Vencimiento"
          defaultValue={getTodayDate}
          {...register("fecVencimiento", {
            required: "La fecha de vencimiento es obligatoria.",
          })}
          isInvalid={!!errors.fecVencimiento}
          color={errors.fecVencimiento ? "danger" : "primary"}
          errorMessage={errors.fecVencimiento?.message}
          id="fecVencimiento"
          radius="sm"
          size="sm"
        />
      </div>
      <div className="flex gap-4">
        <Select
          isRequired
          className="min-w-60 max-w-[300px]"
          labelPlacement="outside"
          label="Vendedor"
          {...register("vendedor")}
          variant="bordered"
          radius="sm"
          classNames={selectClassNames}
          value={dataSelects.vendedor}
          defaultSelectedKeys={[selectCotizacion.vendedor]}
          onChange={(e) =>
            setDataSelects({
              ...dataSelects,
              vendedor: e.target.value,
            })
          }
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

export default CamposClienteComprobante;
