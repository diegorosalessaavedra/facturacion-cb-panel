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
