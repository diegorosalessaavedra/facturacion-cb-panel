import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@nextui-org/react";

const ModalVerMemos = ({ isOpen, onOpenChange, selectColaborador }) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="md"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-base">
          memos del colaborador {selectColaborador.nombre_colaborador}
        </ModalHeader>
        <ModalBody>
          <Table
            aria-label="Tabla de itinerarios"
            color="default"
            isStriped
            classNames={{
              base: "min-w-full  max-h-[75vh] p-4 ",
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
                ARCHIVO ADJUNTO
              </TableColumn>
            </TableHeader>
            <TableBody>
              {selectColaborador.memos?.map((memo, index) => (
                <TableRow key={memo.id}>
                  <TableCell className="text-xs py-2">{index + 1}</TableCell>

                  <TableCell className="text-xs py-2">
                    <a
                      href={`${import.meta.env.VITE_LARAVEL_URL}/memos/${
                        memo.documento_memo
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Chip color="danger" size="sm">
                        Ver Archivo{" "}
                      </Chip>
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            type="button"
            onPress={() => {
              onOpenChange();
              reset();
            }}
          >
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalVerMemos;
