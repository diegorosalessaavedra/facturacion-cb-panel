import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { Save } from "lucide-react";
import { onInputNumber, onInputPrice } from "../../../assets/onInputs";

// --- CONSTANTES ---
const BILLETES = [
  { key: "billete_200", label: "200.00", valor: 200 },
  { key: "billete_100", label: "100.00", valor: 100 },
  { key: "billete_50", label: "50.00", valor: 50 },
  { key: "billete_20", label: "20.00", valor: 20 },
  { key: "billete_10", label: "10.00", valor: 10 },
];

const MONEDAS = [
  { key: "moneda_5", label: "5.00", valor: 5 },
  { key: "moneda_2", label: "2.00", valor: 2 },
  { key: "moneda_1", label: "1.00", valor: 1 },
  { key: "moneda_05", label: "0.50", valor: 0.5 },
  { key: "moneda_02", label: "0.20", valor: 0.2 },
];

const TODAS_DENOMINACIONES = [...BILLETES, ...MONEDAS];

const ModalIngresoEgresos = ({
  isOpen,
  onOpenChange,
  setIngresosData,
  esIngreso = true, // Prop para definir el tipo
}) => {
  // Estado inicial
  const initialState = {
    yape: "",
    ...TODAS_DENOMINACIONES.reduce((acc, d) => ({ ...acc, [d.key]: "" }), {}),
  };

  const [valores, setValores] = useState(initialState);
  const [totalCalculado, setTotalCalculado] = useState(0);

  // --- 1. LÓGICA DE CÁLCULO VISUAL ---
  useEffect(() => {
    // Calculamos siempre en positivo primero
    let sumaEfectivo = TODAS_DENOMINACIONES.reduce((acc, d) => {
      const cantidad = Number(valores[d.key]) || 0;
      return acc + cantidad * d.valor;
    }, 0);

    let sumaYape = Number(valores.yape) || 0;

    // Suma total absoluta
    const totalAbsoluto = sumaEfectivo + sumaYape;

    // Si es egreso, el total visual debe ser negativo
    setTotalCalculado(esIngreso ? totalAbsoluto : totalAbsoluto * -1);
  }, [valores, esIngreso]);

  const handleChange = (key, value) => {
    setValores((prev) => ({ ...prev, [key]: value }));
  };

  // --- 2. LÓGICA DE GUARDADO ---
  const handleGuardar = (onClose) => {
    const factor = esIngreso ? 1 : -1; // Multiplicador clave

    const dataProcesada = Object.keys(valores).reduce((acc, key) => {
      const valorNumerico = Number(valores[key]) || 0;

      // Aplicamos el negativo a cada item individual (monedas, billetes y yape)
      acc[key] = valorNumerico * factor;

      return acc;
    }, {});

    // Agregamos el total ya calculado (que ya tiene el signo correcto desde el useEffect)
    const resultadoFinal = {
      ...dataProcesada,
      total_operacion: Number(totalCalculado.toFixed(2)),
      tipo: esIngreso ? "INGRESO" : "EGRESO", // Opcional: útil para debug
    };

    if (setIngresosData) {
      setIngresosData(resultadoFinal);
    }
    onClose();
  };

  // --- ESTILOS DINÁMICOS ---
  // Cambia colores según si es Ingreso (Verde/Emerald) o Egreso (Rojo/Rose)
  const themeColor = esIngreso ? "emerald" : "rose";

  // Clases base
  const headerBase =
    "flex items-center justify-center font-bold text-[11px] uppercase tracking-wider py-2 px-1 text-center";
  const headerDark = `${headerBase} bg-slate-900 text-white`;
  const headerPurple = `${headerBase} bg-purple-900 text-white`;
  const headerSub = `${headerBase} bg-slate-800 text-white`;

  const cellBase = "h-10 relative flex items-center justify-center text-[11px]";
  const cellReadOnly = `${cellBase} bg-slate-50 text-slate-400 font-medium`;
  const cellInput = `${cellBase} bg-white hover:bg-slate-50 transition-colors`;

  // Etiqueta lateral dinámica
  const cellLabel = `${cellBase} text-white font-bold px-2 transition-colors duration-300 ${
    esIngreso ? "bg-emerald-900" : "bg-rose-900"
  }`;

  const inputClass =
    "w-full h-full bg-transparent text-center font-bold text-slate-900 text-sm outline-none placeholder:text-slate-300 focus:text-blue-600";

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="5xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader
              className={`flex flex-col gap-1 text-center border-b-2 ${esIngreso ? "border-emerald-500" : "border-rose-500"}`}
            >
              {esIngreso
                ? "REGISTRAR INGRESO DE CAJA"
                : "REGISTRAR SALIDA / GASTO DE CAJA"}
            </ModalHeader>

            <ModalBody className="bg-slate-100 p-6 overflow-x-auto">
              <div className="grid grid-cols-[90px_100px_repeat(10,1fr)_100px] gap-px bg-slate-300 border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                {/* --- FILA 1: ENCABEZADOS --- */}
                <div className="bg-white"></div>
                <div className={headerPurple}>Billetera Digital</div>
                <div className={`col-span-5 ${headerDark}`}>BILLETES</div>
                <div className={`col-span-5 ${headerDark}`}>MONEDAS</div>

                {/* TOTAL HEADER */}
                <div className="row-span-2 bg-slate-900 flex flex-col items-center justify-center text-white font-bold p-2">
                  <span
                    className={`text-sm tracking-wide ${esIngreso ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    TOTAL
                  </span>
                </div>

                {/* --- FILA 2: DENOMINACIONES --- */}
                <div className="bg-white"></div>
                <div className={headerPurple}>YAPE</div>
                {BILLETES.map((b) => (
                  <div key={b.key} className={headerSub}>
                    S/ {b.label}
                  </div>
                ))}
                {MONEDAS.map((m) => (
                  <div key={m.key} className={headerSub}>
                    S/ {m.label}
                  </div>
                ))}

                {/* --- FILA 3: SALDO (ESTÁTICO / VISUAL) --- */}
                <div className="bg-slate-800 text-white font-bold text-[11px] flex items-center justify-center">
                  SALDO
                </div>
                <div className={cellReadOnly}>-</div>
                {TODAS_DENOMINACIONES.map((d) => (
                  <div key={`saldo-${d.key}`} className={cellReadOnly}>
                    0
                  </div>
                ))}
                <div className="bg-slate-50 flex items-center justify-center font-bold text-slate-400 text-sm">
                  S/ 0.00
                </div>

                {/* --- FILA 4: INPUTS --- */}
                {/* Etiqueta dinámica: INGRESO o EGRESO */}
                <div className={cellLabel}>
                  {esIngreso ? "INGRESO" : "EGRESO"}
                </div>

                {/* Input Yape */}
                <div className={cellInput}>
                  <div className="absolute left-2 text-[10px] font-bold text-purple-700 pointer-events-none">
                    S/
                  </div>
                  <input
                    type="text"
                    className={`${inputClass} text-purple-900 pl-4`}
                    placeholder="0.00"
                    value={valores.yape}
                    onChange={(e) => handleChange("yape", e.target.value)}
                    onInput={onInputPrice}
                    onFocus={(e) => e.target.select()}
                  />
                </div>

                {/* Inputs Billetes y Monedas */}
                {TODAS_DENOMINACIONES.map((d) => (
                  <div key={`input-${d.key}`} className={cellInput}>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="0"
                      value={valores[d.key]}
                      onChange={(e) => handleChange(d.key, e.target.value)}
                      onFocus={(e) => e.target.select()}
                      onInput={onInputNumber}
                    />
                  </div>
                ))}

                {/* RESULTADO TOTAL DINÁMICO */}
                <div
                  className={`flex items-center justify-center font-black text-sm transition-colors duration-300
                    ${esIngreso ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}
                `}
                >
                  S/ {totalCalculado.toFixed(2)}
                </div>
              </div>
            </ModalBody>

            <ModalFooter className="border-t border-slate-200 bg-slate-50">
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                // El botón también cambia de color
                className={`text-white font-bold shadow-lg ${esIngreso ? "bg-slate-900" : "bg-rose-700 shadow-rose-900/20"}`}
                startContent={<Save size={18} />}
                onPress={() => handleGuardar(onClose)}
              >
                {esIngreso ? "GUARDAR INGRESO" : "GUARDAR SALIDA"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalIngresoEgresos;
