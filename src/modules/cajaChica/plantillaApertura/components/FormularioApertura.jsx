import { useState } from "react";
import {
  Button,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { API } from "../../../../utils/api";
import config from "../../../../utils/getToken";
import { toast } from "sonner";
import { Save, Wallet, Calendar, User, FileText } from "lucide-react";
import { motion } from "framer-motion";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../assets/classNames";
import ModalIngresoEgresos from "../../components/ModalIngresoEgresos";
import { numberPeru } from "../../../../assets/onInputs";
import { handleAxiosError } from "../../../../utils/handleAxiosError";

const FormularioApertura = ({
  desgloseCaja,
  trabajadores,
  onSuccess,
  saldoTotal,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [ingresosData, setIngresosData] = useState(null);

  const submit = async (data) => {
    // Validación de seguridad: Asegurarnos de que usaron el modal
    if (!ingresosData || !ingresosData.total_operacion) {
      toast.error("Por favor, ingrese el desglose en el Modal de Ingreso");
      return;
    }

    setLoading(true);
    const newData = { ...data, ...(ingresosData || {}) };
    const url = `${API}/caja-chica/apertura`;

    await axios
      .post(url, newData, config)
      .then(() => {
        onSuccess();
        setIngresosData(null); // Reseteamos a null
        reset();
        toast.success("Apertura registrada correctamente");
      })
      .catch((err) => handleAxiosError(err))
      .finally(() => {
        setLoading(false);
      });
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <motion.div
        className="flex gap-3"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
      >
        {/* SALDO EN CAJA */}
        <motion.div variants={itemVariants} className="min-w-[150px]">
          <Input
            label="Saldo en Caja"
            labelPlacement="outside"
            placeholder="0.00"
            startContent={<Wallet className="text-default-400" size={16} />}
            variant="bordered"
            classNames={inputClassNames}
            value={`S/ ${numberPeru(saldoTotal)}`}
            color="warning"
            size="sm"
            isReadOnly
          />
        </motion.div>

        {/* DISPONE (SELECT) */}
        <motion.div variants={itemVariants} className="w-full">
          <Select
            label="Dispone en Caja"
            labelPlacement="outside"
            placeholder="Seleccionar..."
            variant="bordered"
            startContent={<User className="text-default-400" size={16} />}
            classNames={selectClassNames}
            isRequired
            {...register("trabajador_id")}
            size="sm"
          >
            {trabajadores?.map((t) => (
              <SelectItem
                key={t.id}
                value={t.id}
                textValue={t.nombre_trabajador}
              >
                <p className="text-xs">{t.nombre_trabajador}</p>
              </SelectItem>
            ))}
          </Select>
        </motion.div>

        {/* FECHA */}
        <motion.div variants={itemVariants} className="min-w-[200px]">
          <Input
            type="date"
            labelPlacement="outside"
            label="Fecha que Dispone"
            variant="bordered"
            startContent={<Calendar className="text-default-400" size={16} />}
            classNames={inputClassNames}
            isRequired
            {...register("fecha_dispone")}
            size="sm"
          />
        </motion.div>

        {/* MOTIVO */}
        <motion.div variants={itemVariants} className="min-w-[200px]">
          <Select
            label="Motivo de Apertura"
            labelPlacement="outside"
            variant="bordered"
            startContent={<FileText className="text-default-400" size={16} />}
            classNames={selectClassNames}
            isRequired
            {...register("motivo_apertura")}
            size="sm"
          >
            <SelectItem key="REPOSICIÓN" value="REPOSICIÓN">
              REPOSICIÓN
            </SelectItem>
            <SelectItem key="DEVOLUCIÓN" value="DEVOLUCIÓN">
              DEVOLUCIÓN
            </SelectItem>
            <SelectItem key="COBRO CLIENTE" value="COBRO CLIENTE">
              COBRO CLIENTE
            </SelectItem>
          </Select>
        </motion.div>

        {/* IMPORTE */}
        <motion.div variants={itemVariants} className="min-w-[200px]">
          <Input
            label="Importe"
            labelPlacement="outside"
            placeholder="0.00"
            type="text"
            startContent={
              <p className="text-green-600 text-xs font-black">S/</p>
            }
            variant="bordered"
            color="success"
            classNames={{
              inputWrapper: "bg-white min-h-10 border-1.5 border-neutral-400",
              input: "font-bold text-green-600",
              label: "pb-[3px] text-[0.8rem] text-green-600 font-semibold",
            }}
            isReadOnly // 🟢 Obliga al usuario a usar el modal
            value={numberPeru(ingresosData?.total_operacion || 0)}
            size="sm"
          />
        </motion.div>
      </motion.div>

      {/* BOTONES */}
      <motion.div
        className="flex justify-end gap-3 pb-4 pt-0 border-b border-amber-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          type="button" // 🟢 Previene que envíe el formulario por accidente
          className="font-medium bg-amber-400"
          onPress={onOpen}
        >
          Modal Ingreso
        </Button>
        <Button
          type="submit"
          className="bg-slate-900 text-white shadow-lg shadow-slate-900/20"
          isLoading={loading}
          startContent={!loading && <Save size={18} />}
        >
          Guardar Apertura
        </Button>
      </motion.div>

      <ModalIngresoEgresos
        saldoTotal={saldoTotal}
        desgloseCaja={desgloseCaja}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        ingresosData={ingresosData}
        setIngresosData={setIngresosData}
        esIngreso={true} // Aseguramos que es un ingreso
      />
    </form>
  );
};

export default FormularioApertura;
