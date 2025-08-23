import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
} from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import config from "../../../../../../utils/getToken";
import Loading from "../../../../../../hooks/Loading";

const HistorialDescansoMedico = ({ colaboradorId }) => {
  const [descansosMedicos, setDescansosMedicos] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleFindDescanzoMedicos = () => {
    setLoading(true);
    const url = `${
      import.meta.env.VITE_URL_API
    }/rrhh/descanso-medico/colaborador/${colaboradorId}`;

    axios
      .get(url, config)
      .then((res) => {
        setDescansosMedicos(res.data.descansoMedicos);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleFindDescanzoMedicos();
  }, [colaboradorId]);

  return (
    <div className="w-full flex items-center">
      {loading && <Loading />}
      <Table
        aria-label="Tabla de itinerarios"
        color="default"
        isStriped
        classNames={{
          base: "min-w-full  max-h-[75vh]  p-4 ",
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
            DIAGNOSTICO
          </TableColumn>
          <TableColumn className=" text-xs text-white  bg-blue-700">
            PERIODO DE INICIO
          </TableColumn>
          <TableColumn className=" text-xs text-white  bg-blue-700">
            PERIODO FINAL
          </TableColumn>
          <TableColumn className=" text-xs text-white  bg-blue-700">
            VER DOCUMENTO
          </TableColumn>
          <TableColumn className=" text-xs text-white  bg-blue-700">
            ESTADO
          </TableColumn>
          {/* <TableColumn className=" text-xs text-white  bg-blue-700">
                  ACCIONES
                </TableColumn> */}
        </TableHeader>
        <TableBody>
          {descansosMedicos?.map((descanzoMedico, index) => (
            <TableRow key={descanzoMedico.id}>
              <TableCell className="text-xs py-2">{index + 1}</TableCell>
              <TableCell className="text-xs py-2">
                {descanzoMedico.titulo_descanso_medico}
              </TableCell>
              <TableCell className="text-xs py-2">
                {descanzoMedico.periodo_inicio}
              </TableCell>
              <TableCell className="text-xs py-2">
                {descanzoMedico.periodo_final}
              </TableCell>
              <TableCell className="text-xs py-2 ">
                <a
                  href={`${import.meta.env.VITE_LARAVEL_URL}/descanzoMedico/${
                    descanzoMedico?.archivo_descanso_medico
                  }`}
                  target="_blank"
                >
                  {" "}
                  <Button size="sm" color="primary">
                    Ver documento
                  </Button>
                </a>
              </TableCell>
              <TableCell className="text-xs py-2">
                <p
                  className={`font-semibold ${
                    descanzoMedico.pendiente_autorizacion === "PENDIENTE"
                      ? "text-amber-400"
                      : descanzoMedico.pendiente_autorizacion === "ACEPTADO"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {descanzoMedico.pendiente_autorizacion}
                </p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default HistorialDescansoMedico;
