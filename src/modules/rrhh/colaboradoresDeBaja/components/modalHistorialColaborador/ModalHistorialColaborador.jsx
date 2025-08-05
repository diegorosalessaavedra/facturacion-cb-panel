import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from "@nextui-org/react";
import { useState } from "react";
import HistorialContratos from "./components/HistorialContratos";
import HistorialMemos from "./components/HistorialMemos";
import HistorialDescansoMedico from "./components/HistorialDescansoMedico";
import HistorialVacaciones from "./components/HistorialVacaciones";

const tabs = [
  { key: "contratos", title: "Contratos" },
  { key: "memos", title: "Memos" },
  { key: "descansos_medicos", title: "Descansos Médicos" },
  { key: "vacaciones", title: "Vacaciones" },
];

const ModalHistorialColaborador = ({
  isOpen,
  onOpenChange,
  selectColaborador,
}) => {
  const [selected, setSelected] = useState("contratos");

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="3xl"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-base">
          Historial del colaborador {selectColaborador.nombre_colaborador}
        </ModalHeader>
        <ModalBody>
          {/* Tabs estilo Tailwind */}
          <div className=" border-b border-gray-200">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
              {tabs.map((tab) => (
                <li key={tab.key} className="me-2">
                  <button
                    onClick={() => setSelected(tab.key)}
                    className={`font-semibold inline-block p-3 border-b-4 rounded-t-lg transition-all duration-200 ${
                      selected === tab.key
                        ? "border-blue-500 text-blue-500 font-semibold"
                        : "border-transparent hover:text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {tab.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contenido del tab seleccionado */}
          <div className="w-full">
            {selected === "contratos" && (
              <HistorialContratos contratos={selectColaborador.contratos} />
            )}
            {selected === "memos" && (
              <HistorialMemos memos={selectColaborador.memos} />
            )}
            {selected === "descansos_medicos" && (
              <HistorialDescansoMedico colaboradorId={selectColaborador.id} />
            )}
            {selected === "vacaciones" && (
              <HistorialVacaciones colaboradorId={selectColaborador.id} />
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="button" onPress={onOpenChange}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalHistorialColaborador;
