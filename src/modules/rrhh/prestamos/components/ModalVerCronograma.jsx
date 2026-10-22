import React from "react";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Divider,
} from "@nextui-org/react";
import { inputClassNames } from "../../../../assets/classNames";

const ModalVerCronograma = ({ isOpen, onOpenChange, prestamo }) => {
    if (!prestamo) return null;

    // Extraer datos calculados del préstamo
    const cronograma = prestamo.cronograma || [];
    const totalDesembolso = cronograma.reduce((acc, cuota) => acc + Number(cuota.importe_cuota || 0), 0);
    const numCuotas = cronograma.length;
    
    // Obtener la fecha de la primera cuota si existe
    const cuotaInicialObj = cronograma.find((c) => c.numero_cuota === 1);
    const fechaCuotaInicial = cuotaInicialObj ? cuotaInicialObj.fecha_descuento : "";
    
    // Nombre completo del trabajador
    const nombreTrabajador = prestamo.colaborador 
        ? `${prestamo.colaborador.nombre_colaborador} ${prestamo.colaborador.apellidos_colaborador}` 
        : "Trabajador no encontrado";

    // Helper para colores de estado de pago
    const getEstadoCuotaStyles = (estado) => {
        return estado === "PAGADO" 
            ? "bg-emerald-100 text-emerald-800" 
            : "bg-amber-100 text-amber-800";
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop="blur"
            size="5xl"
            classNames={{
                base: "rounded-[24px] overflow-hidden bg-slate-50",
                header: "p-6 pb-2 bg-transparent z-20",
                body: "p-6",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex justify-between items-center gap-1 text-xl font-bold text-slate-900 w-full">
                            <div>
                                Detalles del Préstamo
                                <span className={`ml-4 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                                    prestamo.estado_prestamo === "AUTORIZADO" ? "bg-emerald-100 text-emerald-800" :
                                    prestamo.estado_prestamo === "RECHAZADO" ? "bg-red-100 text-red-800" :
                                    "bg-amber-100 text-amber-800"
                                }`}>
                                    {prestamo.estado_prestamo}
                                </span>
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                                
                                {/* LADO IZQUIERDO: DETALLES (SOLO LECTURA) */}
                                <div className="flex flex-col gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <h3 className="text-md font-semibold text-slate-900 mb-2">
                                        Datos Generales
                                    </h3>
                                    <div className="flex flex-col gap-4">
                                        
                                        <Input
                                            isReadOnly
                                            label="Trabajador"
                                            value={nombreTrabajador}
                                            classNames={inputClassNames}
                                            labelPlacement="outside"
                                            variant="bordered"
                                            radius="sm"
                                            size="sm"
                                        />

                                        <Input
                                            isReadOnly
                                            label="Total Desembolso (S/)"
                                            value={totalDesembolso.toFixed(2)}
                                            classNames={inputClassNames}
                                            labelPlacement="outside"
                                            variant="bordered"
                                            radius="sm"
                                            size="sm"
                                        />

                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                isReadOnly
                                                type="date"
                                                label="Fecha de Solicitud"
                                                value={prestamo.fecha_solicitud || ""}
                                                classNames={inputClassNames}
                                                labelPlacement="outside"
                                                variant="bordered"
                                                radius="sm"
                                                size="sm"
                                            />
                                            <Input
                                                isReadOnly
                                                type="date"
                                                label="Fecha de Desembolso"
                                                value={prestamo.fecha_desembolso || ""}
                                                classNames={inputClassNames}
                                                labelPlacement="outside"
                                                variant="bordered"
                                                radius="sm"
                                                size="sm"
                                            />
                                        </div>

                                        <Divider className="my-2 bg-slate-100" />

                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                isReadOnly
                                                type="date"
                                                label="Fecha Cuota Inicial"
                                                value={fechaCuotaInicial}
                                                classNames={inputClassNames}
                                                labelPlacement="outside"
                                                variant="bordered"
                                                radius="sm"
                                                size="sm"
                                            />
                                            <Input
                                                isReadOnly
                                                label="Nº Cuotas"
                                                value={String(numCuotas)}
                                                classNames={inputClassNames}
                                                labelPlacement="outside"
                                                variant="bordered"
                                                radius="sm"
                                                size="sm"
                                            />
                                        </div>

                                        <Input
                                            isReadOnly
                                            label="Importe Cuota Regular (S/)"
                                            value={Number(prestamo.importe_cuota).toFixed(2)}
                                            classNames={inputClassNames}
                                            labelPlacement="outside"
                                            variant="bordered"
                                            radius="sm"
                                            size="sm"
                                        />

                                        <div className="flex justify-end mt-4">
                                            <Button
                                                variant="flat"
                                                onPress={onClose}
                                                className="w-full md:w-auto px-8 text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium"
                                            >
                                                Cerrar Detalles
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* LADO DERECHO: CRONOGRAMA (SOLO LECTURA) */}
                                <div className="flex flex-col gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-md font-semibold text-slate-900">
                                            Cronograma de Pagos
                                        </h3>
                                        <div className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-md border border-green-100">
                                            Total: S/ {totalDesembolso.toFixed(2)}
                                        </div>
                                    </div>

                                    <div className="flex-grow overflow-auto max-h-[400px] border border-slate-100 rounded-lg">
                                        <Table
                                            aria-label="Cronograma de pagos guardado"
                                            removeWrapper
                                            size="sm"
                                            classNames={{
                                                th: "bg-slate-50 text-slate-900 font-bold text-[10px] uppercase sticky top-0 z-10",
                                                td: "py-2.5",
                                            }}
                                            className="w-full"
                                        >
                                            <TableHeader>
                                                <TableColumn className="text-center">Nº</TableColumn>
                                                <TableColumn>IMPORTE (S/)</TableColumn>
                                                <TableColumn>FECHA DE DESCUENTO</TableColumn>
                                                <TableColumn>ESTADO</TableColumn>
                                            </TableHeader>
                                            <TableBody
                                                emptyContent={<span className="text-slate-500 text-sm">Este préstamo no tiene cronograma.</span>}
                                            >
                                                {cronograma.map((cuota, index) => (
                                                    <TableRow key={index} className="border-b border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors">
                                                        <TableCell className="font-semibold text-slate-600 text-center text-xs">
                                                            {cuota.numero_cuota}
                                                        </TableCell>
                                                        <TableCell className="text-xs font-medium text-slate-800">
                                                            S/ {Number(cuota.importe_cuota).toFixed(2)}
                                                        </TableCell>
                                                        <TableCell className="text-xs text-slate-600">
                                                            {cuota.fecha_descuento}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${getEstadoCuotaStyles(cuota.estado_pago)}`}>
                                                                {cuota.estado_pago}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>

                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ModalVerCronograma;