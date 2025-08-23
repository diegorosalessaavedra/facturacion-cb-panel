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

const TablaDescansoMedicos = ({
  onOpen,
  descansoMedicos,
  loading,
  setSelectColaborador,
  setSelectModal,
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
              DESCANSOS MEDICOS
            </TableColumn>
            <TableColumn className=" text-xs text-center text-white  bg-blue-700">
              AGREGAR <br />
              DESCANSO MEDICO
            </TableColumn>
          </TableHeader>
          <TableBody>
            {descansoMedicos?.map((colaborador, index) => (
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
                <TableCell className="text-xs py-2 text-center">
                  <Button
                    onPress={() => {
                      setSelectModal("verMas");
                      setSelectColaborador(colaborador);
                      onOpen();
                    }}
                    size="sm"
                    color="primary"
                  >
                    Ver D. Medicos
                  </Button>
                </TableCell>
                <TableCell className="text-xs py-2 text-center">
                  <Button
                    onPress={() => {
                      setSelectModal("nuevo");
                      setSelectColaborador(colaborador);
                      onOpen();
                    }}
                    size="sm"
                    color="primary"
                    className="bg-neutral-900"
                  >
                    Agregar D. Medico
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

export default TablaDescansoMedicos;
