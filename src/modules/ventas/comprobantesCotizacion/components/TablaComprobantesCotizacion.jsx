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

const TablaComprobantesCotizacion = ({
  comprobantes,
  loading,
  onOpen,
  setSelectModal,
  setSelectComprobante,
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
                saldo
              </TableColumn>
              <TableColumn className=" text-xs text-white  bg-blue-700">
                Archivos
              </TableColumn>
              {/* <TableColumn className=" text-xs text-white  bg-blue-700">
                Acciones
              </TableColumn> */}
            </TableHeader>
            <TableBody>
              {comprobantes?.map((comprobante, index) => (
                <TableRow key={comprobante.id}>
                  <TableCell className="min-w-[80px] text-xs  z-10 bg-white">
                    {index + 1}
                  </TableCell>
                  <TableCell className=" min-w-[100px]  text-xs   z-10 bg-white">
                    {formatDate(comprobante.fechaEmision)}
                  </TableCell>
                  <TableCell className=" min-w-[150px] text-[0.7rem]   z-10 bg-white">
                    {comprobante.vendedor}
                  </TableCell>

                  <TableCell className=" min-w-[150px] text-[0.7rem]   z-10 bg-white">
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
                  <TableCell className=" min-w-[80px] text-xs   z-10 bg-white ">
                    S/.{comprobante?.cotizacion?.saldo}
                  </TableCell>
                  <TableCell className=" min-w-[180px] text-xs   z-10 bg-white">
                    <div className="w-full flex flex-wrap items-center justify-center">
                      {comprobante.urlXml !== null && (
                        <a
                          href={`${baseUrl + comprobante.urlXml}`}
                          target="_blank"
                        >
                          <Button
                            className="scale-85 text-white"
                            size="sm"
                            color="success"
                          >
                            XML
                          </Button>
                        </a>
                      )}
                      <Button
                        className="scale-85"
                        size="sm"
                        color="danger"
                        onClick={() => {
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
                  {/* <TableCell className=" min-w-[80px] text-xs   z-10 bg-white ">
                    -
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TablaComprobantesCotizacion;
