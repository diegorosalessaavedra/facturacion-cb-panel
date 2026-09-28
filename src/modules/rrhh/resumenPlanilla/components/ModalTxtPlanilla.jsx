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

const ModalTxtPlanilla = ({
  isOpen,
  onOpenChange,
  dataSemana,
  selectDatosText,
}) => {
  // Inicializamos con string vacío para evitar errores antes del useEffect
  const [glosa, setGlosa] = useState("");

  useEffect(() => {
    // Verificamos que dataSemana exista antes de intentar usar sus propiedades
    if (dataSemana && dataSemana.mes_planilla && dataSemana.year_planilla) {
      const nuevaGlosa = `PAGO DE HABERES 0${dataSemana.numero_semana || ""} SEM ${dataSemana.mes_planilla.mes || ""} ${dataSemana.year_planilla.year || ""}`;
      setGlosa(nuevaGlosa.toUpperCase());
    }
  }, [isOpen, dataSemana]);

  // Agregamos 'C' que es Haberes Regulares, y la seteamos por defecto, ya que G es Gratificación
  const [subtipo, setSubtipo] = useState(new Set(["G"]));

  const handleDescargarTxt = () => {
    if (!selectDatosText || selectDatosText.length === 0) {
      toast.error(
        "No hay colaboradores seleccionados en la lista para generar el TXT.",
      );
      return;
    }

    const subtipoSeleccionado = Array.from(subtipo)[0];

    if (!subtipoSeleccionado) {
      toast.error("Debe seleccionar un Subtipo de planilla.");
      return;
    }

    try {
      // Aseguramos que glosa sea un string antes de usar toUpperCase
      const glosaSegura = String(glosa || "").toUpperCase();

      generarTxtBcp(
        selectDatosText,
        glosaSegura, 
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
                onChange={(e) => setGlosa(String(e.target.value).toUpperCase())}
                maxLength={40}
              />
              <p className="text-xs text-slate-400 text-right mt-1">
                {glosa?.length || 0}/40 caracteres
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