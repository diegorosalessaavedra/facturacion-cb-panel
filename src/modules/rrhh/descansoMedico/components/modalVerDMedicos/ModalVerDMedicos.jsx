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

const ModalVerDMedicos = ({ isOpen, onOpenChange, selectColaborador }) => {
  const {
    isOpen: isOpenDM,
    onOpen,
    onOpenChange: onOpenChangeDM,
  } = useDisclosure();
  const [descansosMedicos, setDescansosMedicos] = useState([]);
  const [selectDMedico, setSelectDMedico] = useState();
  const [loading, setLoading] = useState(true);

  const handleFindDescanzoMedicos = () => {
    setLoading(true);
    const url = `${
      import.meta.env.VITE_URL_API
    }/rrhh/descanso-medico/colaborador/${selectColaborador?.id}`;

    axios
      .get(url, config)
      .then((res) => {
        setDescansosMedicos(res.data.descansoMedicos);
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
        <ModalHeader className="flex flex-col gap-1 text-base">
          Descansos Medicos {selectColaborador?.nombre_colaborador}{" "}
          {selectColaborador?.apellidos_colaborador}
        </ModalHeader>
        <ModalBody>
          {loading && <Loading />}
          <div className="w-full flex items-center">
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
                        href={`${
                          import.meta.env.VITE_LARAVEL_URL
                        }/descanzoMedico/${
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
                            : descanzoMedico.pendiente_autorizacion ===
                              "ACEPTADO"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {descanzoMedico.pendiente_autorizacion}
                      </p>
                    </TableCell>
                    {/* 
                    <TableCell className="text-xs py-2">
                      <div className="flex gap-4 items-center">
                        <Tooltip content="Eliminar" showArrow={true}>
                          <span>
                            <FaTrashAlt
                              className="text-lg text-red-500 cursor-pointer"
                              onClick={() => {
                                setSelectDMedico(descanzoMedico);
                                onOpen();
                              }}
                            />
                          </span>
                        </Tooltip>
                      </div>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ModalEliminarDMedico
            key={selectDMedico?.id}
            isOpen={isOpenDM}
            onOpenChange={onOpenChangeDM}
            selectDMedico={selectDMedico}
            handleFindDescanzoMedicos={handleFindDescanzoMedicos}
          />
        </ModalBody>
        <ModalFooter>
          <div className="w-full flex items-center justify-end gap-3 p-4">
            <Button
              color="danger"
              type="button"
              onPress={() => {
                onOpenChange();
              }}
            >
              Cancelar
            </Button>
            <Button color="primary" type="submit">
              Guardar
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalVerDMedicos;
