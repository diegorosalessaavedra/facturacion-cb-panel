import GrupoCompensacion from "./grupoCompensacion/GrupoCompensacion";

const TablaCompensacionAsistenciaOperativos = ({
  semanaPlanillaId,
  colaborador,
  isFinalizado,
}) => {
  const thMainBlue =
    "bg-sky-900 border-r border-b border-sky-950 p-2.5 font-bold uppercase text-[10px] tracking-widest text-white";
  const thMainGreen =
    "bg-teal-800 border-r border-b border-teal-900 p-2.5 font-bold uppercase text-[10px] tracking-widest text-white";

  const thSubBlue =
    "bg-sky-100 border-r border-b border-sky-300 p-3 font-bold uppercase text-[9px] tracking-wider text-blue-950 whitespace-nowrap";
  const thSubGreen =
    "bg-teal-100 border-r border-b border-teal-300 p-3 font-bold uppercase text-[9px] tracking-wider text-teal-950 whitespace-nowrap";

  return (
    <div className="flex overflow-auto border border-slate-300 rounded-xl bg-white shadow-md custom-scrollbar w-full">
      <table className="w-full border-collapse text-center">
        <thead className="sticky top-0 z-20 shadow-sm">
          <tr>
            <th colSpan={10} className={thMainBlue}>
              COMPENSACION PARA LA SIGUIENTE SEMANA
            </th>
            <th colSpan={5} className={thMainGreen}>
              CALCULO PARA COMPENSACION DE LA SIGUIENTE SEMANA
            </th>
          </tr>
          <tr>
            <th className={thSubBlue}>COLABORADOR</th>
            <th className={thSubBlue}>DÍA</th>
            <th className={thSubBlue}>FERIADO</th>
            <th className={thSubBlue}>TURNO</th>
            <th className={thSubBlue}>ACTIVIDAD</th>
            <th className={thSubBlue}>ENTRADA</th>
            <th className={thSubBlue}>SALIDA</th>
            <th className={thSubBlue}>TOTAL HR Y MIN</th>
            <th className={thSubBlue}>HORAS ENTERAS</th>
            <th className={thSubBlue}>MINUTOS ENTERAS</th>
            <th className={thSubGreen}>TOTAL PLANILLA</th>
            <th className={thSubGreen}>IMPORTE HORAS</th>
            <th className={thSubGreen}>IMPORTE MINUTOS</th>
            <th className={thSubGreen}>BONO</th>
            <th className={thSubGreen}>TOTAL EFECTIVO</th>
          </tr>
        </thead>
        {colaborador && (
          <GrupoCompensacion
            semanaPlanillaId={semanaPlanillaId}
            colaborador={colaborador}
            isFinalizado={isFinalizado}
          />
        )}
      </table>
    </div>
  );
};

export default TablaCompensacionAsistenciaOperativos;
