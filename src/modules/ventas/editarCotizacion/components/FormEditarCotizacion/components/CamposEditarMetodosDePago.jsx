import { Select, SelectItem, Input, Tooltip } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { onInputPrice } from "../../../../../../assets/onInputs";
import axios from "axios";
import config from "../../../../../../utils/getToken";
import { getTodayDate } from "../../../../../../assets/getTodayDate";

const CamposEditarMetodosDePago = ({ arrayPagos, setArrayPagos }) => {
  const [errors, setErrors] = useState([]);
  const [metodosPagos, setMetodosPagos] = useState([]);
  const [cuentasBancarias, setCuentasBancarias] = useState([]);

  useEffect(() => {
    const url = `${import.meta.env.VITE_URL_API}/ajustes/metodos-pago`;

    axios.get(url, config).then((res) => setMetodosPagos(res.data.metodosPago));
  }, []);

  useEffect(() => {
    const url = `${import.meta.env.VITE_URL_API}/ajustes/cuentas-banco`;

    axios
      .get(url, config)
      .then((res) => setCuentasBancarias(res.data.cuentasBancarias));
  }, []);

  // Función para agregar un nuevo campo de pago
  const handleAddPago = () => {
    setArrayPagos([
      ...arrayPagos,
      {
        id: Date.now(),
        metodoPago: "",
        banco: "",
        operacion: "",
        monto: "",
        fecha: getTodayDate(),
      },
    ]);
    setErrors((prev) => [...prev, {}]);
  };

  const validateField = (index, field, value) => {
    let error = "";

    if (!value) {
      error = "Este campo es obligatorio.";
    } else if (field === "monto" && !/^\d+(\.\d{1,2})?$/.test(value)) {
      error = "Monto debe ser un número válido.";
    }

    setErrors((prevErrors) => {
      const newErrors = [...prevErrors];
      newErrors[index] = { ...newErrors[index], [field]: error };
      return newErrors;
    });
  };

  const handleInputChange = (index, field, value) => {
    const updatedPagos = arrayPagos.map((pago, i) =>
      i === index ? { ...pago, [field]: value } : pago
    );
    setArrayPagos(updatedPagos);

    validateField(index, field, value);
  };

  // Función para eliminar un campo de pago
  const handleDeletePago = (index) => {
    const updatedPagos = arrayPagos.filter((_, i) => i !== index);
    setArrayPagos(updatedPagos);
    setErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      <ul className="w-full bg-blue-100 flex p-4 gap-4 items-center justify-between border-y-2 border-blue-500 ">
        <li className="min-w-32 w-[15%] font-semibold text-sm ml-2">
          Método de pago
        </li>
        <li className="min-w-32 w-[20%] font-semibold text-sm ml-2">Banco</li>
        <li className="min-w-32 w-[15%] font-semibold text-sm ml-2">
          Operación
        </li>
        <li className="min-w-32 w-[15%] font-semibold text-sm ml-2">Monto</li>
        <li className="min-w-32 w-[15%] font-semibold text-sm ml-2">Fecha</li>
        <li
          className="min-w-32 w-[10%] font-semibold text-sm cursor-pointer text-blue-600"
          onClick={handleAddPago}
        >
          [+ Agregar]
        </li>
      </ul>
      {arrayPagos?.map((newPago, index) => (
        <div
          key={index}
          className="w-full flex gap-4 items-center justify-between p-4 border-t-1.5 border-neutral-400"
          style={index === 0 ? { border: "none" } : {}}
        >
          <Select
            className="min-w-32 w-[15%]"
            value={newPago.metodoPago}
            defaultSelectedKeys={[newPago.metodoPago]}
            onChange={(e) => {
              handleInputChange(index, "metodoPago", e.target.value);
            }}
            color={errors[index]?.metodoPago ? "danger" : "primary"}
            variant="bordered"
            label="Método de pago"
            labelPlacement="outside-left"
            radius="sm"
            classNames={{
              trigger: ["h-10  border-1.5 border-neutral-400"],
              label: ["hidden"],
            }}
          >
            {metodosPagos.map((metodoPago) => (
              <SelectItem
                key={metodoPago.id}
                value={metodoPago.id}
                textValue={metodoPago.descripcion}
              >
                {metodoPago.descripcion}
              </SelectItem>
            ))}
          </Select>
          <Select
            className="min-w-32 w-[20%]"
            value={newPago.banco}
            defaultSelectedKeys={[newPago.banco]}
            onChange={(e) => handleInputChange(index, "banco", e.target.value)}
            color={errors[index]?.banco ? "danger" : "primary"}
            variant="bordered"
            label="banco"
            labelPlacement="outside-left"
            radius="sm"
            classNames={{
              trigger: ["h-10  border-1.5 border-neutral-400  "],
              label: ["hidden"],
              value: "text-[11px]",
              listboxWrapper: "max-h-[400px]",
            }}
          >
            {cuentasBancarias.map((cuentaBancaria) => (
              <SelectItem
                key={cuentaBancaria.id}
                value={cuentaBancaria.id}
                textValue={`${cuentaBancaria.descripcion}  ${cuentaBancaria.numero}`}
              >
                {cuentaBancaria.descripcion} <br /> nro: {cuentaBancaria.numero}
              </SelectItem>
            ))}
          </Select>
          <Input
            className="min-w-32 w-[15%]  noLabel "
            value={newPago.operacion}
            onChange={(e) =>
              handleInputChange(index, "operacion", e.target.value)
            }
            type="text"
            variant="bordered"
            label="operacion"
            labelPlacement="outside"
            isInvalid={!!errors[index]?.operacion}
            color={errors[index]?.operacion ? "danger" : "primary"}
            errorMessage={errors[index]?.operacion}
            radius="sm"
            size="sm"
            classNames={{
              inputWrapper: ["min-h-10 border-1.5 border-neutral-400"],
              label: ["hidden"],
            }}
          />
          <Input
            className="min-w-32 w-[15%]  noLabel "
            value={newPago.monto}
            onChange={(e) => handleInputChange(index, "monto", e.target.value)}
            type="text"
            variant="bordered"
            label="Monto"
            labelPlacement="outside"
            isInvalid={!!errors[index]?.monto}
            color={errors[index]?.monto ? "danger" : "primary"}
            errorMessage={errors[index]?.monto}
            radius="sm"
            size="sm"
            onInput={onInputPrice}
            classNames={{
              inputWrapper: ["min-h-10 border-1.5 border-neutral-400"],
              label: ["hidden"],
            }}
          />
          <Input
            className="min-w-32 w-[15%]  noLabel "
            value={newPago.fecha}
            onChange={(e) => handleInputChange(index, "fecha", e.target.value)}
            type="date"
            variant="bordered"
            label="Fecha"
            labelPlacement="outside"
            isInvalid={!!errors[index]?.fecha}
            color={errors[index]?.fecha ? "danger" : "primary"}
            errorMessage={errors[index]?.fecha}
            radius="sm"
            size="sm"
            classNames={{
              inputWrapper: ["min-h-10 border-1.5 border-neutral-400"],
              label: ["hidden"],
            }}
          />
          <div className="min-w-32 w-[10%]  pl-4 ">
            <Tooltip content="Eliminar" showArrow={true}>
              <span
                className="cursor-pointer"
                onClick={() => handleDeletePago(index)}
              >
                <FaTrashAlt className="text-red-500 text-xl" />
              </span>
            </Tooltip>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CamposEditarMetodosDePago;
