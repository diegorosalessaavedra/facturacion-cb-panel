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

const TablaSolicitudesVacaciones = ({
  loading,
  solicitudesVacaciones,
  onOpen,
  setSelectSolicitdesVacaciones,
  setSelectModal,
}) => {
  return (
    <div>
      {loading ? (
        <Spinner className="m-auto" label="Cargando..." color="success" />
      ) : (
        <Table
          aria-label="Tabla de itinerarios"
          color="default"
          isStriped
          classNames={{
            base: "min-w-full   h-[75vh]   p-4 ",
            wrapper: "p-0",
          }}
          radius="sm"
          isCompact={true}
          isHeaderSticky
        >
          <TableHeader>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              #
            </TableColumn>

            <TableColumn className=" text-xs text-white  bg-blue-700">
              NOMBRE Y APELLIDO
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              FECHA DE <br /> SOLICITUD
            </TableColumn>

            <TableColumn className=" text-xs text-white  bg-blue-700">
              ARCHIVO ADJUNTO
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              FECHA DE INICO
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              FECHA FINAL
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              DIAS TOTALES
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              ESTADO
            </TableColumn>
          </TableHeader>
          <TableBody>
            {solicitudesVacaciones?.map((vacacionesSolicitada, index) => (
              <TableRow key={vacacionesSolicitada.id}>
                <TableCell className="text-xs py-2">{index + 1}</TableCell>
                <TableCell className="text-xs py-2">
                  {vacacionesSolicitada.colaborador.nombre_colaborador}{" "}
                  {vacacionesSolicitada.colaborador.apellidos_colaborador}
                </TableCell>

                <TableCell className="text-xs py-2">
                  {vacacionesSolicitada.fecha_solicitud}
                </TableCell>

                <TableCell className="text-xs py-2">
                  <a
                    href={`${import.meta.env.VITE_LARAVEL_URL}/solped/${
                      vacacionesSolicitada?.solicitud_adjunto
                    }`}
                    target="_blank"
                  >
                    <Button size="sm" color="primary">
                      Ver archivo
                    </Button>
                  </a>
                </TableCell>
                <TableCell className="text-xs py-2">
                  {vacacionesSolicitada.fecha_inicio}
                </TableCell>
                <TableCell className="text-xs py-2">
                  {vacacionesSolicitada.fecha_final}
                </TableCell>
                <TableCell className="text-xs py-2  text-blue-500">
                  {vacacionesSolicitada.dias_totales} días
                </TableCell>

                <TableCell className="text-xs py-2">
                  <Button
                    className={`text-white text-xs ${
                      vacacionesSolicitada.pendiente_autorizacion ===
                      "PENDIENTE"
                        ? "bg-amber-400"
                        : vacacionesSolicitada.pendiente_autorizacion ===
                          "ACEPTADO"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                    size="sm"
                    onPress={() => {
                      setSelectSolicitdesVacaciones(vacacionesSolicitada);
                      setSelectModal("cambiar_estado");
                      onOpen();
                    }}
                  >
                    {vacacionesSolicitada.pendiente_autorizacion}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TablaSolicitudesVacaciones;
