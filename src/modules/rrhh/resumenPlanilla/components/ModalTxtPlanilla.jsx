import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { toast } from "sonner";
import { generarTxtBcp } from "../../../../utils/txt/exportTxtBcp";

const ModalTxtPlanilla = ({
  isOpen,
  onOpenChange,
  dataSemana,
  selectDatosText,
}) => {
  const [glosa, setGlosa] = useState("PAGO DE HABERES 02 SEM SETIEMBRE 2026");

  const handleDescargarTxt = () => {
    if (!selectDatosText || selectDatosText.length === 0) {
      toast.error(
        "No hay selectDatosText en la lista actual para generar el TXT.",
      );
      return;
    }

    try {
      generarTxtBcp(selectDatosText, dataSemana, glosa);
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
                Configure la descripción que aparecerá en el estado de cuenta de
                los colaboradores.
              </p>
              <Input
                label="Glosa / Descripción"
                placeholder="Ej. PAGO DE HABERES 02 SEM SETIEMBRE 2026"
                variant="bordered"
                value={glosa}
                onChange={(e) => setGlosa(e.target.value)}
                maxLength={40} // El BCP admite máximo 40 caracteres
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
