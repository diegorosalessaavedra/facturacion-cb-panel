import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import config from "../../../../../../utils/getToken";
import Loading from "../../../../../../hooks/Loading";

const HistorialVacaciones = ({ colaboradorId }) => {
  const [solicitudesVacaciones, setSolicitudesVacaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleFindDescanzoMedicos = () => {
    setLoading(true);
    const url = `${
      import.meta.env.VITE_URL_API
    }/rrhh/vacaciones-solicitadas/colaborador/${colaboradorId}`;

    axios
      .get(url, config)
      .then((res) => {
        setSolicitudesVacaciones(res.data.vacionesSolicitadas);
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
                {vacacionesSolicitada.fecha_solicitud}
              </TableCell>

              <TableCell className="text-xs py-2">
                <a
                  href={`${import.meta.env.VITE_LARAVEL_URL}/vacaciones/${
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
                <p
                  className={` text-xs ${
                    vacacionesSolicitada.pendiente_autorizacion === "PENDIENTE"
                      ? "text-amber-400"
                      : vacacionesSolicitada.pendiente_autorizacion ===
                        "ACEPTADO"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                  size="sm"
                >
                  {vacacionesSolicitada.pendiente_autorizacion}
                </p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default HistorialVacaciones;
