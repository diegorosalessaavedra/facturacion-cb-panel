import React from "react";
import { MdOutlineInventory } from "react-icons/md";

const BanerEditarOrdenCompra = () => {
  return (
    <section className="w-full flex px-2 py-2 gap-2 items-center text-blue-500">
      <MdOutlineInventory className="text-3xl" />
      <h1>Editar SOLPED</h1>
    </section>
  );
};

export default BanerEditarOrdenCompra;
