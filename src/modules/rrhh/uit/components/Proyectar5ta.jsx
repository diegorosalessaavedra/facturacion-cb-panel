import { API } from "../../../../utils/api";
import axios from "axios";
import DatosTrabajadorUit from "../../proyecciones5ta/components/DatosTrabajadorUit";
import TablaProyecciones from "../../proyecciones5ta/components/tablaProyecciones/TablaProyecciones";
import { useEffect, useState } from "react";
import { handleAxiosError } from "../../../../utils/handleAxiosError";
import config from "../../../../utils/getToken";

const Proyectar5ta = ({ uit, visualizar }) => {
  const [colaboradores, setColaboradores] = useState([]);
  const [selectColaborador, setSelectColaborador] = useState(null);

  const handleFindColaboradores = async () => {
    try {
      const url = `${API}/rrhh/colaboradores`;
      const res = await axios.get(url, config);
      setColaboradores(res.data.colaboradores || []);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  useEffect(() => {
    handleFindColaboradores();
  }, []);

  return (
    <div className=" mx-auto w-full max-w-[1100px] p-4 rounded-2xl bg-white flex flex-col items-center gap-4 flex-1 min-h-0 overflow-y-auto pb-8">
      <div className="w-full shrink-0">
        <DatosTrabajadorUit
          colaboradores={colaboradores}
          selectColaborador={selectColaborador}
          setSelectColaborador={setSelectColaborador}
          uit={uit}
        />
      </div>
      {selectColaborador && (
        <div className="w-full shrink-0">
          <TablaProyecciones
            uit={uit}
            selectColaborador={selectColaborador}
            visualizar={visualizar}
          />
        </div>
      )}
    </div>
  );
};

export default Proyectar5ta;
