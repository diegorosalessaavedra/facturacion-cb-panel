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

const TablaVacaciones = ({
  onOpen,
  colaboradores,
  loading,
  setSelectModal,
  setSelectColaborador,
  setSelectPeriodo,
}) => {
  return (
    <div className="w-full flex items-center">
      {loading ? (
        <Spinner className="m-auto" label="Cargando..." color="success" />
      ) : (
        <Table
          aria-label="Tabla de itinerarios"
          color="default"
          isStriped
          classNames={{
            base: "min-w-full  h-[75vh]  p-4 ",
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
              DNI
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              TELÉFONO
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              CORREO
            </TableColumn>
            <TableColumn className=" text-xs text-white  bg-blue-700">
              PERIODOS
            </TableColumn>
          </TableHeader>
          <TableBody>
            {colaboradores?.map((colaborador, index) => (
              <TableRow key={colaborador.id}>
                <TableCell className="text-xs py-2">{index + 1}</TableCell>
                <TableCell className="text-xs py-2">
                  {colaborador.apellidos_colaborador}{" "}
                  {colaborador.nombre_colaborador}
                </TableCell>
                <TableCell className="text-xs py-2">
                  {colaborador.dni_colaborador}
                </TableCell>
                <TableCell className="text-xs py-2">
                  {colaborador.telefono_colaborador}
                </TableCell>
                <TableCell className="text-xs py-2">
                  {colaborador.correo_colaborador}
                </TableCell>
                <TableCell className="text-xs py-2 ">
                  <article className=" flex flex-wrap gap-2">
                    {colaborador.vacaciones.map((vacacion) => (
                      <Button
                        key={vacacion.id}
                        color={
                          vacacion.dias_disponibles === 0 ? "danger" : "success"
                        }
                        size="sm"
                        onPress={() => {
                          setSelectPeriodo(vacacion);
                          setSelectColaborador(colaborador);
                          setSelectModal("verPeriodo");
                          onOpen();
                        }}
                      >
                        {vacacion.periodo}
                      </Button>
                    ))}
                  </article>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TablaVacaciones;
