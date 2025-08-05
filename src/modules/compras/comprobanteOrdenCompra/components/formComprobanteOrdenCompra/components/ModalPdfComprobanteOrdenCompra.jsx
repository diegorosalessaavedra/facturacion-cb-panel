import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import config from "../../../../../../utils/getToken";
import { numeroALetras } from "../../../../../../assets/numeroLetras";
import { formatNumber } from "../../../../../../assets/formats";
import plantillaComprobanteOrdenCompraPdf from "../../../../../../assets/comprobanteOrdenCompraPdf";
import formatDate from "../../../../../../hooks/FormatDate";

const ModalPdfComprobanteOrdenCompra = ({ onOpenChange, isOpen, id }) => {
  const [comprobanteOrdenCompra, setComprobanteOrdenCompra] = useState();

  useEffect(() => {
    const url = `${
      import.meta.env.VITE_URL_API
    }/compras/comprobante/orden-compra/${id}`;

    axios
      .get(url, config)
      .then((res) =>
        setComprobanteOrdenCompra(res.data.comprobanteOrdenCompra)
      );
  }, [id]);

  const opGravadas = Number(comprobanteOrdenCompra?.saldoInicial) / 1.18;

  const totalEnLetras = numeroALetras(comprobanteOrdenCompra?.saldoInicial, {
    plural: "SOLES",
    singular: "SOLES",
    centPlural: "CENTIMOS",
    centSingular: "CENTIMOS",
  });

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
                    <p className="text-[11px]">
                      {comprobanteOrdenCompra?.tipoComprobante}
                    </p>
                    <h3 className="text-[14px]">
                      {comprobanteOrdenCompra?.serie}
                    </h3>
                  </div>
                </div>

                {/* Información del cliente y detalles */}
                <div className="w-full flex justify-between">
                  <div className="flex gap-6">
                    <ul className="flex flex-col text-[11px]">
                      <li>Proveedor:</li>
                      <li>
                        {comprobanteOrdenCompra?.proveedor?.tipoDocIdentidad}:
                      </li>
                      <li>Autorizado por:</li>
                      <li>Observación:</li>
                    </ul>
                    <ul className="flex flex-col text-[11px]">
                      <li>
                        {comprobanteOrdenCompra?.proveedor?.nombreComercial ||
                          comprobanteOrdenCompra?.proveedor?.nombreApellidos}
                      </li>
                      <li>{comprobanteOrdenCompra?.proveedor?.numeroDoc}</li>
                      <li>{comprobanteOrdenCompra?.autorizado}</li>
                      <li>{comprobanteOrdenCompra?.observacion}</li>
                    </ul>
                  </div>
                  <div className="flex gap-6">
                    <ul className="flex flex-col text-[12px] gap-4">
                      <li>Fecha de emisión:</li>
                      <li>Tiempo de vencimiento:</li>
                    </ul>
                    <ul className="flex flex-col text-[12px] gap-4">
                      <li>{comprobanteOrdenCompra?.fechaEmision}</li>
                      <li>{comprobanteOrdenCompra?.fechaVencimiento}</li>
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
                      {comprobanteOrdenCompra?.productos?.map((producto) => (
                        <tr
                          className="border-b-1 border-black text-[11px]"
                          key={producto.id}
                        >
                          <td className="px-2 py-[3px]">{producto.cantidad}</td>
                          <td>{producto.producto?.codUnidad}</td>
                          <td>{producto?.producto?.nombre}</td>
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
                          {formatNumber(comprobanteOrdenCompra?.saldoInicial)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-[10px]">SON: {totalEnLetras}</p>
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
                      {comprobanteOrdenCompra?.pagos?.map((pago) => (
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
                  <b>SALDO:</b> S/ {formatNumber(comprobanteOrdenCompra?.saldo)}
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
                  plantillaComprobanteOrdenCompraPdf(comprobanteOrdenCompra)
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

export default ModalPdfComprobanteOrdenCompra;
