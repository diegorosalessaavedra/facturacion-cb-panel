import { useEffect, useState } from "react";
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
import { handleAxiosError } from "../../../../utils/handleAxiosError";
import TablaRendicion from "./TablaRendicion";

const FormularioRendicion = ({ trabajadores, onSuccess, conceptos }) => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [selectTrabajador, setSelectTrabajador] = useState(null);
  const [desembolsos, setDesembolsos] = useState([]);
  const [datosRendicion, setDatosRendicion] = useState([
    {
      fecha_uso: "",
      razon_social: "",
      ruc: "",
      fecha_emision: "",
      tipo_comprobante: "FACTURA",
      numero_comprobante: "",
      categoria: "COMBUSTIBLE",
      detalle: "",
      importe: "",
      observacion: "",
      sugerencias: "",
    },
  ]);
  const [selectDesembolso, setSelectDesembolso] = useState(null);

  const submit = async (data) => {
    setLoading(true);

    const newData = {
      ...data,
      trabajador_id: selectTrabajador.id,
      area_rendicion: selectTrabajador.area_centro_costo,
      datos_rendicion: datosRendicion,
    };

    const url = `${API}/caja-chica/rendicion/${selectDesembolso.id}`;

    await axios
      .post(url, newData, config)
      .then(() => {
        onSuccess();
        reset();
        toast.success("Rendicion registrada correctamente");
      })
      .catch((err) => handleAxiosError(err))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFindDesembolso = () => {
    const url = `${API}/caja-chica/desembolso/trabajador/${selectTrabajador.id}`;

    axios
      .get(url, config)
      .then((res) => setDesembolsos(res.data.desembolsos))
      .catch((err) => {
        handleAxiosError(err);
      });
  };

  useEffect(() => {
    if (selectTrabajador?.id) {
      handleFindDesembolso();
    }
  }, [selectTrabajador]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
        <motion.div
          className="flex  gap-3 "
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.div variants={itemVariants} className="w-full">
            <Select
              label="Trabajador a Rendir"
              labelPlacement="outside"
              placeholder="Seleccionar..."
              variant="bordered"
              startContent={<User className="text-default-400" size={16} />}
              classNames={selectClassNames}
              isRequired
              {...register("trabajador_id")}
              size="sm"
              selectedKeys={[`${selectTrabajador?.id}`]}
              onChange={(e) =>
                setSelectTrabajador(
                  trabajadores.find((t) => t.id === Number(e.target.value)),
                )
              }
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
              type="text"
              labelPlacement="outside"
              label="Area"
              variant="bordered"
              startContent={<Calendar className="text-default-400" size={16} />}
              classNames={inputClassNames}
              isRequired
              size="sm"
              value={selectTrabajador?.area_centro_costo || ""}
              isDisabled={!selectTrabajador}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="min-w-[200px]">
            <Select
              label="Concepto"
              labelPlacement="outside"
              variant="bordered"
              startContent={<FileText className="text-default-400" size={16} />}
              classNames={selectClassNames}
              isRequired
              {...register("concepto_rendicion")}
              size="sm"
              isDisabled={!selectTrabajador}
            >
              {conceptos?.map((c) => (
                <SelectItem key={c.conceptos} textValue={c.conceptos}>
                  <p className="text-xs">{c.conceptos}</p>
                </SelectItem>
              ))}
            </Select>
          </motion.div>
          <motion.div variants={itemVariants} className="min-w-[150px]">
            <Select
              label="Monto Recibido"
              labelPlacement="outside"
              variant="bordered"
              startContent={
                <p className="text-red-600 text-xs font-black">S/</p>
              }
              classNames={selectClassNames}
              isRequired
              color="danger"
              isDisabled={!selectTrabajador}
              size="sm"
              selectedKeys={[`${selectDesembolso?.id}`]}
              onChange={(e) =>
                setSelectDesembolso(
                  desembolsos.find((t) => t.id === Number(e.target.value)),
                )
              }
            >
              {desembolsos?.map((d) => (
                <SelectItem
                  key={d.id}
                  textValue={Math.abs(d.importe_desembolso)}
                >
                  <p className="text-xs">{Math.abs(d.importe_desembolso)}</p>
                </SelectItem>
              ))}
            </Select>
          </motion.div>

          <motion.div variants={itemVariants} className="min-w-[150px]">
            <Input
              isRequired
              label="Fecha Recibida"
              labelPlacement="outside"
              type="date"
              classNames={inputClassNames}
              variant="bordered"
              color="success"
              size="sm"
              value={selectDesembolso?.fecha_desembolso}
              isDisabled={!selectDesembolso}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="min-w-[150px]">
            <Input
              isRequired
              label="Fecha Rendida"
              labelPlacement="outside"
              type="date"
              classNames={inputClassNames}
              {...register("fecha_rendida")}
              variant="bordered"
              color="success"
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
            type="submit"
            className="bg-slate-900 text-white shadow-lg shadow-slate-900/20"
            isLoading={loading}
            startContent={!loading && <Save size={18} />}
          >
            Guardar Apertura
          </Button>
        </motion.div>
      </form>
      <div className="flex-1 min-h-0 border border-slate-200 rounded-xl  relative">
        {selectDesembolso ? (
          <TablaRendicion
            datosRendicion={datosRendicion}
            setDatosRendicion={setDatosRendicion}
            montoRendicion={Math.abs(
              Number(selectDesembolso.importe_desembolso),
            )}
          />
        ) : (
          <p className=" p-4">Seleccione un Monto</p>
        )}
      </div>
    </section>
  );
};

export default FormularioRendicion;
