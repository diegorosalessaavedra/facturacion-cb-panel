import { useEffect, useState } from "react";
import config from "../../../../../utils/getToken";
import axios from "axios";
import NuevoDespacho from "../despacho/components/NuevoDespacho";
import DespachoGrid from "../despacho/DespachoGrid";
import { useSocketContext } from "../../../../../context/SocketContext";

const CardBloque = ({ bloque, index }) => {
  const socket = useSocketContext();

  const [despachos, setDespachos] = useState([]);

  const handleFinddespachos = () => {
    if (bloque.id) {
      const url = `${import.meta.env.VITE_URL_API}/despacho/${bloque.id}`;

      axios.get(url, config).then((res) => {
        setDespachos(res.data.despachos);
      });
    }
  };

  useEffect(() => {
    if (bloque.id) {
      handleFinddespachos();
    }
  }, [bloque]);

  useEffect(() => {
    if (!socket) return;

    socket.on("despacho:created", (despacho) => {
      if (despacho.bloque_id === bloque.id) {
        setDespachos((prev) => [...prev, despacho]);
      }
    });

    return () => {
      socket.off("despacho:created");
    };
  }, [socket]);

  const classHeader = `w-[150px] bg-green-600 flex items-center justify-center text-center p-2 px-4 text-[11px]`;

  return (
    <div className="w-fit bg-slate-50 p-4 pl-10 rounded-md shadow">
      <div className="flex items-center gap-4">
        <h3 className="px-6 py-1.5 bg-blue-600 text-white rounded-lg text-lg font-medium">
          Bloque {index + 1}
        </h3>
        <NuevoDespacho bloqueId={bloque.id} />
      </div>
      <div className="grid grid-flow-row mt-4">
        <section className="grid grid-cols-[repeat(21,1fr)] gap-[1px] bg-white text-white text-nowrap font-bold">
          <article className={classHeader}>
            <p>VENDEDORA</p>
          </article>
          <article
            className={`w-[250px] bg-green-600 flex items-center justify-center text-center p-2 px-4 text-[11px]`}
          >
            <p>CLIENTE A COTIZAR</p>
          </article>
          <article className={classHeader}>
            <p>
              DNI O RUC DEL CLIENTE <br /> A COTIZAR{" "}
            </p>
          </article>
          <article className={classHeader}>
            <p>
              NUMERO DE <br /> CONTACTO
            </p>
          </article>
          <article className={classHeader}>
            <p>OBSERVACION</p>
          </article>
          <div className=" flex flex-col gap-[1px] bg-white text-center">
            <article className="w-full bg-green-600 flex items-center justify-center text-center p-2 px-4 text-[11px]">
              <h3>CONSIGNATARIO 1</h3>
            </article>

            <div className="flex gap-[1px]">
              <article className={classHeader}>
                <p>DNI O RUC</p>
              </article>
              <article className={classHeader}>
                <p>NOMBRE Y APELLIDOS</p>
              </article>
            </div>
          </div>
          <div className="grid-cols-2 flex flex-col gap-[1px] bg-white text-center">
            <article className="w-full bg-green-600 flex items-center justify-center text-center p-2 px-4 text-[11px]">
              <h3>CONSIGNATARIO 2</h3>
            </article>

            <div className="flex gap-[1px]">
              <article className={classHeader}>
                <p>DNI O RUC</p>
              </article>
              <article className={classHeader}>
                <p>NOMBRE Y APELLIDOS</p>
              </article>
            </div>
          </div>
          <article className={classHeader}>
            <p>CANTIDAD</p>
          </article>
          <article className={classHeader}>
            <p>CENTRO DE COSTOS </p>
          </article>
          <article className={classHeader}>
            <p>LINEA</p>
          </article>
          <article className={classHeader}>
            <p>DESTINO</p>
          </article>
          <article className={classHeader}>
            <p>TIPO DE ENVIO</p>
          </article>
          <article className={classHeader}>
            <p>OS / TRANSPORTE</p>
          </article>{" "}
          <article className={classHeader}>
            <p>P.U </p>
          </article>{" "}
          <article className={classHeader}>
            <p>AGREGADO EXTRA</p>
          </article>
          <article className={classHeader}>
            <p>TOTAL A COBRAR</p>
          </article>
          <article className={classHeader}>
            <p>ESTADO</p>
          </article>{" "}
          <article className={classHeader}>
            <p>TOTAL COBRADO</p>
          </article>{" "}
          <article className={classHeader}>
            <p>APLICACIÓN ANTICIPO</p>
          </article>
        </section>
        {despachos?.map((despacho, index) => (
          <DespachoGrid key={despacho.id} despacho={despacho} index={index} />
        ))}
      </div>{" "}
    </div>
  );
};

export default CardBloque;
