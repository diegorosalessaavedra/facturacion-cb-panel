export const NOMBRES_MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Setiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const formatearSemanas = (semanas = []) => {
  if (!Array.isArray(semanas) || semanas.length === 0) return "";
  return semanas
    .map((s, idx) => s.nombre || s.semana || `SEMANA ${idx + 1}`)
    .join(", ");
};

export const construirPeriodosBase = (mesesBd, year) => {
  const filas = [];
  let orden = 1;

  for (let i = 1; i <= 12; i++) {
    const mesEncontrado = mesesBd.find(
      (m) =>
        Number(m.mes) === i ||
        String(m.mes).toLowerCase() === NOMBRES_MESES[i - 1].toLowerCase(),
    );

    filas.push({
      orden: orden++,
      nombre_periodo: `${NOMBRES_MESES[i - 1]} - ${year}`,
      mes_id: mesEncontrado?.id ?? null,
      semanas: formatearSemanas(mesEncontrado?.semanas_planilla),
      remu_bruta: "",
      retencion_5ta: "",
      aplicaRetencion: true,
    });

    if (i === 7) {
      filas.push({
        orden: orden++,
        nombre_periodo: `Gratificacion Julio - ${year}`,
        mes_id: null,
        semanas: "",
        remu_bruta: "",
        retencion_5ta: "",
        aplicaRetencion: false,
      });
      filas.push({
        orden: orden++,
        nombre_periodo: "Bonificación",
        mes_id: null,
        semanas: "",
        remu_bruta: "",
        retencion_5ta: "",
        aplicaRetencion: false,
      });
    }

    if (i === 12) {
      filas.push({
        orden: orden++,
        nombre_periodo: `Gratificacion Diciembre - ${year}`,
        mes_id: null,
        semanas: "",
        remu_bruta: "",
        retencion_5ta: "",
        aplicaRetencion: false,
      });
      filas.push({
        orden: orden++,
        nombre_periodo: "Bonificación",
        mes_id: null,
        semanas: "",
        remu_bruta: "",
        retencion_5ta: "",
        aplicaRetencion: false,
      });
    }
  }

  return filas;
};

export const construirTramosBase = (montoUit) => {
  const monto = Number(montoUit) || 0;
  return [
    {
      tramos_escala: "Primer Tramo (de 0 - 5 UIT): 8%.",
      maximos: Number((monto * 5).toFixed(2)),
      tasa: 0.08,
      esSinLimite: false,
      renta_5ta: "",
      distribucion_tramos: "",
    },
    {
      tramos_escala: "Segundo Tramo (de 5 – 20 UIT): 14%.",
      maximos: Number((monto * 15).toFixed(2)),
      tasa: 0.14,
      esSinLimite: false,
      renta_5ta: "",
      distribucion_tramos: "",
    },
    {
      tramos_escala: "Tercer Tramo (de 20 - 35 UIT): 17%.",
      maximos: Number((monto * 15).toFixed(2)),
      tasa: 0.17,
      esSinLimite: false,
      renta_5ta: "",
      distribucion_tramos: "",
    },
    {
      tramos_escala: "Cuarto Tramo (de 35 - 45 UIT): 20%.",
      maximos: Number((monto * 10).toFixed(2)),
      tasa: 0.2,
      esSinLimite: false,
      renta_5ta: "",
      distribucion_tramos: "",
    },
    {
      tramos_escala: "Quinto Tramo (más de 45 UIT): 30%.",
      maximos: 0,
      tasa: 0.3,
      esSinLimite: true,
      renta_5ta: "",
      distribucion_tramos: "",
    },
  ];
};
