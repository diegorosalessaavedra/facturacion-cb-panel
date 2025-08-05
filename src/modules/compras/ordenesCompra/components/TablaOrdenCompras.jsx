import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { formatNumber } from "../../../../assets/formats";
import { Link } from "react-router-dom";
import formatDate from "../../../../hooks/FormatDate";

const TablaOrdenCompras = ({
  ordenCompras,
  onOpen,
  setSelectModal,
  setSelectOrdenCompra,
}) => {
  return (
    <div className="w-full flex items-center">
      <Table
        aria-label="Tabla de itinerarios"
        color="default"
        isStriped
        classNames={{
          base: "min-w-full  max-h-[80vh] overflow-scroll  p-4 ",
          wrapper: "p-0",
        }}
        radius="sm"
        isCompact={true}
        isHeaderSticky
      >
        <TableHeader>
          <TableColumn className="text-xs text-white  bg-blue-700">
            #
          </TableColumn>

          <TableColumn className="text-xs text-white  bg-blue-700">
            Fecha <br />
            Emisión
          </TableColumn>
          <TableColumn className="text-xs text-white  bg-blue-700">
            Proveedor
          </TableColumn>

          <TableColumn className="text-xs text-white  bg-blue-700">
            Tipos de Productos
          </TableColumn>
          <TableColumn className="text-xs text-white  bg-blue-700">
            Forma de Pago
          </TableColumn>
          <TableColumn className="text-xs text-white  bg-blue-700">
            Moneda
          </TableColumn>
          <TableColumn className="text-xs text-white  bg-blue-700">
            Total
          </TableColumn>
          <TableColumn className="text-xs text-white bg-blue-700">
            Banco
          </TableColumn>
          <TableColumn className="text-xs text-white bg-blue-700">
            Nro cuenta
          </TableColumn>
          <TableColumn className="text-xs text-white  bg-blue-700">
            Saldo
          </TableColumn>
          <TableColumn className="text-xs text-white  bg-blue-700">
            Estado de <br /> Pago
          </TableColumn>
          <TableColumn className="text-xs text-white  bg-blue-700">
            Estado del <br />
            Comprobante
          </TableColumn>
          <TableColumn className="text-xs text-center text-white  bg-blue-700">
            PDF
          </TableColumn>
          <TableColumn className="text-xs text-white  bg-blue-700">
            Acciones
          </TableColumn>
        </TableHeader>
        <TableBody>
          {ordenCompras?.map((ordenCompra, index) => (
            <TableRow key={ordenCompra.id}>
              <TableCell className=" text-xs  ">{index + 1}</TableCell>
              <TableCell className=" min-w-[90px]   text-xs  ">
                {formatDate(ordenCompra.fechaEmision)}
              </TableCell>
              <TableCell className="  min-w-[200px]  text-xs  ">
                {ordenCompra.proveedor.nombreApellidos ||
                  ordenCompra.proveedor.nombreComercial}
              </TableCell>

              <TableCell className="  text-xs  ">
                {ordenCompra.tipo_productos}
              </TableCell>
              <TableCell className="  text-xs  ">
                {ordenCompra.formaPago}
              </TableCell>

              <TableCell className="  text-xs  ">
                {ordenCompra.moneda}
              </TableCell>

              <TableCell className=" min-w-[110px]  text-xs  ">
                S/. {formatNumber(ordenCompra.saldoInicial)}
              </TableCell>
              <TableCell className="  text-xs  ">
                {ordenCompra.banco_beneficiario || "-"}
              </TableCell>
              <TableCell className="  text-xs  ">
                {ordenCompra.nro_cuenta_bco || "-"}
              </TableCell>
              <TableCell className="min-w-[110px]  text-xs  ">
                S/. {formatNumber(ordenCompra.saldo)}
              </TableCell>
              <TableCell
                className={`${
                  ordenCompra.estadoPago === "PENDIENTE"
                    ? "text-red-500"
                    : "text-blue-500"
                }  text-xs  font-semibold `}
              >
                {ordenCompra.estadoPago}
              </TableCell>
              <TableCell
                className={`${
                  ordenCompra.comprobante?.status === "Activo"
                    ? "text-green-600"
                    : "text-red-500"
                }  text-xs  font-semibold `}
              >
                {ordenCompra.comprobante?.status}
              </TableCell>
              <TableCell className="  text-xs  ">
                <div className="flex gap-2">
                  <Button
                    className="scale-85"
                    size="sm"
                    color="danger"
                    onPress={() => {
                      setSelectOrdenCompra(ordenCompra);
                      setSelectModal("pdf");
                      onOpen();
                    }}
                  >
                    SOLPED
                  </Button>

                  {ordenCompra.solped_adjunto && (
                    <a
                      href={`${import.meta.env.VITE_LARAVEL_URL}/solped/${
                        ordenCompra?.solped_adjunto
                      }`}
                      target="_blank"
                    >
                      <Button className="scale-85" size="sm" color="danger">
                        Ver COMP. P
                      </Button>
                    </a>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col  items-center">
                  {ordenCompra.comprobanteOrdenCompraId === null ? (
                    <Link
                      to={`/compras/comprobante-orden-compra/${ordenCompra.id}`}
                    >
                      <Button className="scale-85" size="sm" color="primary">
                        Generar Comprobante
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex ">
                      <Button
                        className="scale-85 text-white"
                        size="sm"
                        color="success"
                        onPress={() => {
                          setSelectOrdenCompra(ordenCompra);
                          setSelectModal("verComprobante");
                          onOpen();
                        }}
                      >
                        Ver Comprobante
                      </Button>
                      <Button
                        className="scale-85 text-white"
                        size="sm"
                        color="warning"
                        onPress={() => {
                          setSelectOrdenCompra(ordenCompra);
                          setSelectModal("editarComprobante");
                          onOpen();
                        }}
                      >
                        Editar C.
                      </Button>
                    </div>
                  )}
                  <div className="flex">
                    <Link to={`/compras/editar/orden-compra/${ordenCompra.id}`}>
                      <Button className="scale-85" size="sm" color="primary">
                        Editar
                      </Button>
                    </Link>
                    {ordenCompra.comprobanteOrdenCompraId !== null &&
                      ordenCompra.comprobante.status === "Activo" && (
                        <Button
                          className="scale-85 text-white"
                          size="sm"
                          color="warning"
                          onPress={() => {
                            setSelectOrdenCompra(ordenCompra.comprobante);
                            onOpen();
                            setSelectModal("anular");
                          }}
                        >
                          Anular
                        </Button>
                      )}
                  </div>
                  <Button
                    className="scale-85 text-white"
                    size="sm"
                    color="danger"
                    onPress={() => {
                      setSelectOrdenCompra(ordenCompra);
                      setSelectModal("adjuntar_solped");
                      onOpen();
                    }}
                  >
                    Comprobante de Pago
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TablaOrdenCompras;
