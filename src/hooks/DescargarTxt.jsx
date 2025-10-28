import { Button } from "@nextui-org/react";
import { formatWithLeadingZeros } from "../assets/formats";
import axios from "axios";
import config from "../utils/getToken";

export default function DescargarLayout({
  txtSolpeds,
  handleFindOrdenCompras,
}) {
  const obtenerFechaActual = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return { today, fechaFormateada: `${year}${month}${day}` };
  };

  const determinarTipoCuenta = (nroCuenta) => {
    const longitud = String(nroCuenta).length;
    switch (longitud) {
      case 13:
        return "C";
      case 14:
        return "A";
      default:
        return "B";
    }
  };

  const calcularSemanaDelAno = (fecha) => {
    const inicioAno = new Date(fecha.getFullYear(), 0, 1);
    const diferenciaDias =
      Math.floor((fecha - inicioAno) / (1000 * 60 * 60 * 24)) + 1;
    return Math.ceil(diferenciaDias / 7);
  };

  const calcularTotalSaldos = (ordenes) => {
    const total = ordenes.reduce(
      (suma, orden) => suma + Number(orden.monto_txt || 0),
      0
    );
    return formatWithLeadingZeros(total.toFixed(2), 17);
  };

  const calcularSumaNroCuenta = (ordenes) => {
    return ordenes.reduce((suma, orden) => {
      const nroCuenta = String(orden.nro_cuenta_bco || "");
      const slice =
        nroCuenta.length === 20 ? nroCuenta.slice(0, 11) : nroCuenta.slice(3);
      return suma + Number(slice || 0);
    }, 0);
  };

  const generarLineaEncabezado = (
    numeroSolpeds,
    fecha,
    totalFormateado,
    semana,
    sumaCuentas
  ) => {
    const cuentaBancaria =
      import.meta.env.VITE_EMPRESA === "GPCB"
        ? "1937211891082"
        : "11912682922020";
    const numeroControl = formatWithLeadingZeros(sumaCuentas + 2682922020, 15);
    return `1${numeroSolpeds}${fecha}C000${cuentaBancaria}       ${totalFormateado}PAGOS SEMANA ${semana}                         N${numeroControl}`;
  };

  const determinarTipoDocumento = (tipoDoc) => {
    return tipoDoc === "RUC" ? "6" : "1";
  };

  const generarLineaDetalle = (ordenCompra) => {
    const { proveedor, nro_cuenta_bco, monto_txt } = ordenCompra;

    if (!proveedor) {
      console.warn("Orden de compra sin proveedor:", ordenCompra);
      return null;
    }

    const tipoDocIdentidad = determinarTipoDocumento(
      proveedor.tipoDocIdentidad
    );
    const montoFormateado = formatWithLeadingZeros(
      Number(monto_txt || 0).toFixed(2),
      17
    );
    const numeroDoc = proveedor.numeroDoc || "";
    const nombreComercial = proveedor.nombreComercial || "";
    const tipoDeCuenta = determinarTipoCuenta(ordenCompra.nro_cuenta_bco);

    return `2${tipoDeCuenta}${String(nro_cuenta_bco).padEnd(
      20,
      " "
    )}1${tipoDocIdentidad}${String(numeroDoc).padEnd(15, " ")}${String(
      nombreComercial
    )
      .slice(0, 75)
      .padEnd(75, " ")}${String(ordenCompra.observacion)
      .slice(0, 40)
      .padEnd(40, " ")}Ref Emp ${String(numeroDoc).padEnd(
      12,
      " "
    )}0001${montoFormateado}S`;
  };

  const descargarArchivo = (contenido) => {
    try {
      const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const enlace = document.createElement("a");
      const { fechaFormateada } = obtenerFechaActual();
      enlace.href = url;
      enlace.download = `${fechaFormateada}_soles.txt`;
      enlace.style.display = "none";

      document.body.appendChild(enlace);
      enlace.click();
      document.body.removeChild(enlace);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      alert("Error al generar el archivo. Por favor, inténtalo de nuevo.");
    }
  };

  const updateValidacionMasivo = () => {
    const url = `${
      import.meta.env.VITE_URL_API
    }/compras/orden-compra/validacion-masivo`;

    axios.patch(url, { ordenesCompras: txtSolpeds }, config).then((res) => {
      handleFindOrdenCompras();
    });
  };

  const handleDownload = () => {
    if (txtSolpeds.length === 0) {
      alert("No hay órdenes de compra validadas para descargar.");
      return;
    }

    try {
      const { today, fechaFormateada } = obtenerFechaActual();
      const numeroSolpeds = formatWithLeadingZeros(txtSolpeds.length, 6);
      const totalFormateado = calcularTotalSaldos(txtSolpeds);
      const semanaDelAno = calcularSemanaDelAno(today);
      const sumaNroCuenta = calcularSumaNroCuenta(txtSolpeds);

      // Generar línea de encabezado
      const lineaEncabezado = generarLineaEncabezado(
        numeroSolpeds,
        fechaFormateada,
        totalFormateado,
        semanaDelAno,
        sumaNroCuenta
      );

      // Generar líneas de detalle
      const lineasDetalle = txtSolpeds
        .map(generarLineaDetalle)
        .filter((linea) => linea !== null); // Filtrar líneas inválidas

      // Construir contenido final
      const contenido = [lineaEncabezado, ...lineasDetalle].join("\n");

      // Descargar archivo
      descargarArchivo(contenido);

      updateValidacionMasivo();
    } catch (error) {
      console.error("Error al procesar las órdenes de compra:", error);
      alert(
        "Error al procesar los datos. Verifica que toda la información esté completa."
      );
    }
  };

  return (
    <Button
      onPress={handleDownload}
      className=" text-white"
      disabled={txtSolpeds.length === 0}
      color="success"
    >
      {txtSolpeds.length === 0 ? "Sin datos" : `Descargar TXT`}
    </Button>
  );
}
