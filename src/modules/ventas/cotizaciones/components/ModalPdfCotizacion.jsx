import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { numeroALetras } from "../../../../assets/numeroLetras";
import plantillaCotizacionPdf from "../../../../assets/cotizacionPdf";
import formatDate from "../../../../hooks/FormatDate";
import {
  formatNumber,
  formatWithLeadingZeros,
} from "../../../../assets/formats";
import axios from "axios";
import config from "../../../../utils/getToken";

const ModalPdfCotizacion = ({ onOpenChange, isOpen, idCotizacion }) => {
  const [cotizacion, setCotizacion] = useState(null);
  const [cuentasBancarias, setCuentasBancarias] = useState([]);

  const handleFindCuentasBancarias = () => {
    const url = `${import.meta.env.VITE_URL_API}/ajustes/cuentas-banco`;

    axios
      .get(url, config)
      .then((res) => setCuentasBancarias(res.data.cuentasBancarias));
  };

  useEffect(() => {
    handleFindCuentasBancarias();
  }, []);

  useEffect(() => {
    const url = `${
      import.meta.env.VITE_URL_API
    }/ventas/cotizaciones/${idCotizacion}`;

    axios.get(url, config).then((res) => setCotizacion(res.data.cotizacion));
  }, []);

  const totalPagos = cotizacion?.pagos.reduce(
    (acc, pago) => acc + Number(pago.monto),
    0
  );

  const opGravadas = Number(cotizacion?.saldoInicial) / 1.18;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="3xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-sm font-semibold text-zinc-600">
              Previsualización del PDF
            </ModalHeader>
            <ModalBody>
              <div className="w-full flex flex-col gap-4 p-4">
                <div className="w-full flex gap-4 justify-between items-center">
                  <img
                    className="w-20 h-18"
                    src={import.meta.env.VITE_LOGO}
                    alt="Logo"
                  />
                  <div className="flex flex-col">
                    <h2 className="text-[14px]">
                      {import.meta.env.VITE_NOMBRE}{" "}
                    </h2>
                    <h3 className="text-[13px]">{import.meta.env.VITE_RUC}</h3>
                    <ul className="text-[10px]">
                      <li>{import.meta.env.VITE_DIRRECION}</li>
                      <li>
                        Central telefónica: {import.meta.env.VITE_TELEFONO}
                      </li>
                      <li>Email: {import.meta.env.VITE_CORREO}</li>
                      <li>Web: {import.meta.env.VITE_WEB}</li>
                    </ul>
                  </div>
                  <div className="flex flex-col justify-center items-center border-1 border-black py-6 px-6">
                    <p className="text-[11px]">COTIZACIÓN</p>
                    <h3 className="text-[14px]">
                      COT-{formatWithLeadingZeros(cotizacion?.id, 6)}
                    </h3>
                  </div>
                </div>

                {/* Información del cliente y detalles */}
                <div className="w-full flex justify-between">
                  <div className="flex gap-6">
                    <ul className="flex flex-col text-[11px]">
                      <li>Cliente:</li>
                      <li>{cotizacion?.cliente?.tipoDocIdentidad}:</li>
                      <li>Dirección:</li>
                      <li>Vendedor:</li>
                      <li>Observación:</li>
                    </ul>
                    <ul className="flex flex-col text-[11px]">
                      <li>
                        {cotizacion?.cliente.nombreComercial ||
                          cotizacion?.cliente.nombreApellidos}
                      </li>
                      <li>{cotizacion?.cliente.numeroDoc}</li>
                      <li>{cotizacion?.direccionEnvio}</li>
                      <li>{cotizacion?.vendedor}</li>
                      <li>{cotizacion?.observacion}</li>
                    </ul>
                  </div>
                  <div className="flex gap-6">
                    <ul className="flex flex-col text-[12px] gap-4">
                      <li>Fecha de emisión:</li>
                      <li>Tiempo de Entrega:</li>
                    </ul>
                    <ul className="flex flex-col text-[12px] gap-4">
                      <li>{cotizacion?.fechaEntrega}</li>
                      <li>{cotizacion?.fechaEmision}</li>
                    </ul>
                  </div>
                </div>

                {/* Tabla de productos */}
                <div className="w-full">
                  <table className="w-full">
                    <thead>
                      <tr className="border-t-1 border-b-1 border-black text-[12px] bg-gray-100 h-[27px]">
                        <th className="text-start">CANT</th>
                        <th className="text-start">UNIDAD</th>
                        <th className="text-start">DESCRIPCIÓN</th>
                        <th className="text-start">V.UNIT</th>
                        <th className="text-start">SUB TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cotizacion?.productos.map((producto) => (
                        <tr
                          className="border-b-1 border-black text-[11px]"
                          key={producto.id}
                        >
                          <td className="px-2 py-[3px]">{producto.cantidad}</td>
                          <td>{producto.producto?.codUnidad}</td>
                          <td>{producto.producto.nombre}</td>
                          <td>{formatNumber(producto.precioUnitario)}</td>
                          <td>{formatNumber(producto.total)}</td>
                        </tr>
                      ))}
                      <tr className="text-[13px] font-semibold">
                        <td colSpan={2}></td>
                        <td className="text-end px-2" colSpan={2}>
                          OP. GRAVADAS:S/
                        </td>
                        <td className="px-2">{formatNumber(opGravadas)}</td>
                      </tr>
                      <tr className="text-[13px] font-semibold">
                        <td colSpan={2}></td>
                        <td className="text-end px-2" colSpan={2}>
                          IGV: S/
                        </td>
                        <td className="px-2">
                          {formatNumber(opGravadas * 0.18)}
                        </td>
                      </tr>
                      <tr className="text-[13px] font-semibold">
                        <td colSpan={2}></td>
                        <td className="text-end px-2" colSpan={2}>
                          TOTAL A PAGAR: S/
                        </td>
                        <td className="px-2">
                          {formatNumber(cotizacion?.saldoInicial)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-[10px]">
                  SON:{" "}
                  {numeroALetras(cotizacion?.saldoInicial, {
                    plural: "SOLES",
                    singular: "SOLES",
                    centPlural: "CENTIMOS",
                    centSingular: "CENTIMOS",
                  })}
                </p>
                <div className="w-full flex flex-col gap-2">
                  <h3>Pagos:</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="border-t-1 border-b-1 border-black text-[12px] h-[27px]">
                        <th className="text-start">Método de pago </th>
                        <th className="text-start pl-2">Banco</th>
                        <th className="text-start">Operación</th>
                        <th className="text-start">Monto</th>
                        <th className="text-start">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cotizacion?.pagos.map((pago) => (
                        <tr key={pago.id} className="text-[11px]">
                          <td className="px-2 py-[3px]">
                            {pago.metodoPago.descripcion}
                          </td>
                          <td>{pago.banco.descripcion}</td>
                          <td>{pago.operacion}</td>
                          <td>S/{formatNumber(pago.monto)}</td>
                          <td>{formatDate(pago.fecha)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <h4 className="text-[14px]">
                  <b>SALDO:</b> S/{" "}
                  {formatNumber(cotizacion?.saldoInicial - totalPagos)}
                </h4>
              </div>
            </ModalBody>

            {/* Botones del modal */}
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color="primary"
                onClick={() =>
                  plantillaCotizacionPdf(cotizacion, cuentasBancarias)
                }
              >
                Descargar PDF
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalPdfCotizacion;
