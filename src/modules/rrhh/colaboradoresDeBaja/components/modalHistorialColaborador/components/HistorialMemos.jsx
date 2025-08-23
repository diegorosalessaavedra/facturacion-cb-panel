import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@nextui-org/react";

const HistorialMemos = ({ memos }) => {
  return (
    <Table
      aria-label="Tabla de itinerarios"
      color="default"
      isStriped
      classNames={{
        base: "min-w-full  max-h-[75vh]   p-4 ",
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
        {memos?.map((memo, index) => (
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
  );
};

export default HistorialMemos;
