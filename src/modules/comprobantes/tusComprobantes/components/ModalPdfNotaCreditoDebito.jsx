import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { formatNumber } from "../../../../assets/formats";
import axios from "axios";
import config from "../../../../utils/getToken";
import plantillaNotaComprobantePdf from "../../../../assets/NotaComprobantePdf";

const ModalPdfNotaComprobante = ({
  onOpenChange,
  isOpen,
  idNotaCreditoDebito,
}) => {
  const [notaComprobante, setNotaComprobante] = useState(null);

  useEffect(() => {
    const url = `${
      import.meta.env.VITE_URL_API
    }/comprobantes/notas-comprobantes/${idNotaCreditoDebito}`;

    axios.get(url, config).then((res) => {
      setNotaComprobante(res.data.notaComprobante);
    });
  }, [idNotaCreditoDebito]);

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
                    <p className="text-[11px] ">{notaComprobante?.tipo_nota}</p>
                    <h3 className="text-[14px]">
                      {notaComprobante?.serie}-{notaComprobante?.numero_serie}
                    </h3>
                  </div>
                </div>

                {/* Información del cliente y detalles */}
                <div className="w-full flex justify-between">
                  <div className="flex gap-6">
                    <ul className="flex flex-col text-[10px]">
                      <li>FECHA DE EMISIÓN :</li>
                      <li>CLIENTE :</li>
                      <li>{notaComprobante?.cliente?.tipoDocIdentidad}:</li>
                      <li>DIRECCIÓN:</li>
                      <li>DOC. AFECTADO :</li>
                      <li>TIPO DE NOTA :</li>
                      <li>DESCRIPCIÓN :</li>
                    </ul>
                    <ul className="flex flex-col text-[10px]">
                      <li>{notaComprobante?.fecha_emision}</li>
                      <li>
                        {notaComprobante?.cliente.nombreComercial ||
                          notaComprobante?.cliente.nombreApellidos}
                      </li>
                      <li>{notaComprobante?.cliente.numeroDoc}</li>
                      <li>
                        {notaComprobante?.cliente?.direccion} -{" "}
                        {notaComprobante?.cliente?.departamento.departamento} -{" "}
                        {notaComprobante?.cliente?.provincia.provincia} -{" "}
                        {notaComprobante?.cliente?.distrito.distrito}
                      </li>
                      <li>
                        {" "}
                        {notaComprobante?.comprobantesElectronico.serie}-
                        {notaComprobante?.comprobantesElectronico.numeroSerie}
                      </li>

                      <li>{notaComprobante?.motivo}</li>
                      <li>{notaComprobante?.descripcion}</li>
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
                      {notaComprobante?.productos.map((producto) => (
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
                        <td className="px-2">
                          {formatNumber(notaComprobante?.total_valor_venta)}
                        </td>
                      </tr>
                      <tr className="text-[13px] font-semibold">
                        <td colSpan={2}></td>
                        <td className="text-end px-2" colSpan={2}>
                          IGV: S/
                        </td>
                        <td className="px-2">
                          {formatNumber(notaComprobante?.total_igv)}{" "}
                        </td>
                      </tr>
                      <tr className="text-[13px] font-semibold">
                        <td colSpan={2}></td>
                        <td className="text-end px-2" colSpan={2}>
                          TOTAL A PAGAR: S/
                        </td>
                        <td className="px-2">
                          {formatNumber(notaComprobante?.total_venta)}{" "}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-[10px]">SON: {notaComprobante?.legend}</p>
              </div>
            </ModalBody>

            {/* Botones del modal */}
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color="primary"
                onClick={() => plantillaNotaComprobantePdf(notaComprobante)}
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

export default ModalPdfNotaComprobante;
