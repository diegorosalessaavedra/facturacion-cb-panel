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

const TablaSolicitudesDescansoMedico = ({
  loading,
  solicitudesDescansoMedico,
  onOpen,
  setSelectDescansoMedico,
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
            base: "min-w-full  overflow-hidden  p-4 ",
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
              FECHA DE INICO
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              FECHA FINAL
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              ARCHIVO ADJUNTO
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              DIAGNOSTICO
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              ESTADO
            </TableColumn>
          </TableHeader>
          <TableBody>
            {solicitudesDescansoMedico?.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="text-xs py-2">{index + 1}</TableCell>
                <TableCell className="text-xs py-2">
                  {item.colaborador.nombre_colaborador}{" "}
                  {item.colaborador.apellidos_colaborador}
                </TableCell>

                <TableCell className="text-xs py-2">
                  {item.fecha_solicitud}
                </TableCell>

                <TableCell className="text-xs py-2">
                  {item.periodo_inicio}
                </TableCell>
                <TableCell className="text-xs py-2">
                  {item.periodo_final}
                </TableCell>
                <TableCell className="text-xs py-2">
                  <a
                    href={`${import.meta.env.VITE_LARAVEL_URL}/descanzoMedico/${
                      item?.archivo_descanso_medico
                    }`}
                    target="_blank"
                  >
                    {" "}
                    <Button size="sm" color="primary">
                      Ver documento
                    </Button>
                  </a>{" "}
                </TableCell>

                <TableCell className="text-xs py-2  text-blue-500">
                  {item.titulo_descanso_medico}{" "}
                </TableCell>

                <TableCell className="text-xs py-2">
                  <Button
                    className={`text-white text-xs ${
                      item.pendiente_autorizacion === "PENDIENTE"
                        ? "bg-amber-400"
                        : item.pendiente_autorizacion === "ACEPTADO"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                    size="sm"
                    onPress={() => {
                      setSelectDescansoMedico(item);
                      setSelectModal("cambiar_estado");
                      onOpen();
                    }}
                  >
                    {item.pendiente_autorizacion}
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

export default TablaSolicitudesDescansoMedico;
