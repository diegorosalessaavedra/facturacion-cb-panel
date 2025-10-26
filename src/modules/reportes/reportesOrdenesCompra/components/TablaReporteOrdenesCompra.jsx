import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import {
  formatNumber,
  formatNumberSinDecimales,
} from "../../../../assets/formats";
import formatDate from "../../../../hooks/FormatDate";
import { FaCheck } from "react-icons/fa";

const TablaReporteOrdenesCompra = ({
  ordenesCompra,
  loading,
  setSelectOrdenCompra,
  onOpen,
}) => {
  return (
    <div className="w-full h-full flex items-center">
      {loading ? (
        <Spinner className="m-auto" label="Cargando..." color="success" />
      ) : (
        <div className="w-full ">
          <Table
            aria-label="Tabla de itinerarios"
            color="default"
            isStriped
            classNames={{
              base: "min-w-full  h-[70vh] overflow-auto  p-4 ",
              wrapper: "p-0",
            }}
            radius="sm"
            isCompact={true}
            isHeaderSticky
          >
            <TableHeader>
              <TableColumn className="text-xs text-white bg-blue-700">
                #
              </TableColumn>

              <TableColumn className="text-xs text-white bg-blue-700">
                Fecha <br />
                Emisión
              </TableColumn>
              <TableColumn className="text-xs text-white bg-blue-700">
                Fecha <br />
                Vencimiento
              </TableColumn>
              <TableColumn className="text-xs text-white bg-blue-700">
                Proveedor
              </TableColumn>
              <TableColumn className="text-xs text-white bg-blue-700">
                Forma de Pago
              </TableColumn>
              <TableColumn className="text-xs text-white bg-blue-700">
                Moneda
              </TableColumn>
              <TableColumn className="text-xs text-white bg-blue-700">
                Descripción
              </TableColumn>
              <TableColumn className="text-xs text-white bg-blue-700">
                Precio Unitario
              </TableColumn>
              <TableColumn className="text-xs text-white bg-blue-700">
                Total
              </TableColumn>
              <TableColumn className="text-xs text-white bg-blue-700">
                Saldo
              </TableColumn>
              <TableColumn className="text-xs text-white bg-blue-700">
                Estado de <br /> pago
              </TableColumn>
              <TableColumn className="text-xs text-white bg-blue-700">
                Banco
              </TableColumn>
              <TableColumn className="text-xs text-white bg-blue-700">
                Nro cuenta
              </TableColumn>
              <TableColumn className="text-xs text-white bg-blue-700">
                Validación
              </TableColumn>
            </TableHeader>
            <TableBody>
              {ordenesCompra?.map((ordenCompra, index) => (
                <TableRow key={ordenCompra.id}>
                  <TableCell className=" text-xs  ">{index + 1}</TableCell>
                  <TableCell className=" min-w-[90px]   text-xs  ">
                    {formatDate(ordenCompra.fechaEmision)}
                  </TableCell>
                  <TableCell className=" min-w-[90px]   text-xs  ">
                    {formatDate(ordenCompra.fechaVencimiento)}
                  </TableCell>
                  <TableCell className="  min-w-[200px]  text-xs  ">
                    {ordenCompra.proveedor.nombreApellidos ||
                      ordenCompra.proveedor.nombreComercial}
                  </TableCell>
                  <TableCell className="  text-xs  ">
                    {ordenCompra.formaPago}
                  </TableCell>
                  <TableCell className="  text-xs  ">
                    {ordenCompra.moneda}
                  </TableCell>
                  <TableCell className="  text-xs   text-nowrap">
                    <ul>
                      {ordenCompra.productos.map((producto) => (
                        <li key={producto?.id}>
                          {formatNumberSinDecimales(producto?.cantidad)} -{" "}
                          {producto?.producto?.tipo_producto ===
                          "Costos y gastos"
                            ? producto?.descripcion_producto
                            : producto?.producto.nombre}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="  text-xs   text-nowrap">
                    <ul>
                      {ordenCompra.productos.map((producto) => (
                        <li key={producto?.id}>
                          S/ {producto?.precioUnitario}
                        </li>
                      ))}
                    </ul>
                  </TableCell>

                  <TableCell className=" min-w-[110px]  text-xs  ">
                    S/. {formatNumber(ordenCompra.saldoInicial)}
                  </TableCell>
                  <TableCell className="min-w-[110px]  text-xs  ">
                    S/. {formatNumber(ordenCompra.saldo)}
                  </TableCell>
                  <TableCell className="  text-xs  ">
                    {ordenCompra.estadoPago}
                  </TableCell>
                  <TableCell className="  text-xs  ">
                    {ordenCompra.banco_beneficiario || "-"}
                  </TableCell>
                  <TableCell className="  text-xs  ">
                    {ordenCompra.nro_cuenta_bco || "-"}
                  </TableCell>
                  <TableCell className="  text-xs  text-center ">
                    <button
                      className={`w-4 h-4 border-1.5 p-0.5 flex items-center justify-center ${
                        ordenCompra.validacion_ingrid
                          ? "border-blue-500"
                          : "border-neutral-400"
                      }  rounded-sm`}
                      onClick={() => {
                        setSelectOrdenCompra(ordenCompra);
                        onOpen();
                      }}
                    >
                      {ordenCompra.validacion_ingrid ? (
                        <FaCheck className="text-blue-500" />
                      ) : (
                        ""
                      )}
                    </button>
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

export default TablaReporteOrdenesCompra;
