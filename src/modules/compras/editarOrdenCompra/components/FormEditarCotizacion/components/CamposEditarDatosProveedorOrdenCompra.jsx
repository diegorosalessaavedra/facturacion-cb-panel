import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../../../assets/classNames";

import { FaPlus } from "react-icons/fa";
import { getTodayDate } from "../../../../../../assets/getTodayDate";
import axios from "axios";
import config from "../../../../../../utils/getToken";
import { onInputPrice } from "../../../../../../assets/onInputs";

const CamposEditarDatosProveedorOrdenCompra = ({
  register,
  setSelectProveedor,
  selectProveedor,
  onOpen,
  proveedores,
  ordenCompra,
  dataSelects,
  setDataSelects,
}) => {
  const [autorizados, setAutorizados] = useState([]);
  const [compradores, setCompradores] = useState([]);
  const [selectBanco, setSelectBanco] = useState(
    `${ordenCompra.banco_beneficiario} - ${ordenCompra.nro_cuenta_bco}`
  );
  const [isLoading, setIsLoading] = useState({
    autorizados: true,
    compradores: true,
  });

  const dolarData = useMemo(() => {
    try {
      const dolarJSON = localStorage.getItem("dolar");
      return dolarJSON ? JSON.parse(dolarJSON) : null;
    } catch (error) {
      console.error("Error parsing dollar data:", error);
      return null;
    }
  }, []);

  const apiBaseUrl = import.meta.env.VITE_URL_API;

  const fetchEncargados = useCallback(
    async (cargo) => {
      try {
        const url = `${apiBaseUrl}/ajustes/encargado?cargo=${cargo}`;
        const response = await axios.get(url, config);
        return response.data.encargados || [];
      } catch (error) {
        console.error(`Error fetching ${cargo}:`, error);
        return [];
      }
    },
    [apiBaseUrl]
  );

  const findAprobados = useCallback(async () => {
    setIsLoading((prev) => ({ ...prev, autorizados: true }));
    const data = await fetchEncargados("Autorizado");
    setAutorizados(data);
    setIsLoading((prev) => ({ ...prev, autorizados: false }));
  }, [fetchEncargados]);

  const findCompradores = useCallback(async () => {
    setIsLoading((prev) => ({ ...prev, compradores: true }));
    const data = await fetchEncargados("Comprador");
    setCompradores(data);
    setIsLoading((prev) => ({ ...prev, compradores: false }));
  }, [fetchEncargados]);

  useEffect(() => {
    Promise.all([findAprobados(), findCompradores()]);
  }, [findAprobados, findCompradores]);

  const onSelectionChange = useCallback(
    (value) => {
      setSelectProveedor(value);
    },
    [setSelectProveedor]
  );

  const handleOpenProveedorModal = useCallback(() => {
    onOpen();
  }, [onOpen]);

  const dataSelectProveedor = useMemo(
    () => proveedores.find((p) => p.id === selectProveedor),
    [proveedores, selectProveedor]
  );

  const todayDate = useMemo(() => getTodayDate(), []);

  const bancoBeneficiarioOptions = useMemo(() => {
    if (!dataSelectProveedor) return [];

    const options = [];
    const addOption = (banco, cuenta) => {
      if (banco && cuenta) {
        const value = `${banco} - ${cuenta}`;
        options.push({ key: value, value, label: value });
      }
    };

    addOption(
      dataSelectProveedor.banco_beneficiario,
      dataSelectProveedor.nro_cuenta_bco
    );
    addOption(
      dataSelectProveedor.banco_beneficiario_2,
      dataSelectProveedor.nro_cuenta_bco_2
    );

    return options;
  }, [dataSelectProveedor]);

  useEffect(() => {
    if (!selectBanco) return;

    const cuenta = selectBanco.split(" - ");

    if (bancoBeneficiarioOptions.length > 0 && cuenta?.length > 0) {
      setDataSelects((prev) => ({
        ...prev,
        banco_beneficiario: cuenta[0] || "",
        nro_cuenta_bco: cuenta[1] || "",
      }));
    } else {
      setDataSelects((prev) => ({
        ...prev,
        banco_beneficiario: "",
        nro_cuenta_bco: "",
      }));
    }
  }, [dataSelectProveedor, selectBanco]);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex gap-4 justify-between">
        <div className="relative w-full">
          <Button
            className="absolute top-[-12px] right-0 scale-85 z-10"
            size="sm"
            color="primary"
            onPress={handleOpenProveedorModal}
            isIconOnly={false}
          >
            <FaPlus /> Proveedor
          </Button>
          <Autocomplete
            isRequired
            className="w-full"
            inputProps={{
              classNames: {
                input: "text-xs",
                inputWrapper: "min-h-10 border-1.5 border-neutral-400",
                label: "pb-1 text-[0.8rem] text-neutral-800 font-semibold",
              },
            }}
            labelPlacement="outside"
            label="Proveedor"
            placeholder="Ingrese el nombre o dni del Proveedor"
            description="Seleccione un proveedor existente o cree uno nuevo"
            variant="bordered"
            color="primary"
            errorMessage="El Proveedor es obligatorio."
            id="proveedor"
            radius="sm"
            size="sm"
            selectedKey={selectProveedor}
            onSelectionChange={{ onSelectionChange }}
            isLoading={!proveedores.length}
          >
            {proveedores.map((proveedor) => (
              <AutocompleteItem
                key={proveedor.id}
                value={proveedor.id}
                textValue={`${
                  proveedor.nombreApellidos || proveedor.nombreComercial
                } - ${proveedor.numeroDoc}`}
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
          isRequired
          className="min-w-52 max-w-52"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="date"
          variant="bordered"
          label="Fec. Emisión"
          {...register("fechaEmision")}
          defaultValue={ordenCompra.fechaEmision}
          color="primary"
          errorMessage="La fecha de emisión es obligatoria."
          id="fechaEmision"
          radius="sm"
          size="sm"
        />

        <Input
          isRequired
          className="min-w-52 max-w-52"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="date"
          variant="bordered"
          label="Fec. Vencimiento"
          {...register("fechaVencimiento")}
          defaultValue={ordenCompra.fechaVencimiento}
          color="primary"
          errorMessage="La fecha de vencimiento es obligatoria."
          id="fechaVencimiento"
          radius="sm"
          size="sm"
        />

        <Select
          isRequired
          className="min-w-52 max-w-52"
          label="Moneda"
          labelPlacement="outside"
          {...register("moneda")}
          value={dataSelects.moneda}
          defaultSelectedKeys={[ordenCompra.moneda]}
          onChange={(e) =>
            setDataSelects({
              ...dataSelects,
              moneda: e.target.value,
            })
          }
          color="primary"
          variant="bordered"
          errorMessage="La moneda es obligatoria."
          description="Soles o Dólares Americanos"
          radius="sm"
          size="sm"
          classNames={selectClassNames}
        >
          <SelectItem key="Soles">Soles</SelectItem>
          <SelectItem key="Dólares Americanos">Dólares Americanos</SelectItem>
        </Select>
      </div>

      <div className="flex gap-4">
        <Select
          isRequired
          label="Tipo de productos"
          placeholder="..."
          labelPlacement="outside"
          value={dataSelects.tipo_productos}
          defaultSelectedKeys={[ordenCompra.tipo_productos]}
          onChange={(e) =>
            setDataSelects({
              ...dataSelects,
              tipo_productos: e.target.value,
            })
          }
          color="primary"
          errorMessage="El tipo de productos es obligatorio."
          description="Comercialización y servicios o Costos"
          variant="bordered"
          radius="sm"
          size="sm"
          classNames={selectClassNames}
        >
          <SelectItem key="Comercialización y servicios">
            Comercialización y servicios
          </SelectItem>
          <SelectItem key="Costos y gastos">Costos y gastos</SelectItem>
        </Select>

        <Input
          isRequired
          classNames={inputClassNames}
          labelPlacement="outside"
          type="text"
          variant="bordered"
          label="Tipo de cambio"
          {...register("tipoCambio")}
          defaultValue={ordenCompra.tipoCambio}
          color="primary"
          errorMessage="El tipo de cambio es obligatorio."
          description="Tipo de cambio del día"
          id="tipoCambio"
          radius="sm"
          size="sm"
          onInput={onInputPrice}
        />

        <Select
          isRequired
          labelPlacement="outside"
          label="Autorizado"
          {...register("autorizado")}
          value={dataSelects.autorizado}
          defaultSelectedKeys={[ordenCompra.autorizado]}
          onChange={(e) =>
            setDataSelects({
              ...dataSelects,
              autorizado: e.target.value,
            })
          }
          color="primary"
          errorMessage="El autorizado es obligatorio."
          description="Seleccione un autorizado"
          variant="bordered"
          radius="sm"
          size="sm"
          classNames={selectClassNames}
          isLoading={isLoading.autorizados}
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
          isRequired
          labelPlacement="outside"
          label="Comprador"
          {...register("comprador")}
          value={dataSelects.comprador}
          defaultSelectedKeys={[ordenCompra.comprador]}
          onChange={(e) =>
            setDataSelects({
              ...dataSelects,
              comprador: e.target.value,
            })
          }
          color="primary"
          variant="bordered"
          errorMessage="El Comprador es obligatorio."
          description="Seleccione un comprador"
          radius="sm"
          size="sm"
          classNames={selectClassNames}
          isLoading={isLoading.compradores}
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

      <div className="flex gap-4">
        <Select
          isRequired
          className="min-w-72 max-w-72"
          label="Forma de Pago"
          placeholder="..."
          labelPlacement="outside"
          {...register("formaPago")}
          value={dataSelects.formaPago}
          defaultSelectedKeys={[ordenCompra.formaPago]}
          onChange={(e) =>
            setDataSelects({
              ...dataSelects,
              formaPago: e.target.value,
            })
          }
          color="primary"
          errorMessage="La forma de pago es obligatoria."
          description="Credito o Al Contado"
          variant="bordered"
          radius="sm"
          size="sm"
          classNames={selectClassNames}
        >
          <SelectItem key="Credito">Credito</SelectItem>
          <SelectItem key="Al Contado">Al Contado</SelectItem>
        </Select>

        <Select
          isRequired={bancoBeneficiarioOptions.length > 0}
          className="min-w-72 max-w-72"
          label="Banco del beneficiario"
          placeholder="..."
          labelPlacement="outside"
          color="primary"
          description="Seleccione el banco del beneficiario"
          errorMessage="El banco del beneficiario es obligatorio"
          variant="bordered"
          radius="sm"
          size="sm"
          classNames={selectClassNames}
          isDisabled={bancoBeneficiarioOptions.length === 0}
          value={selectBanco}
          defaultSelectedKeys={[selectBanco]}
          onChange={(e) => setSelectBanco(e.target.value)}
        >
          {bancoBeneficiarioOptions.map((option) => (
            <SelectItem
              key={option.key}
              value={option.value}
              textValue={option.label}
            >
              {option.label}
            </SelectItem>
          ))}
        </Select>
        <Select
          isRequired
          className="min-w-72 max-w-72"
          label="Prioridad Solped"
          placeholder="..."
          labelPlacement="outside"
          {...register("prioridad_solped")}
          color="primary"
          errorMessage="La prioridad solped es obligatoria."
          description="prioridad solped Alta, mediana o baja"
          variant="bordered"
          defaultSelectedKeys={[ordenCompra.prioridad_solped]}
          radius="sm"
          size="sm"
          classNames={selectClassNames}
        >
          <SelectItem key="Alta">Alta</SelectItem>
          <SelectItem key="Mediana">Mediana</SelectItem>
          <SelectItem key="Baja">Baja</SelectItem>
        </Select>
      </div>

      <Textarea
        variant="bordered"
        label="Referencia"
        labelPlacement="outside"
        placeholder="Ingrese observaciones adicionales..."
        {...register("observacion")}
        classNames={{
          inputWrapper: ["min-h-10 border-1.5 border-neutral-400"],
          label: ["pb-1 text-[0.8rem] text-neutral-800 font-semibold"],
        }}
        defaultValue={ordenCompra.observacion}
        id="observacion"
        radius="sm"
        size="sm"
        color="primary"
        maxLength={500}
      />
    </div>
  );
};

export default React.memo(CamposEditarDatosProveedorOrdenCompra);
