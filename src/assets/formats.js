export const formatNumber = (num) =>
  Number(num)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const formatWithLeadingZeros = (number, length) => {
  return number?.toString().padStart(length, "0");
};

export const formatNumberSinDecimales = (num) =>
  Number(num)
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const formatearMontoPe = (monto) => {
  const numero = Number(monto);
  if (isNaN(numero)) return monto;
  return numero.toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
