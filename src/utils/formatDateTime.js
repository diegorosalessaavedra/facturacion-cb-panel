export const formatDateTime = (dateInput) => {
  if (!dateInput) return "";

  // Javascript lee directamente el formato ISO sin necesidad de hacer split
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    return "Fecha inválida";
  }

  // Extraer fecha
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  // Extraer hora
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convertir a formato 12 horas
  hours = hours % 12;
  hours = hours ? hours : 12; // la hora '0' debe ser '12'
  const formattedHours = String(hours).padStart(2, "0");

  return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
};

export function formatDateES(dateString) {
  if (!dateString) return "-";

  let finalDateString = dateString;

  // Solo agregamos "T00:00:00" si el string es puramente una fecha corta (YYYY-MM-DD)
  // Si ya trae formato ISO con hora (ej. 2026-10-12T15:00:00Z), lo respeta.
  if (typeof dateString === "string" && dateString.length === 10) {
    finalDateString += "T00:00:00";
  }

  const date = new Date(finalDateString);

  // Validación de seguridad para evitar que la app crashee
  if (isNaN(date.getTime())) return "-";

  const formattedDate = new Intl.DateTimeFormat("es-ES", {
    weekday: "long", // Nombre del día: jueves
    day: "numeric", // Número del día: 23
    month: "long", // Nombre del mes: abril
    year: "numeric", // Año: 2026
  }).format(date);

  // Capitalizar la primera letra (opcional, para que quede: Jueves, ...)
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

export const formatToPeruTime = (dateString) => {
  if (!dateString) return "";
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) return "";

  return dateObj.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Lima",
  });
};