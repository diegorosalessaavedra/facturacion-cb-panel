import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import ModalEliminarDMedico from "./components/ModalEliminarDMedico";
import axios from "axios";
import config from "../../../../../utils/getToken";
import Loading from "../../../../../hooks/Loading";
import ModalSolicitarVacaciones from "./components/ModalSolicitarVacaciones";

const ModalVerPeriodo = ({
  isOpen,
  onOpenChange,
  selectPeriodo,
  selectColaborador,
}) => {
  const {
    isOpen: isOpenDM,
    onOpen,
    onOpenChange: onOpenChangeDM,
  } = useDisclosure();
  const [selectModal, setSelectModal] = useState();
  const [vacionesSolicitadas, setVacacionesSolicitadas] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleFindDescanzoMedicos = () => {
    setLoading(true);
    const url = `${
      import.meta.env.VITE_URL_API
    }/rrhh/vacaciones-solicitadas/periodo/${selectPeriodo?.id}`;

    axios
      .get(url, config)
      .then((res) => {
        setVacacionesSolicitadas(res.data.vacionesSolicitadas);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleFindDescanzoMedicos();
  }, [selectColaborador?.id]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="5xl"
    >
      <ModalContent>
        <ModalBody>
          {loading && <Loading />}
          <div className="w-full flex flex-col items-start pt-4">
            <div className="w-full flex items-center justify-between p-2">
              <h3 className="text-base font-semibold">
                Solicitudes de Vacaciones{" "}
                {selectColaborador?.nombre_colaborador}{" "}
                {selectColaborador?.apellidos_colaborador}
              </h3>
              <Button
                className="bg-neutral-900"
                size="sm"
                color="primary"
                onPress={() => {
                  setSelectModal("nuevo");
                  onOpen();
                }}
              >
                Nueva Solicitud
              </Button>
            </div>
            <h4>{selectPeriodo.dias_disponibles} días disponibles</h4>
            <Table
              aria-label="Tabla de itinerarios"
              color="default"
              isStriped
              classNames={{
                base: "min-w-full  overflow-hidden  ",
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
                  FECHA DE SOLICITUD
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
                  ESTADO <br /> DEL PERMISO
                </TableColumn>
              </TableHeader>
              <TableBody>
                {vacionesSolicitadas?.map((vacacionesSolicitada, index) => (
                  <TableRow key={vacacionesSolicitada.id}>
                    <TableCell className="text-xs py-2">{index + 1}</TableCell>
                    <TableCell className="text-xs py-2">
                      {vacacionesSolicitada.fecha_solicitud}
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
                        className={`${
                          vacacionesSolicitada.pendiente_autorizacion ===
                          "PENDIENTE"
                            ? "text-amber-400"
                            : vacacionesSolicitada.pendiente_autorizacion ===
                              "ACEPTADO"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {vacacionesSolicitada.pendiente_autorizacion}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {selectModal === "nuevo" && (
            <ModalSolicitarVacaciones
              isOpen={isOpenDM}
              onOpenChange={onOpenChangeDM}
              selectPeriodo={selectPeriodo}
              selectColaborador={selectColaborador}
              handleFindDescanzoMedicos={handleFindDescanzoMedicos}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <div className="w-full flex items-center justify-end gap-3 p-4">
            <Button
              color="primary"
              onPress={() => {
                onOpenChange();
              }}
            >
              Cerrar
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalVerPeriodo;
