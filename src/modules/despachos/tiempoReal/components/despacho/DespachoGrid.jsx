import { useState, useEffect } from "react";

export default function DespachoGrid({ despacho, index }) {
  const [focusInput, setFocusInput] = useState("");
  const [formData, setFormData] = useState({
    vendedora: "",
    cliente: "",
    dni_ruc_cliente: "",
    numero_contacto: "",
    observacion: "",
    consignatario1_dni: "",
    consignatario1_nombre: "",
    consignatario2_dni: "",
    consignatario2_nombre: "",
    cantidad: "",
    centro_costos: "",
    linea: "",
    destino: "",
    tipo_envio: "",
    os_transporte: "",
    precio_unitario: "",
    agregado_extra: "",
    total_cobrar: "",
    estado: "",
    total_cobrado: "",
    aplicacion_anticipo: "",
  });

  // Inicializar datos del despacho
  useEffect(() => {
    if (despacho) {
      setFormData((prevData) => ({
        ...prevData,
        vendedora: despacho.vendedora || "",
        cliente: despacho.cliente || "",
        dni_ruc_cliente: despacho.dni_ruc_cliente || "",
        numero_contacto: despacho.numero_contacto || "",
        observacion: despacho.observacion || "",
        consignatario1_dni: despacho.consignatario1_dni || "",
        consignatario1_nombre: despacho.consignatario1_nombre || "",
        consignatario2_dni: despacho.consignatario2_dni || "",
        consignatario2_nombre: despacho.consignatario2_nombre || "",
        cantidad: despacho.cantidad || "",
        centro_costos: despacho.centro_costos || "",
        linea: despacho.linea || "",
        destino: despacho.destino || "",
        tipo_envio: despacho.tipo_envio || "",
        os_transporte: despacho.os_transporte || "",
        precio_unitario: despacho.precio_unitario || "",
        agregado_extra: despacho.agregado_extra || "",
        total_cobrar: despacho.total_cobrar || "",
        estado: despacho.estado || "",
        total_cobrado: despacho.total_cobrado || "",
        aplicacion_anticipo: despacho.aplicacion_anticipo || "",
      }));
    }
  }, [despacho]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Calcular totales automáticamente
    if (
      field === "precio_unitario" ||
      field === "cantidad" ||
      field === "agregado_extra"
    ) {
      calculateTotal();
    }
  };

  const calculateTotal = () => {
    const cantidad = parseFloat(formData.cantidad) || 0;
    const precioUnitario = parseFloat(formData.precio_unitario) || 0;
    const agregadoExtra = parseFloat(formData.agregado_extra) || 0;

    const total = cantidad * precioUnitario + agregadoExtra;

    setFormData((prev) => ({
      ...prev,
      total_cobrar: total.toFixed(2),
    }));
  };

  const inputStyles = `
    w-full h-8 px-2 text-xs border-0 bg-transparent text-gray-900 
    focus:outline-none focus:bg-green-50 focus:ring-1 focus:ring-green-300
    placeholder-gray-400
  `;

  const cellStyles = `w-[150px] bg-white border-r border-gray-200`;

  return (
    <section className="grid grid-cols-[repeat(21,1fr)] gap-[1px] bg-gray-200 hover:bg-gray-100 transition-colors">
      {/* Vendedora */}
      <article className={cellStyles}>
        <input
          type="text"
          value={formData.vendedora}
          onChange={(e) => handleInputChange("vendedora", e.target.value)}
          className={inputStyles}
          placeholder="Vendedora"
          onFocus={() => setFocusInput("Vendedora")}
          id="vendedora"
        />
      </article>

      {/* Cliente a cotizar */}
      <article
        className={`w-[250px] flex  bg-white  items-center justify-center text-center text-xs`}
      >
        <input
          type="text"
          value={formData.cliente}
          onChange={(e) => handleInputChange("cliente", e.target.value)}
          className={inputStyles}
          placeholder="Cliente"
          onFocus={() => setFocusInput("Cliente")}
        />
      </article>

      {/* DNI/RUC Cliente */}
      <article className={cellStyles}>
        <input
          type="text"
          value={formData.dni_ruc_cliente}
          onChange={(e) => handleInputChange("dni_ruc_cliente", e.target.value)}
          className={inputStyles}
          placeholder="DNI/RUC"
          onFocus={() => setFocusInput("Cliente")}
        />
      </article>

      {/* Número de contacto */}
      <article className={cellStyles}>
        <input
          type="tel"
          value={formData.numero_contacto}
          onChange={(e) => handleInputChange("numero_contacto", e.target.value)}
          className={inputStyles}
          placeholder="Teléfono"
          onFocus={() => setFocusInput("Cliente")}
        />
      </article>

      {/* Observación */}
      <article className={cellStyles}>
        <input
          type="text"
          value={formData.observacion}
          onChange={(e) => handleInputChange("observacion", e.target.value)}
          className={inputStyles}
          placeholder="Observación"
        />
      </article>

      {/* Consignatario 1 - DNI */}
      <article className={cellStyles}>
        <input
          type="text"
          value={formData.consignatario1_dni}
          onChange={(e) =>
            handleInputChange("consignatario1_dni", e.target.value)
          }
          className={inputStyles}
          placeholder="DNI/RUC"
        />
      </article>

      {/* Consignatario 1 - Nombre */}
      <article className={cellStyles}>
        <input
          type="text"
          value={formData.consignatario1_nombre}
          onChange={(e) =>
            handleInputChange("consignatario1_nombre", e.target.value)
          }
          className={inputStyles}
          placeholder="Nombre"
        />
      </article>

      {/* Consignatario 2 - DNI */}
      <article className={cellStyles}>
        <input
          type="text"
          value={formData.consignatario2_dni}
          onChange={(e) =>
            handleInputChange("consignatario2_dni", e.target.value)
          }
          className={inputStyles}
          placeholder="DNI/RUC"
        />
      </article>

      {/* Consignatario 2 - Nombre */}
      <article className={cellStyles}>
        <input
          type="text"
          value={formData.consignatario2_nombre}
          onChange={(e) =>
            handleInputChange("consignatario2_nombre", e.target.value)
          }
          className={inputStyles}
          placeholder="Nombre"
        />
      </article>

      {/* Cantidad */}
      <article className={cellStyles}>
        <input
          type="number"
          value={formData.cantidad}
          onChange={(e) => handleInputChange("cantidad", e.target.value)}
          className={inputStyles}
          placeholder="0"
          min="0"
          step="1"
        />
      </article>

      {/* Centro de costos */}
      <article className={cellStyles}>
        <input
          type="text"
          value={formData.centro_costos}
          onChange={(e) => handleInputChange("centro_costos", e.target.value)}
          className={inputStyles}
          placeholder="Centro"
        />
      </article>

      {/* Línea */}
      <article className={cellStyles}>
        <input
          type="text"
          value={formData.linea}
          onChange={(e) => handleInputChange("linea", e.target.value)}
          className={inputStyles}
          placeholder="Línea"
        />
      </article>

      {/* Destino */}
      <article className={cellStyles}>
        <input
          type="text"
          value={formData.destino}
          onChange={(e) => handleInputChange("destino", e.target.value)}
          className={inputStyles}
          placeholder="Destino"
        />
      </article>

      {/* Tipo de envío */}
      <article className={cellStyles}>
        <select
          value={formData.tipo_envio}
          onChange={(e) => handleInputChange("tipo_envio", e.target.value)}
          className={`${inputStyles} cursor-pointer`}
        >
          <option value="">Seleccionar</option>
          <option value="express">Express</option>
          <option value="normal">Normal</option>
          <option value="economico">Económico</option>
        </select>
      </article>

      {/* OS/Transporte */}
      <article className={cellStyles}>
        <input
          type="text"
          value={formData.os_transporte}
          onChange={(e) => handleInputChange("os_transporte", e.target.value)}
          className={inputStyles}
          placeholder="OS/Transport"
        />
      </article>

      {/* Precio unitario */}
      <article className={cellStyles}>
        <input
          type="number"
          value={formData.precio_unitario}
          onChange={(e) => handleInputChange("precio_unitario", e.target.value)}
          className={inputStyles}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </article>

      {/* Agregado extra */}
      <article className={cellStyles}>
        <input
          type="number"
          value={formData.agregado_extra}
          onChange={(e) => handleInputChange("agregado_extra", e.target.value)}
          className={inputStyles}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </article>

      {/* Total a cobrar */}
      <article className={`${cellStyles} bg-yellow-50`}>
        <input
          type="number"
          value={formData.total_cobrar}
          onChange={(e) => handleInputChange("total_cobrar", e.target.value)}
          className={`${inputStyles} bg-yellow-50 font-semibold`}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </article>

      {/* Estado */}
      <article className={cellStyles}>
        <select
          value={formData.estado}
          onChange={(e) => handleInputChange("estado", e.target.value)}
          className={`${inputStyles} cursor-pointer`}
        >
          <option value="">Estado</option>
          <option value="pendiente">Pendiente</option>
          <option value="procesando">Procesando</option>
          <option value="enviado">Enviado</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </article>

      {/* Total cobrado */}
      <article className={`${cellStyles} bg-green-50`}>
        <input
          type="number"
          value={formData.total_cobrado}
          onChange={(e) => handleInputChange("total_cobrado", e.target.value)}
          className={`${inputStyles} bg-green-50`}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </article>

      {/* Aplicación anticipo */}
      <article className={cellStyles}>
        <input
          type="number"
          value={formData.aplicacion_anticipo}
          onChange={(e) =>
            handleInputChange("aplicacion_anticipo", e.target.value)
          }
          className={inputStyles}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </article>
    </section>
  );
}
