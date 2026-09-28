import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { toast } from "sonner";
import { generarTxtBcp } from "../../../../utils/txt/exportTxtBcp";
import { set } from "react-hook-form";

const ModalTxtPlanilla = ({
  isOpen,
  onOpenChange,
  dataSemana,
  selectDatosText,
}) => {
  const [glosa, setGlosa] = useState("");

  useEffect(() => {
    setGlosa(
      `PAGO DE HABERES 0${dataSemana?.numero_semana} SEM ${dataSemana?.mes_planilla?.mes} ${dataSemana?.year_planilla?.year}`.toUpperCase(),
    );
  }, [isOpen]);

  // Estado para el Subtipo de Planilla (Por defecto "C" que es Haberes regular según tu ejemplo anterior)
  const [subtipo, setSubtipo] = useState(new Set(["G"]));

  const handleDescargarTxt = () => {
    if (!selectDatosText || selectDatosText.length === 0) {
      toast.error(
        "No hay colaboradores seleccionados en la lista para generar el TXT.",
      );
      return;
    }

    // Extraer el valor del Set del Select de NextUI
    const subtipoSeleccionado = Array.from(subtipo)[0];

    if (!subtipoSeleccionado) {
      toast.error("Debe seleccionar un Subtipo de planilla.");
      return;
    }

    try {
      generarTxtBcp(
        selectDatosText,
        dataSemana,
        glosa.toUpperCase(),
        subtipoSeleccionado,
      );
      toast.success("Archivo TXT generado exitosamente.");
      onOpenChange(false);
    } catch (error) {
      toast.error("Hubo un error al generar el archivo TXT.");
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-slate-800">
              Generar TXT para BCP
            </ModalHeader>
            <ModalBody>
              <p className="text-sm text-slate-500 mb-2">
                Configure los parámetros para generar el archivo TXT del banco.
              </p>

              <Select
                label="Subtipo de Planilla"
                variant="bordered"
                selectedKeys={subtipo}
                onSelectionChange={setSubtipo}
                isRequired
              >
                <SelectItem key="G" value="G">
                  G - GRATIFICACIÓN
                </SelectItem>
                <SelectItem key="O" value="O">
                  O - OTROS AFECTOS
                </SelectItem>
                <SelectItem key="T" value="T">
                  T - PRESTAMOS
                </SelectItem>
                <SelectItem key="4" value="4">
                  4 - CUARTA CATEGORÍA
                </SelectItem>
                <SelectItem key="X" value="X">
                  X - QUINTA CATEGORÍA
                </SelectItem>
              </Select>

              <Input
                label="Glosa / Descripción"
                placeholder="Ej. PAGO DE HABERES 02 SEM SETIEMBRE 2026"
                variant="bordered"
                value={glosa}
                onChange={(e) => setGlosa(e.target.value.toUpperCase())}
                maxLength={40}
              />
              <p className="text-xs text-slate-400 text-right mt-1">
                {glosa.length}/40 caracteres
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" onPress={handleDescargarTxt}>
                Descargar TXT
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalTxtPlanilla;
