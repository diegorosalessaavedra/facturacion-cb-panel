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

const FormularioDesembolso = ({
  desgloseCaja,
  trabajadores,
  onSuccess,
  saldoTotal,
  conceptos,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [ingresosData, setIngresosData] = useState(null);

  const submit = async (data) => {
    setLoading(true);

    const newData = { ...data, ...(ingresosData || {}) };

    const url = `${API}/caja-chica/desembolso`;

    await axios
      .post(url, newData, config)
      .then(() => {
        setIngresosData(null);
        toast.success("Desembolso registrada correctamente");
        reset();
        onSuccess();
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
        className="flex  gap-3 "
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
            color="primary"
            size="sm"
          />
        </motion.div>

        {/* DISPONE (SELECT) */}
        <motion.div variants={itemVariants} className="w-full">
          <Select
            label="Desembolso a"
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
        <motion.div variants={itemVariants} className="min-w-[200px]">
          <Input
            label="Rutas"
            labelPlacement="outside"
            type="text"
            variant="bordered"
            color="danger"
            {...register("rutas_desembolso")}
            classNames={inputClassNames}
            size="sm"
          />
        </motion.div>

        {/* FECHA */}
        <motion.div variants={itemVariants} className="min-w-[200px]">
          <Input
            type="date"
            labelPlacement="outside"
            label="Fecha de Desembolso"
            variant="bordered"
            startContent={<Calendar className="text-default-400" size={16} />}
            classNames={inputClassNames}
            isRequired
            {...register("fecha_desembolso")}
            size="sm"
          />
        </motion.div>

        {/* MOTIVO */}
        <motion.div variants={itemVariants} className="min-w-[200px]">
          <Select
            label="Concepto de Rendición"
            labelPlacement="outside"
            variant="bordered"
            startContent={<FileText className="text-default-400" size={16} />}
            classNames={selectClassNames}
            isRequired
            {...register("motivo_desembolso")}
            size="sm"
          >
            {conceptos?.map((c) => (
              <SelectItem key={c.conceptos} textValue={c.conceptos}>
                <p className="text-xs">{c.conceptos}</p>
              </SelectItem>
            ))}
          </Select>
        </motion.div>

        {/* IMPORTE */}
        <motion.div variants={itemVariants} className="min-w-[200px]">
          <Input
            label="Importe"
            labelPlacement="outside"
            placeholder="0.00"
            type="text"
            startContent={<p className="text-red-600 text-xs font-black">S/</p>}
            variant="bordered"
            color="danger"
            classNames={{
              inputWrapper: "bg-white min-h-10 border-1.5 border-neutral-400",
              input: "font-bold text-red-600",
              label: "pb-[3px] text-[0.8rem] text-red-600 font-semibold",
            }}
            isRequired
            value={numberPeru(ingresosData?.total_operacion || 0) || 0}
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
        <Button className="font-medium bg-amber-400" onPress={onOpen}>
          Modal Ingreso
        </Button>
        <Button
          type="submit"
          className="bg-slate-900 text-white shadow-lg shadow-slate-900/20"
          isLoading={loading}
          startContent={!loading && <Save size={18} />}
        >
          Guardar Desembolso
        </Button>
      </motion.div>
      {
        <ModalIngresoEgresos
          saldoTotal={saldoTotal}
          desgloseCaja={desgloseCaja}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          setIngresosData={setIngresosData}
          esIngreso={false}
        />
      }
    </form>
  );
};

export default FormularioDesembolso;
