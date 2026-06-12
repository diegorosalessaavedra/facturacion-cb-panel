import React, { useMemo } from "react";
import { Button, Spinner } from "@nextui-org/react";
import { FileDown, Upload, Eye } from "lucide-react";
import formatDate from "../../../../hooks/FormatDate";

const TablaVacaciones = ({
  onOpen,
  colaboradores,
  loading,
  setSelectModal,
  setSelectColaborador,
  setSelectPeriodo,
  setSelectVacacion,
}) => {
  // === 1. CLASES DE ESTILO MEJORADAS ===
  const stickyHeader1 = "sticky z-30 top-0";
  const stickyHeader2 = "sticky z-20 top-[38px]";

  const headerBase =
    "flex items-center justify-center font-bold text-[11px] uppercase tracking-wider py-2.5 px-2 text-center border-r border-b border-slate-300";

  const headerDark1 = `${headerBase} bg-slate-900 text-white`;
  const headerDark2 = `${headerBase} bg-slate-900 text-white`;
  const headerBlue1 = `${headerBase} bg-amber-500 text-slate-800`;
  const headerBlue2 = `${headerBase} bg-amber-500 text-slate-800`;

  const cellBase =
    "flex items-center justify-center text-[11px] py-2 px-2 border-r border-b border-slate-200 min-h-[48px] text-center";

  const cellData = `${cellBase} bg-white text-slate-700 `;
  const cellHighlight = `${cellBase} bg-amber-50 text-amber-900 font-bold`;
  const cellAlert = `${cellBase} bg-red-50 text-red-600 font-bold`;
  const cellGreen = `${cellBase} bg-green-50 text-green-600 font-bold`;

  // === 2. FUNCIONES DE CÁLCULO MATEMÁTICO ===
  const obtenerDiasTranscurridos = (fechaInicio) => {
    if (!fechaInicio) return 0;
    const inicio = new Date(fechaInicio);
    const hoy = new Date();
    const diferenciaMilisegundos = hoy - inicio;
    return Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
  };

  const calcularNeto = (dias) => {
    return Math.round((dias / 365) * 15);
  };

  // === 3. LÓGICA DE AÑOS DINÁMICOS ===
  const uniqueYears = useMemo(() => {
    if (!colaboradores) return [new Date().getFullYear()];
    const yearsSet = new Set();
    colaboradores.forEach((colab) => {
      colab.vacaciones?.forEach((vac) => {
        if (vac.year_vacaciones) yearsSet.add(vac.year_vacaciones);
      });
    });
    const yearsArray = Array.from(yearsSet);
    if (yearsArray.length === 0) return [new Date().getFullYear()];
    return yearsArray.sort((a, b) => a - b);
  }, [colaboradores]);

  return (
    <div className="w-full mx-auto flex items-center h-[75vh] p-4">
      {loading ? (
        <Spinner className="m-auto" label="Cargando..." color="primary" />
      ) : (
        <div className="w-full h-full overflow-auto shadow-xl rounded-xl bg-white border border-slate-300">
          <div
            className="grid"
            style={{
              // CORRECCIÓN 1: 'minmax' corregido y se añadieron 8 valores explícitos iniciales antes de los años
              gridTemplateColumns: `100px minmax(150px, 1fr) 90px 90px 90px 90px 90px 80px repeat(${uniqueYears.length}, 90px) 110px 90px 140px`,
              gridAutoRows: "max-content",
              // CORRECCIÓN 2: Se ajustó el ancho mínimo sumando la columna adicional
              minWidth: `${1130 + uniqueYears.length * 90}px`,
            }}
          >
            {/* SÚPER CABECERAS */}
            <div className={`col-span-8 ${headerDark1} ${stickyHeader1}`}>
              INFORMACIÓN DEL TRABAJADOR
            </div>
            <div
              className={`${headerBlue1} ${stickyHeader1}`}
              style={{ gridColumn: `span ${uniqueYears.length}` }}
            >
              VACACIONES EFECTIVAS POR AÑO
            </div>
            <div className={`${headerBlue1} ${stickyHeader1} col-span-2`}>
              VACACIONES
            </div>
            <div className={`col-span-1 ${headerDark1} ${stickyHeader1}`}>
              GESTIÓN
            </div>

            {/* CABECERAS DE COLUMNA */}
            <div className={`${headerDark2} ${stickyHeader2}`}>EMPRESA</div>
            <div className={`${headerDark2} ${stickyHeader2}`}>NOMBRE</div>
            <div className={`${headerDark2} ${stickyHeader2}`}>DNI</div>
            <div className={`${headerDark2} ${stickyHeader2}`}>F. INGRESO</div>
            <div className={`${headerDark2} ${stickyHeader2}`}>FECHA HOY</div>
            <div className={`${headerDark2} ${stickyHeader2}`}>DÍAS TRANS.</div>
            <div className={`${headerDark2} ${stickyHeader2}`}>REQUISITO</div>
            <div className={`${headerDark2} ${stickyHeader2}`}>ACUMULADO</div>

            {/* Años */}
            {uniqueYears.map((year) => (
              <div
                key={`header-${year}`}
                className={`${headerBlue2} ${stickyHeader2}`}
              >
                {year}
              </div>
            ))}

            <div className={`${headerBlue2} ${stickyHeader2}`}>
              AGREGAR <br />
              VACACIONES
            </div>
            <div className={`${headerBlue2} ${stickyHeader2}`}>DISPONIBLE</div>
            <div className={`${headerDark2} ${stickyHeader2}`}>ACCIONES</div>

            {/* CUERPO DE LA TABLA */}
            {colaboradores?.map((colab) => {
              const fechaInicioContrato = colab.contratos?.[0]?.fecha_inicio;
              const diasTrans = obtenerDiasTranscurridos(fechaInicioContrato);
              const netoCalculado = calcularNeto(diasTrans);

              // 1. CÁLCULO DE DÍAS DISPONIBLES
              const totalDiasSolicitados =
                colab.vacaciones?.reduce((acumulador, vacacion) => {
                  // Si el estado es RECHAZADO, no sumamos los días
                  if (vacacion.pendiente_autorizacion === "RECHAZADO") {
                    return acumulador;
                  }
                  // En caso de estar PENDIENTE o ACEPTADO, sumamos los días
                  return acumulador + (vacacion.dias_totales || 0);
                }, 0) || 0;

              const diasDisponibles = netoCalculado - totalDiasSolicitados;

              return (
                <React.Fragment key={colab.id}>
                  {/* Datos personales y fechas */}
                  <div className={cellData}>{colab.empresa}</div>

                  <div
                    className={`${cellData} font-black text-slate-800 justify-start text-left px-3`}
                  >
                    {colab.nombre_colaborador} {colab.apellidos_colaborador}
                  </div>
                  <div className={cellData}>{colab.dni_colaborador}</div>
                  <div className={cellData}>
                    {fechaInicioContrato
                      ? formatDate(fechaInicioContrato)
                      : "Sin contrato"}
                  </div>
                  <div className={cellHighlight}>
                    {new Date().toLocaleDateString("es-PE")}
                  </div>
                  <div className={cellHighlight}>{diasTrans} días</div>
                  <div className={cellData}>365 días</div>
                  <div className={cellHighlight}>{netoCalculado} días</div>

                  {/* COLUMNAS DE AÑOS CON MÚLTIPLES BOTONES */}
                  {uniqueYears.map((year) => {
                    const vacacionesEnEsteAnio = colab.vacaciones?.filter(
                      (v) => v.year_vacaciones === year,
                    );

                    return (
                      <div
                        key={`cell-${colab.id}-${year}`}
                        className={`${cellData} flex-col gap-1 py-2`}
                      >
                        {vacacionesEnEsteAnio &&
                        vacacionesEnEsteAnio.length > 0 ? (
                          vacacionesEnEsteAnio.map((vac) => {
                            // Determinamos el color de NextUI basado en el estado
                            let colorEstado = "primary"; // Color por defecto por si acaso
                            if (vac.pendiente_autorizacion === "ACEPTADO") {
                              colorEstado = "success"; // Verde
                            } else if (
                              vac.pendiente_autorizacion === "RECHAZADO"
                            ) {
                              colorEstado = "danger"; // Rojo
                            } else if (
                              vac.pendiente_autorizacion === "PENDIENTE"
                            ) {
                              colorEstado = "warning"; // Ámbar
                            }

                            return (
                              <Button
                                key={vac.id}
                                size="sm"
                                color={colorEstado}
                                variant="flat"
                                className="h-6 min-h-[24px] text-[10px] font-bold w-full px-1"
                                onPress={() => {
                                  setSelectModal("verVacaciones");
                                  setSelectColaborador(colab);
                                  setSelectVacacion(vac);
                                  onOpen();
                                }}
                              >
                                {vac.dias_totales} d
                              </Button>
                            );
                          })
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </div>
                    );
                  })}

                  {/* Agregar Vacaciones */}
                  <div className={cellData}>
                    {diasDisponibles > 0 ? (
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="h-7 text-[10px] font-bold w-full"
                        onPress={() => {
                          setSelectModal("nuevo");
                          setSelectColaborador(colab);
                          onOpen();
                        }}
                      >
                        Agregar
                      </Button>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </div>

                  {/* Celda Disponible con cálculo */}
                  <div
                    className={
                      diasDisponibles >= 0 && diasDisponibles <= 7
                        ? cellHighlight
                        : diasDisponibles >= 8 && diasDisponibles <= 15
                          ? cellGreen
                          : cellAlert
                    }
                  >
                    {diasDisponibles} días
                  </div>

                  {/* Acciones */}
                  <div className={`${cellData} gap-2 px-2`}>
                    <Button
                      size="sm"
                      color="warning"
                      className="font-bold h-8 text-[9px] w-full"
                      startContent={<Eye size={12} />}
                      onPress={() => {
                        setSelectColaborador(colab);
                        setSelectModal("historial");
                        onOpen();
                      }}
                    >
                      VER HISTORIAL
                    </Button>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaVacaciones;
