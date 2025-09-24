import { useEffect, useState } from "react";
import config from "../../../../../utils/getToken";
import axios from "axios";
import NuevoDespacho from "../despacho/components/NuevoDespacho";
import DespachoGrid from "../despacho/DespachoGrid";
import { useSocketContext } from "../../../../../context/SocketContext";
import EliminarBloque from "./components/EliminarBloque";

import NuevoCobroDespachoItem from "../despacho/components/NuevoCobroDespachoItem";

const CardBloque = ({ handleFindBloquesDespacho, bloque, index }) => {
  const socket = useSocketContext();

  const [despachos, setDespachos] = useState([]);
  const [cobros, setCobros] = useState([]);

  const handleFinddespachos = () => {
    if (bloque.id) {
      const url = `${import.meta.env.VITE_URL_API}/despacho/${bloque.id}`;

      axios.get(url, config).then((res) => {
        setDespachos(res.data.despachos);
      });
    }
  };

  const handleFindCobros = () => {
    if (bloque.id) {
      const url = `${import.meta.env.VITE_URL_API}/cobro-despacho-item/bloque/${
        bloque.id
      }`;

      axios.get(url, config).then((res) => {
        setCobros(res.data.cobroDespachoItems);
      });
    }
  };

  useEffect(() => {
    if (bloque.id) {
      handleFinddespachos();
      handleFindCobros();
    }
  }, [bloque]);

  useEffect(() => {
    if (!socket || !bloque?.id) return;

    const handleDespachoCreated = (despacho) => {
      if (despacho.bloque_id === bloque.id) {
        setDespachos((prev) => [...prev, despacho]);
      }
    };

    const handleDespachoUpdate = (updatedDespacho) => {
      if (updatedDespacho.bloque_id === bloque.id) {
        setDespachos((prev) =>
          prev.map((d) => (d.id === updatedDespacho.id ? updatedDespacho : d))
        );
      }
    };

    const handleDeleted = (despacho) => {
      setDespachos((prev) => prev.filter((p) => p.id !== despacho.id));
    };

    const handleCobroDespachoCreated = (cobroDespachoItem) => {
      setCobros((prev) => [...prev, cobroDespachoItem]);
    };

    // Agregar listeners
    socket.on(`despacho:created:${bloque.id}`, handleDespachoCreated);
    socket.on(`despacho:update:${bloque.id}`, handleDespachoUpdate);
    socket.on(`despacho:delete:${bloque.id}`, handleDeleted);

    socket.on(
      `cobroDespachoItem:created:${bloque.id}`,
      handleCobroDespachoCreated
    );

    // Cleanup
    return () => {
      socket.off(`despacho:created:${bloque.id}`, handleDespachoCreated);
      socket.off(`despacho:update:${bloque.id}`, handleDespachoUpdate);
      socket.off(`despacho:delete:${bloque.id}`, handleDeleted);

      socket.off(
        `cobroDespachoItem:created:${bloque.id}`,
        handleCobroDespachoCreated
      );
    };
  }, [socket, bloque?.id]);

  const classHeader = `w-[150px] bg-green-600 flex items-center justify-center text-center p-1 px-2 text-[10px]`;

  return (
    <div className="w-fit bg-slate-50 p-4 pl-10 rounded-md shadow">
      <div className="flex items-end gap-4">
        <h3 className="px-6 py-1.5 bg-blue-600 text-white rounded-lg text-lg font-medium">
          {bloque.nombre_bloque}
        </h3>
        <EliminarBloque
          bloque={bloque}
          index={index}
          handleFindBloquesDespacho={handleFindBloquesDespacho}
        />
        <NuevoDespacho bloqueId={bloque.id} />
      </div>
      <div className="grid grid-flow-row mt-4">
        <section
          className={`grid grid-flow-col  gap-[1px] bg-white text-white text-nowrap font-bold`}
        >
          <article className={classHeader}>
            <p>VENDEDORA</p>
          </article>
          <article
            className={`w-[250px] bg-green-600 flex items-center justify-center text-center p-1 px-2 text-[10px]`}
          >
            <p>CLIENTE A COTIZAR</p>
          </article>
          <article
            className={`w-[200px] bg-green-600 flex items-center justify-center text-center p-1 px-2 text-[10px]`}
          >
            {" "}
            <p>
              DNI O RUC DEL CLIENTE <br /> A COTIZAR{" "}
            </p>
          </article>
          <article className={classHeader}>
            <p>
              NUMERO DE <br /> CONTACTO
            </p>
          </article>
          <div className=" flex flex-col gap-[1px] bg-white text-center">
            <article className="w-full bg-green-600 flex items-center justify-center text-center p-1 px-2 text-[10px]">
              <h3>CONSIGNATARIO 1</h3>
            </article>

            <div className="flex gap-[1px]">
              <article className={classHeader}>
                <p>DNI </p>
              </article>
              <article className="w-[250px] bg-green-600 flex items-center justify-center text-center p-1 px-2 text-[10px]">
                <p>NOMBRE Y APELLIDOS</p>
              </article>
            </div>
          </div>
          <div className=" flex flex-col gap-[1px] bg-white text-center">
            <article className="w-full bg-green-600 flex items-center justify-center text-center p-1 px-2 text-[10px]">
              <h3>CONSIGNATARIO 2</h3>
            </article>

            <div className="flex gap-[1px]">
              <article className={classHeader}>
                <p>DNI </p>
              </article>
              <article className="w-[250px] bg-green-600 flex items-center justify-center text-center p-1 px-2 text-[10px]">
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
            <p>OBSERVACION</p>
          </article>
          <article className={classHeader}>
            <p>AGREGADOS</p>
          </article>
          {/* <article className={classHeader}>
            <p>PRECIO TOTAL</p>
          </article> */}
          <article className={classHeader}>
            <p>TOTAL A COBRAR</p>
          </article>
          <article className={classHeader}>
            <p>ESTADO</p>
          </article>
          <article className={classHeader}>
            <p>TOTAL COBRADO</p>
          </article>
          <article className={`${classHeader} relative`}>
            <p>SALDO DEL CLIENTE</p>
            <NuevoCobroDespachoItem bloque={bloque} />
          </article>
          {cobros.map((cobro, index) => (
            <div
              key={index}
              className=" flex flex-col gap-[1px] bg-white text-center"
            >
              <article className="w-full bg-green-600 flex items-center justify-center text-center p-1 px-2 text-[10px]">
                <h3>COBRO {index + 1}</h3>
              </article>

              <div className="flex gap-[1px]">
                <article className={classHeader}>
                  <p>METOD. PAGO</p>
                </article>
                <article className={classHeader}>
                  <p>BCO</p>
                </article>
                <article className={classHeader}>
                  <p>FECHA PGO</p>
                </article>
                <article className={classHeader}>
                  <p>OP</p>
                </article>
                <article className={classHeader}>
                  <p>MONTO</p>
                </article>
              </div>
            </div>
          ))}
        </section>
        {despachos?.map((despacho, index) => (
          <DespachoGrid
            key={index}
            despacho={despacho}
            index={index}
            cobrosItem={cobros}
          />
        ))}
      </div>{" "}
    </div>
  );
};

export default CardBloque;
