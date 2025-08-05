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
import formatDate from "../../../../hooks/FormatDate";
import { formatNumber } from "../../../../assets/formats";
import { Link } from "react-router-dom";

const TablaMisComprobantes = ({
  comprobantes,
  loading,
  onOpen,
  setSelectModal,
  setSelectComprobante,
  setSelectNota,
}) => {
  const baseUrl = import.meta.env.VITE_LARAVEL_URL;

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
              <TableColumn className=" text-xs text-white  bg-blue-700">
                Serie
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
                Cotizacion
              </TableColumn>
              <TableColumn className="text-xs text-white  bg-blue-700">
                Estado del comprobante
              </TableColumn>
              <TableColumn className=" text-xs text-white  bg-blue-700">
                Notas de credito <br /> y debito
              </TableColumn>
              <TableColumn className=" text-xs text-white  bg-blue-700">
                Archivos
              </TableColumn>
              <TableColumn className=" text-xs text-white  bg-blue-700">
                Acciones
              </TableColumn>
            </TableHeader>
            <TableBody>
              {comprobantes?.map((comprobante, index) => (
                <TableRow key={comprobante.id}>
                  <TableCell className="min-w-[80px] text-xs  z-10 ">
                    {index + 1}
                  </TableCell>
                  <TableCell className=" min-w-[100px]  text-xs   z-10 ">
                    {formatDate(comprobante.fechaEmision)}
                  </TableCell>
                  <TableCell className=" min-w-[150px] text-[0.7rem]   z-10 ">
                    {comprobante.vendedor}
                  </TableCell>

                  <TableCell className=" min-w-[150px] text-[0.7rem]   z-10 ">
                    {comprobante.cliente.nombreApellidos ||
                      comprobante.cliente.nombreComercial}{" "}
                    <br />
                    <b>{comprobante.cliente.numeroDoc}</b>
                  </TableCell>

                  <TableCell className=" min-w-[150px]  text-xs  ">
                    <b>
                      {comprobante.serie}-{comprobante.numeroSerie}
                    </b>
                    <br />
                    <span className="text-[0.6rem]">
                      {comprobante.tipoComprobante}
                    </span>
                  </TableCell>
                  <TableCell className=" min-w-[110px]  text-xs  ">
                    S/. {formatNumber(comprobante.total_valor_venta)}
                  </TableCell>
                  <TableCell className="min-w-[110px]  text-xs  ">
                    S/. {formatNumber(comprobante.total_igv)}
                  </TableCell>
                  <TableCell
                    className={`min-w-[110px]  text-xs  font-semibold `}
                  >
                    S/. {formatNumber(comprobante.total_venta)}
                  </TableCell>
                  <TableCell className=" min-w-[80px] text-xs">
                    {comprobante?.cotizacion?.saldo
                      ? "Con Cotizacion"
                      : "Sin Cotizacion"}
                  </TableCell>
                  <TableCell
                    className={`min-w-[80p ${
                      comprobante.estado === "ACEPTADA"
                        ? "text-green-600"
                        : "text-red-500"
                    }  text-xs  font-semibold `}
                  >
                    {comprobante?.estado}
                  </TableCell>
                  <TableCell className=" min-w-[80px] text-xs">
                    <div>
                      {comprobante.notas_comprobante ? (
                        <Button
                          className="scale-85"
                          size="sm"
                          color="primary"
                          onPress={() => {
                            setSelectNota(comprobante.notas_comprobante);
                            setSelectModal("verNota");
                            onOpen();
                          }}
                        >
                          {comprobante.notas_comprobante.tipo_nota ===
                          "NOTA DE CREDITO"
                            ? "VER NC"
                            : "VER NB"}
                        </Button>
                      ) : (
                        "-"
                      )}
                    </div>
                  </TableCell>
                  <TableCell className=" min-w-[180px] text-xs   ">
                    <div className="w-full flex flex-wrap items-center justify-center">
                      {comprobante.urlXml !== null && (
                        <Button
                          className="scale-85 text-white"
                          size="sm"
                          color="success"
                          onPress={async () => {
                            try {
                              const fileName = comprobante.urlXml
                                .split("/")
                                .pop();
                              const response = await fetch(
                                `${baseUrl}/api/download-xml?file=${encodeURIComponent(
                                  fileName
                                )}`,
                                {
                                  method: "GET",
                                  headers: {
                                    Accept: "application/xml",
                                  },
                                }
                              );

                              if (!response.ok)
                                throw new Error(
                                  "Error al descargar el archivo"
                                );

                              // Crear blob y descargar
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = fileName;
                              document.body.appendChild(a);
                              a.click();
                              window.URL.revokeObjectURL(url);
                              a.remove();
                            } catch (error) {
                              console.error("Error:", error);
                              // Aquí podrías mostrar una notificación al usuario
                            }
                          }}
                        >
                          XML
                        </Button>
                      )}
                      <Button
                        className="scale-85"
                        size="sm"
                        color="danger"
                        onPress={() => {
                          setSelectComprobante(comprobante);
                          setSelectModal("verComprobante");
                          onOpen();
                        }}
                      >
                        PDF
                      </Button>
                      {comprobante.cdr !== null && (
                        <a
                          href={`${baseUrl + comprobante.cdr}`}
                          target="_blank"
                        >
                          <Button
                            className="scale-85 text-white"
                            size="sm"
                            color="warning"
                          >
                            CDR
                          </Button>
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[80px] text-xs ">
                    <div className="w-full flex flex-wrap items-center justify-center">
                      {(() => {
                        if (comprobante.notas_comprobante !== null) {
                          return "-";
                        }

                        // 👇 CORRECCIÓN AQUÍ
                        if (
                          comprobante.tipoComprobante === "NOTA DE VENTA" ||
                          comprobante.tipoComprobante === "MERMA"
                        ) {
                          return (
                            <Button
                              className="scale-85"
                              size="sm"
                              color="warning"
                              onPress={() => {
                                setSelectModal("anular");
                                setSelectComprobante(comprobante);
                                onOpen();
                              }}
                            >
                              ANULAR
                            </Button>
                          );
                        }

                        if (comprobante.estado !== "ACEPTADA") {
                          return "-";
                        }

                        return (
                          <Link
                            to={`/comprobantes/nota-credito-debito/${comprobante.id}`}
                          >
                            <Button
                              className="scale-85"
                              size="sm"
                              color="danger"
                            >
                              NUEVA NOTA
                            </Button>
                          </Link>
                        );
                      })()}
                    </div>
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

export default TablaMisComprobantes;
