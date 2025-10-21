import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Link } from "react-router-dom";
import formatDate from "../../../../hooks/FormatDate";
import { formatNumber } from "../../../../assets/formats";

const TablaCotizaciones = ({
  cotizaciones,
  loading,
  onOpen,
  setSelectModal,
  setSelectCotizacion,
  userData,
}) => {
  return (
    <div className="w-full flex items-center">
      {loading ? (
        <Spinner className="m-auto" label="Cargando..." color="success" />
      ) : (
        <div className="w-full ">
          <Table
            aria-label="Tabla de itinerarios"
            color="default"
            isStriped
            classNames={{
              base: "min-w-full  max-h-[70vh]  overflow-scroll   p-4 ",
              wrapper: "p-0",
            }}
            radius="sm"
            isCompact={true}
            isHeader
          >
            <TableHeader>
              <TableColumn className=" text-xs text-white  bg-blue-700">
                #
              </TableColumn>

              <TableColumn className=" text-xs text-white  bg-blue-700">
                Fecha <br />
                Emisión
              </TableColumn>
              <TableColumn className=" text-xs text-white  bg-blue-700">
                Vendedor
              </TableColumn>
              <TableColumn className=" text-xs text-white  bg-blue-700">
                Cliente
              </TableColumn>

              <TableColumn className="text-xs text-white  bg-blue-700">
                T.Gravado
              </TableColumn>
              <TableColumn className="text-xs text-white  bg-blue-700">
                T.Igv
              </TableColumn>
              <TableColumn className="text-xs text-white  bg-blue-700">
                Total
              </TableColumn>
              <TableColumn className="text-xs text-white  bg-blue-700">
                Saldo
              </TableColumn>
              <TableColumn className=" text-xs text-white  bg-blue-700">
                Estado de Pago
              </TableColumn>
              <TableColumn className=" text-xs text-white  bg-blue-700">
                Tipo de
                <br /> Comprobante
              </TableColumn>
              <TableColumn className=" text-xs text-white  bg-blue-700">
                PDF
              </TableColumn>
              <TableColumn className=" text-xs text-white  bg-blue-700">
                Estado <br /> Cotización
              </TableColumn>
              <TableColumn className=" text-xs text-white  bg-blue-700">
                Acciones
              </TableColumn>
            </TableHeader>
            <TableBody>
              {cotizaciones?.map((cotizacion, index) => (
                <TableRow key={cotizacion.id}>
                  <TableCell className="min-w-[80px] text-xs   bg-white">
                    {index + 1}
                  </TableCell>
                  <TableCell className=" min-w-[100px]  text-xs    bg-white">
                    {formatDate(cotizacion.fechaEmision)}
                  </TableCell>
                  <TableCell className=" min-w-[150px] text-xs    bg-white">
                    {cotizacion.vendedor}
                  </TableCell>
                  <TableCell className=" min-w-[150px] text-[0.7rem]    bg-white">
                    {cotizacion.cliente.nombreApellidos ||
                      cotizacion.cliente.nombreComercial}{" "}
                    <br />
                    <b>{cotizacion.cliente.numeroDoc}</b>
                  </TableCell>

                  <TableCell className=" min-w-[110px]  text-xs  ">
                    S/. {formatNumber(Number(cotizacion?.saldoInicial) / 1.18)}
                  </TableCell>
                  <TableCell className=" min-w-[110px]  text-xs  ">
                    S/.{" "}
                    {formatNumber(
                      (Number(cotizacion?.saldoInicial) / 1.18) * 0.18
                    )}
                  </TableCell>
                  <TableCell className=" min-w-[110px]  text-xs  ">
                    S/. {formatNumber(cotizacion.saldoInicial)}
                  </TableCell>
                  <TableCell className="min-w-[110px]  text-xs  ">
                    S/. {formatNumber(cotizacion.saldo)}
                  </TableCell>
                  <TableCell
                    className={`${
                      cotizacion.estadoPago === "PENDIENTE"
                        ? "text-red-500"
                        : "text-blue-500"
                    }  text-xs  font-semibold `}
                  >
                    {cotizacion.estadoPago}
                  </TableCell>
                  <TableCell className=" min-w-[80px] text-xs    bg-white ">
                    {cotizacion?.ComprobanteElectronico?.tipoComprobante ||
                      "sin comprobante"}
                  </TableCell>
                  <TableCell className=" min-w-[80px] text-xs    bg-white">
                    <Button
                      className="scale-85"
                      size="sm"
                      color="danger"
                      onPress={() => {
                        setSelectCotizacion(cotizacion);
                        setSelectModal("pdf");
                        onOpen();
                      }}
                    >
                      PDF
                    </Button>
                  </TableCell>
                  <TableCell
                    className={` min-w-[80px] text-xs font-bold   bg-white ${
                      cotizacion?.status === "Activo"
                        ? "text-green-500"
                        : "text-red-500"
                    } `}
                  >
                    {cotizacion?.status}
                  </TableCell>
                  <TableCell className=" min-w-[80px] text-xs    bg-white ">
                    {(userData?.role === "GERENTE" ||
                      userData?.role === "CONTADOR" ||
                      userData?.role === "PRACTICANTE CONTABLE") && (
                      <div className="flex flex-col  items-center">
                        {cotizacion.comprobanteElectronicoId ? (
                          <Button
                            className="scale-85 text-white"
                            size="sm"
                            color="warning"
                            onPress={() => {
                              setSelectCotizacion(cotizacion);
                              setSelectModal("verComprobante");
                              onOpen();
                            }}
                          >
                            Ver Comprobante
                          </Button>
                        ) : (
                          <Button
                            className="scale-85"
                            size="sm"
                            color="primary"
                            onPress={() => {
                              setSelectCotizacion(cotizacion);
                              setSelectModal("comprobante");
                              onOpen();
                            }}
                          >
                            Generar Comprobante
                          </Button>
                        )}
                        <div>
                          <Link
                            to={`/ventas/editar-cotizacion/${cotizacion.id}`}
                          >
                            <Button
                              className="scale-85"
                              size="sm"
                              color="primary"
                              // onClick={() => {
                              //   setSelectCotizacion(cotizacion);
                              //   setSelectModal("comprobante");
                              //   onOpen();
                              // }}
                            >
                              Editar
                            </Button>
                          </Link>
                          {!cotizacion.comprobanteElectronicoId &&
                            cotizacion.status === "Activo" && (
                              <Button
                                className="scale-85"
                                size="sm"
                                color="danger"
                                onClick={() => {
                                  setSelectCotizacion(cotizacion);
                                  setSelectModal("anular");
                                  onOpen();
                                }}
                              >
                                Anular
                              </Button>
                            )}
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TablaCotizaciones;
