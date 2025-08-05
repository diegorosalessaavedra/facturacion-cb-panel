import React from "react";
import { FaWpforms } from "react-icons/fa";

const SectionOneGenerarNotaCreditoDebito = ({ comprobanteElectronico }) => {
  return (
    <section className="flex  gap-4 px-4 ">
      <FaWpforms className="text-2xl" />
      <h2>
        Nueva Nota {comprobanteElectronico?.serie}-
        {comprobanteElectronico?.numeroSerie}
      </h2>
    </section>
  );
};

export default SectionOneGenerarNotaCreditoDebito;
