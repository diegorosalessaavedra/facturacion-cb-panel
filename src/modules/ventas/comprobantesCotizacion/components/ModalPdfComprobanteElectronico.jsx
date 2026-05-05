import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import formatDate from "../../../../hooks/FormatDate";
import { formatNumber } from "../../../../assets/formats";
import axios from "axios";
import config from "../../../../utils/getToken";
import plantillaComprobantePdf from "../../../../assets/ComprobantePdf";

const ModalPdfComprobanteElectronico = ({
  onOpenChange,
  isOpen,
  idComprobante,
}) => {
  const [comprobanteElectronico, setComprobanteElectronico] = useState(null);
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
    const url = `${import.meta.env.VITE_URL_API}/comprobantes/comprobante-electronico/${idComprobante}`;

    axios.get(url, config).then((res) => {
      setComprobanteElectronico(res.data.comprobanteElectronico);
    });
  }, [idComprobante]);

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
              <div className="w-full flex flex-col gap-6 p-5 text-zinc-800">
                {/* HEADER */}
                <div className="flex justify-between items-start border-b pb-4">
                  <div className="flex gap-4 items-start">
                    <img
                      className="w-20 h-20 object-contain"
                      src={import.meta.env.VITE_LOGO}
                      alt="Logo"
                    />

                    <div className="text-[11px] leading-tight">
                      <h2 className="text-[14px] font-semibold">
                        {import.meta.env.VITE_NOMBRE}
                      </h2>
                      <p>RUC: {import.meta.env.VITE_RUC}</p>
                      <p>{import.meta.env.VITE_DIRRECION}</p>
                      <p>Tel: {import.meta.env.VITE_TELEFONO}</p>
                      <p>{import.meta.env.VITE_CORREO}</p>
                    </div>
                  </div>

                  <div className="border border-black px-6 py-4 text-center min-w-[150px]">
                    <p className="text-[11px] font-medium">
                      {comprobanteElectronico?.tipoComprobante}
                    </p>
                    <h3 className="text-[14px] font-bold tracking-wider">
                      {comprobanteElectronico?.serie}-
                      {comprobanteElectronico?.numeroSerie}
                    </h3>
                  </div>
                </div>

                {/* CLIENTE */}
                <div className="flex justify-between text-[11px]">
                  <div className="flex gap-4">
                    <div className="font-medium">
                      <p>CLIENTE:</p>
                      <p>
                        {comprobanteElectronico?.cliente?.tipoDocIdentidad}:
                      </p>
                      <p>DIRECCIÓN:</p>
                    </div>

                    <div>
                      <p>
                        {comprobanteElectronico?.cliente.nombreComercial ||
                          comprobanteElectronico?.cliente.nombreApellidos}
                      </p>
                      <p>{comprobanteElectronico?.cliente.numeroDoc}</p>
                      <p>
                        {comprobanteElectronico?.cliente?.direccion} -{" "}
                        {
                          comprobanteElectronico?.cliente?.departamento
                            ?.departamento
                        }{" "}
                        -{" "}
                        {comprobanteElectronico?.cliente?.provincia?.provincia}{" "}
                        - {comprobanteElectronico?.cliente?.distrito?.distrito}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="font-medium">
                      <p>EMISIÓN:</p>
                      <p>VENCIMIENTO:</p>
                    </div>
                    <div>
                      <p>{formatDate(comprobanteElectronico?.fechaEmision)}</p>
                      <p>
                        {formatDate(comprobanteElectronico?.fechaVencimiento)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* TABLA */}
                <div className="w-full">
                  <table className="w-full border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-gray-100 border-y text-[12px]">
                        <th className="text-left px-2 py-2">CANT</th>
                        <th className="text-left px-2">UND</th>
                        <th className="text-left px-2">DESCRIPCIÓN</th>
                        <th className="text-right px-2">V.UNIT</th>
                        <th className="text-right px-2">SUB TOTAL</th>
                      </tr>
                    </thead>

                    <tbody>
                      {comprobanteElectronico?.productos.map((producto) => (
                        <tr key={producto.id} className="border-b">
                          <td className="px-2 py-1">{producto.cantidad}</td>
                          <td className="px-2">
                            {producto.producto?.codUnidad}
                          </td>

                          {/* DESCRIPCIÓN CON BONO */}
                          <td className="px-2">
                            <div className="flex items-center gap-2">
                              {(producto.bono ||
                                producto.tipo_producto === "BONO") && (
                                <span className="bg-emerald-100 text-emerald-700 border border-emerald-300 px-2 py-[2px] rounded-md text-[9px] font-bold tracking-wider shadow-sm">
                                  BONO
                                </span>
                              )}

                              <span>
                                {producto.producto?.nombre ||
                                  (producto.tipo_producto === "BONO"
                                    ? "Producto de Bono"
                                    : "")}
                              </span>
                            </div>
                          </td>

                          <td className="px-2 text-right">
                            {formatNumber(producto.precioUnitario)}
                          </td>

                          <td className="px-2 text-right font-medium">
                            {formatNumber(producto.total)}
                          </td>
                        </tr>
                      ))}

                      {/* TOTALES */}
                      <tr className="font-semibold">
                        <td colSpan={3}></td>
                        <td className="text-right px-2">OP. GRAVADAS</td>
                        <td className="text-right px-2">
                          S/{" "}
                          {formatNumber(
                            comprobanteElectronico?.total_valor_venta,
                          )}
                        </td>
                      </tr>

                      <tr className="font-semibold">
                        <td colSpan={3}></td>
                        <td className="text-right px-2">IGV</td>
                        <td className="text-right px-2">
                          S/ {formatNumber(comprobanteElectronico?.total_igv)}
                        </td>
                      </tr>

                      <tr className="font-bold text-[13px]">
                        <td colSpan={3}></td>
                        <td className="text-right px-2">TOTAL</td>
                        <td className="text-right px-2">
                          S/ {formatNumber(comprobanteElectronico?.total_venta)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* MONTO EN LETRAS */}
                <p className="text-[10px] italic">
                  SON: {comprobanteElectronico?.legend}
                </p>

                {/* PAGOS */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-[12px] font-semibold">Pagos</h3>

                  <table className="w-full text-[11px] border-collapse">
                    <thead>
                      <tr className="border-y bg-gray-100">
                        <th className="text-left px-2 py-1">Método</th>
                        <th className="text-left px-2">Banco</th>
                        <th className="text-left px-2">Operación</th>
                        <th className="text-right px-2">Monto</th>
                        <th className="text-left px-2">Fecha</th>
                      </tr>
                    </thead>

                    <tbody>
                      {comprobanteElectronico?.pagos.map((pago) => (
                        <tr key={pago.id} className="border-b">
                          <td className="px-2 py-1">
                            {pago.metodoPago.descripcion}
                          </td>
                          <td className="px-2">{pago.banco.descripcion}</td>
                          <td className="px-2">{pago.operacion}</td>
                          <td className="px-2 text-right">
                            S/ {formatNumber(pago.monto)}
                          </td>
                          <td className="px-2">{formatDate(pago.fecha)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                Cancelar
              </Button>

              <Button
                color="primary"
                onClick={() =>
                  plantillaComprobantePdf(
                    comprobanteElectronico,
                    cuentasBancarias,
                  )
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

export default ModalPdfComprobanteElectronico;
