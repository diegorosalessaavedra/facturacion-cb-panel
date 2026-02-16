export const onInputPrice = (e) => {
  const value = e.target.value.replace(/[^0-9.]/g, "");
  const parts = value.split(".");

  if (parts.length > 2) {
    e.target.value = `${parts[0]}.`;
  } else if (parts.length === 2) {
    e.target.value = `${parts[0]}.${parts[1].slice(0, 2)}`;
  } else {
    e.target.value = value;
  }
};

export const onInputNumber = (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
};

export const onInputPriceCinco = (e) => {
  const value = e.target.value.replace(/[^0-9.]/g, ""); // Permitir solo números y punto decimal
  const parts = value.split("."); // Dividir por el punto decimal

  if (parts.length > 2) {
    // Si hay más de un punto decimal, limitar a solo el primero
    e.target.value = `${parts[0]}.`;
  } else if (parts.length === 2) {
    // Limitar la parte decimal a 5 dígitos
    e.target.value = `${parts[0]}.${parts[1].slice(0, 5)}`;
  } else {
    e.target.value = value; // Dejar el valor si no hay parte decimal
  }
};

export const numberPeru = (n) => {
  return Number(n || 0).toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
