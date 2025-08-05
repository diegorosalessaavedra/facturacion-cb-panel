import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import ModalAgregarProducto from "../../../../creartCotizacion/components/FormCrearCotizacion/components/ModalAgregarProducto";
import ModalEditarProductoCotizacion from "../../../../creartCotizacion/components/FormCrearCotizacion/components/ModalEditarProductoCotizacion";
import { formatNumber } from "../../../../../../assets/formats";
import config from "../../../../../../utils/getToken";

const TablaEditarProducto = ({
  productos,
  setProductos,
  tipoOperacion,
  monto,
  tipo_productos,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectModal, setSelectModal] = useState();
  const [selectProduct, setSelectProduct] = useState();
  const [centroCostos, setCentroCostos] = useState([]);

  const eliminarProducto = (id) => {
    setProductos((prevProductos) =>
      prevProductos.filter((producto) => producto.id !== id)
    );
  };
  const saveEditedProduct = (updatedProducto) => {
    setProductos((prev) =>
      prev.map((prod) =>
        prod.id === updatedProducto.id ? updatedProducto : prod
      )
    );
  };

  const total = productos?.reduce(
    (acc, producto) => acc + Number(producto.total),
    0
  );

  const opGravadas = total / 1.18;

  const handleFindCentroCostos = useCallback(async () => {
    try {
      const url = `${import.meta.env.VITE_URL_API}/ajustes/centro-costos`;
      const response = await axios.get(url, config);

      setCentroCostos(response.data.centroCostos || []);
    } catch (error) {
      console.error("Error al obtener centros de costos:", error);
      setCentroCostos([]);
    }
  }, []);

  useEffect(() => {
    handleFindCentroCostos();
  }, [handleFindCentroCostos]);

  const columns = [
    { key: "index", label: "#" },
    { key: "nombre", label: "Nombre" },
    ...(tipo_productos === "Costos y gastos"
      ? [{ key: "descripcion", label: "Descripción" }]
      : []),
    ...(tipo_productos !== "Costos y gastos"
      ? [{ key: "stockDisponible", label: "Stock Disponible" }]
      : []),

    { key: "cantidad", label: "Cantidad" },
    { key: "precioUnitario", label: "Precio Unitario" },
    { key: "subtotal", label: "Subtotal" },
    { key: "acciones", label: "Acciones" },
  ];

  return (
    <div className="w-full  flex flex-col gap-2">
      {selectModal === "agregar" && (
        <ModalAgregarProducto
          onOpenChange={onOpenChange}
          isOpen={isOpen}
          setProductos={setProductos}
          tipo_productos={tipo_productos}
          centroCostos={centroCostos}
        />
      )}
      {selectModal === "editar" && (
        <ModalEditarProductoCotizacion
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          selectProduct={selectProduct}
          centroCostos={centroCostos}
          tipo_productos={tipo_productos}
          onSave={saveEditedProduct}
        />
      )}
      <Button
        className="ml-2 w-32 h-9"
        color="primary"
        size="sm"
        onPress={() => {
          onOpen();
          setSelectModal("agregar");
        }}
      >
        Agregar Producto
      </Button>
      <Table
        aria-label="Tabla de itinerarios"
        color="default"
        isStriped
        classNames={{
          base: "min-w-full  overflow-hidden  p-2 ",
          wrapper: "p-0",
        }}
        radius="sm"
        isCompact={true}
        isHeaderSticky
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              className=" min-w-14 text-xs text-white bg-blue-700"
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody>
          {productos?.map((producto, index) => (
            <TableRow key={producto.id}>
              {(columnKey) => {
                switch (columnKey) {
                  case "index":
                    return (
                      <TableCell className="text-xs py-2">
                        {index + 1}
                      </TableCell>
                    );
                  case "nombre":
                    return (
                      <TableCell className="text-xs py-2">
                        {producto.nombre}
                      </TableCell>
                    );
                  case "descripcion":
                    return (
                      <TableCell className="text-xs py-2">
                        {producto.descripcion}
                      </TableCell>
                    );
                  case "stockDisponible":
                    return (
                      <TableCell className="text-xs py-2">
                        {producto.stock}
                      </TableCell>
                    );
                  case "cantidad":
                    return (
                      <TableCell className="text-xs py-2">
                        {producto.cantidad}
                      </TableCell>
                    );
                  case "precioUnitario":
                    return (
                      <TableCell className="text-xs py-2">
                        {producto.precioUnitario}
                      </TableCell>
                    );
                  case "subtotal":
                    return (
                      <TableCell className="text-xs py-2">
                        s/. {producto.total}
                      </TableCell>
                    );

                  case "acciones":
                    return (
                      <TableCell className="text-xs py-2">
                        <div className="flex items-center gap-2">
                          <FaEdit
                            className="text-xl text-blue-500 cursor-pointer"
                            onClick={() => {
                              setSelectModal("editar");
                              setSelectProduct(producto);
                              onOpen();
                            }}
                          />

                          <FaTrashAlt
                            className="text-lg text-red-500 cursor-pointer"
                            onClick={() => {
                              eliminarProducto(producto.id);
                            }}
                          />
                        </div>
                      </TableCell>
                    );
                  default:
                    return <TableCell className="text-xs py-2">-</TableCell>;
                }
              }}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className=" w-full flex flex-col items-end pr-6">
        {tipoOperacion === "OPERACIÓN SUJETA A DETRACCIÓN" && (
          <div className=" flex text-sm gap-2 justify-end ">
            <p>M. DETRACCIÓN:</p>
            <span className="min-w-28">S/{formatNumber(monto)}</span>
          </div>
        )}
        <div className=" flex text-sm gap-2 justify-end ">
          <p>OP. GRAVADAS:</p>
          <span className="min-w-28">S/{formatNumber(opGravadas)}</span>
        </div>
        <div className="text-sm  flex gap-2 justify-end ">
          <p>IGV:</p>
          <span className="min-w-28">S/{formatNumber(opGravadas * 0.18)}</span>
        </div>
        <div className="text-sm  flex gap-2 justify-end font-semibold">
          <p>TOTAL A PAGAR :</p>
          <span className="min-w-28">S/{formatNumber(total)}</span>
        </div>
        {tipoOperacion === "OPERACIÓN SUJETA A DETRACCIÓN" && (
          <div className="text-sm  flex gap-2 justify-end">
            <p>M. PENDIENTE: </p>
            <span className="min-w-28">S/{formatNumber(total - monto)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TablaEditarProducto;
