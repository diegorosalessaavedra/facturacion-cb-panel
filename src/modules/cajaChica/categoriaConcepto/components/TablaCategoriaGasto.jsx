import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";

const TablaCategoriaGasto = ({
  categorias,
  setSelectCategoria,
  setSelectModal,
  onOpen,
}) => {
  return (
    <div className="w-1/2 flex flex-col gap-2">
      <article className="flex items-start justify-between">
        <h2 className="font-semibold text-md">CATEGORÍAS DEL GASTO</h2>
        <Button
          className="bg-slate-900"
          onPress={() => {
            setSelectModal("create_categoria");
            onOpen();
          }}
          color="primary"
          size="sm"
          startContent={<FaPlus />}
        >
          Categoría de Gasto
        </Button>
      </article>
      <Table
        aria-label="Tabla de itinerarios"
        color="default"
        isStriped
        classNames={{
          base: "min-w-full min-h-full overflow-y-auto",
          wrapper: "p-0",
        }}
        radius="sm"
        isCompact={true}
        isHeaderSticky
        shadow="md"
      >
        <TableHeader>
          <TableColumn className=" text-xs text-white  bg-slate-900">
            Nº
          </TableColumn>

          <TableColumn className=" text-xs text-white  bg-slate-900">
            CATEGORIA
          </TableColumn>
          <TableColumn className=" text-xs text-white  bg-slate-900">
            SUGERENCIA PARA DETALLE
          </TableColumn>

          <TableColumn className=" text-xs text-white  bg-slate-900">
            ACCIONES
          </TableColumn>
        </TableHeader>
        <TableBody>
          {categorias?.map((categoria, index) => (
            <TableRow key={categoria.id}>
              <TableCell className="text-[11px] py-2">{index + 1}</TableCell>
              <TableCell className="text-[11px] py-2 text-nowrap">
                {categoria.categoria}
              </TableCell>
              <TableCell className="text-[11px] py-2">
                {categoria.sugerencia_detalle}
              </TableCell>
              <TableCell className="text-[11px] py-2">
                <div className="flex gap-2 items-center">
                  <FaEdit
                    className="text-xl text-blue-500 cursor-pointer"
                    onClick={() => {
                      setSelectModal("update_categoria");
                      setSelectCategoria(categoria);
                      onOpen();
                    }}
                  />
                  <FaTrashAlt
                    className="text-lg text-red-500 cursor-pointer"
                    onClick={() => {
                      setSelectModal("delete_categoria");
                      setSelectCategoria(categoria);
                      onOpen();
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TablaCategoriaGasto;
