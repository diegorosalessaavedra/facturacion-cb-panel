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

  // Nota: Si usas 'UTC', asegúrate de que dateString tenga formato YYYY-MM-DD
  // o agrega la hora para evitar desfases de zona horaria.
  const date = new Date(dateString + "T00:00:00");

  const formattedDate = new Intl.DateTimeFormat("es-ES", {
    weekday: "long", // Nombre del día: jueves
    day: "numeric", // Número del día: 23
    month: "long", // Nombre del mes: abril
    year: "numeric", // Año: 2026
  }).format(date);

  // Capitalizar la primera letra (opcional, para que quede: Jueves, ...)
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}
