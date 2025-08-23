import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Chip,
} from "@nextui-org/react";
import { MdEmail } from "react-icons/md";
import { FaAddressCard, FaUser, FaBriefcase } from "react-icons/fa";
import { FaMapLocation, FaSquarePhone, FaBook } from "react-icons/fa6";
import { BsFillCake2Fill, BsPersonVcardFill } from "react-icons/bs";
import { RiMapPin5Fill } from "react-icons/ri";
import formatDate from "../../../../hooks/FormatDate";
import generateColaboradorPdf from "../../../../assets/plantillapdfcolaboradores";

// Constante para la URL base de la API
const laravelUrl = import.meta.env.VITE_LARAVEL_URL;

// Componente reutilizable para mostrar una fila de información
const InfoRow = ({ icon, label, children }) => {
  if (!children) return null; // No renderizar si no hay contenido

  return (
    <li className="flex items-start gap-3 text-sm">
      <span className="text-lg text-primary pt-0.5">{icon}</span>
      <div className="flex-grow">
        {label && (
          <span className="font-semibold text-neutral-700">{label}: </span>
        )}
        <span className="text-neutral-600">{children}</span>
      </div>
    </li>
  );
};

// Componente reutilizable para las cabeceras de sección
const SectionHeader = ({ children }) => (
  <h4 className="text-base font-semibold text-neutral-800 mt-2">{children}</h4>
);

const ModalVerMasColaborador = ({
  isOpen,
  onOpenChange,
  selectColaborador,
}) => {
  // Retorna null si no hay un colaborador seleccionado para evitar errores
  if (!selectColaborador) {
    return null;
  }

  // Desestructuramos los datos del colaborador para un acceso más fácil
  const {
    nombre_colaborador,
    apellidos_colaborador,
    foto_colaborador,
    dni_colaborador,
    correo_colaborador,
    telefono_colaborador,
    direccion_colaborador,
    departamento_colaborador,
    provincia_colaborador,
    distrito_colaborador,
    fecha_nacimiento_colaborador,
    cargo_laboral,
    tipo_empleo_colaborador,
    cv_colaborador,
    documentos_complementarios = [],
    contratos = [],
    memos = [],
    estado,
    nombre_contacto_emergencia,
    apellidos_contacto_emergencia,
    vinculo_contacto_emergencia,
    telefono_contacto_emergencia,
    nombre_contacto_emergencia2,
    apellidos_contacto_emergencia2,
    vinculo_contacto_emergencia2,
    telefono_contacto_emergencia2,
  } = selectColaborador;

  const fotoUrl = `${laravelUrl}/api/colaboradores/${foto_colaborador}`;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="4xl"
    >
      <ModalContent className="h-[80vh]">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-base">
              {apellidos_colaborador} {nombre_colaborador}
            </ModalHeader>

            <ModalBody className="overflow-y-auto p-4">
              <div className="flex flex-col gap-4">
                {/* SECCIÓN PRINCIPAL: FOTO Y DATOS PERSONALES */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0 text-center">
                    <img
                      className="w-32 h-32 object-cover rounded-xl shadow-md shadow-neutral-500"
                      src={fotoUrl}
                      alt={`Foto de ${nombre_colaborador}`}
                    />
                    {estado && (
                      <Chip
                        color={estado === "ACTIVO" ? "success" : "danger"}
                        variant="flat"
                        className="mt-2"
                      >
                        {estado}
                      </Chip>
                    )}
                  </div>

                  <div className="flex-grow flex flex-col gap-2 w-full">
                    <h3 className="text-xl font-semibold text-neutral-800">
                      {nombre_colaborador} {apellidos_colaborador}
                    </h3>
                    <Divider />
                    <SectionHeader>Datos Personales</SectionHeader>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                      <InfoRow icon={<FaAddressCard />} label="DNI">
                        {dni_colaborador}
                      </InfoRow>
                      <InfoRow icon={<MdEmail />} label="Correo">
                        {correo_colaborador}
                      </InfoRow>
                      <InfoRow icon={<FaSquarePhone />} label="Teléfono">
                        {telefono_colaborador}
                      </InfoRow>
                      <InfoRow icon={<FaMapLocation />} label="Dirección">
                        {direccion_colaborador}
                      </InfoRow>
                      <InfoRow
                        icon={<BsFillCake2Fill />}
                        label="Fecha de Nacimiento"
                      >
                        {formatDate(fecha_nacimiento_colaborador)}
                      </InfoRow>
                      <InfoRow
                        icon={<RiMapPin5Fill />}
                        label="Lugar de Nacimiento"
                      >
                        <strong>{`${departamento_colaborador} - ${provincia_colaborador} - ${distrito_colaborador}`}</strong>
                      </InfoRow>
                    </ul>
                  </div>
                </div>

                <Divider />

                {/* SECCIÓN DATOS LABORALES */}
                <section>
                  <SectionHeader>Datos Laborales</SectionHeader>
                  <ul className="flex flex-col gap-2 mt-2">
                    <InfoRow icon={<FaBriefcase />} label="Cargo">
                      {cargo_laboral?.cargo}
                    </InfoRow>
                    <InfoRow icon={<FaBriefcase />} label="Tipo de Empleo">
                      {tipo_empleo_colaborador}
                    </InfoRow>
                  </ul>
                </section>

                <Divider />

                {/* SECCIÓN CONTACTOS DE EMERGENCIA */}
                <section>
                  <SectionHeader>Contactos de Emergencia</SectionHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    {/* Contacto 1 */}
                    {(nombre_contacto_emergencia ||
                      telefono_contacto_emergencia) && (
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-semibold text-sm mb-2">
                          Contacto 1
                        </h5>
                        <ul className="flex flex-col gap-2">
                          <InfoRow
                            icon={<FaUser />}
                            label="Nombre"
                          >{`${nombre_contacto_emergencia} ${apellidos_contacto_emergencia}`}</InfoRow>
                          <InfoRow icon={<BsPersonVcardFill />} label="Vínculo">
                            {vinculo_contacto_emergencia}
                          </InfoRow>
                          <InfoRow icon={<FaSquarePhone />} label="Teléfono">
                            {telefono_contacto_emergencia}
                          </InfoRow>
                        </ul>
                      </div>
                    )}
                    {/* Contacto 2 */}
                    {(nombre_contacto_emergencia2 ||
                      telefono_contacto_emergencia2) && (
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-semibold text-sm mb-2">
                          Contacto 2
                        </h5>
                        <ul className="flex flex-col gap-2">
                          <InfoRow
                            icon={<FaUser />}
                            label="Nombre"
                          >{`${nombre_contacto_emergencia2} ${apellidos_contacto_emergencia2}`}</InfoRow>
                          <InfoRow icon={<BsPersonVcardFill />} label="Vínculo">
                            {vinculo_contacto_emergencia2}
                          </InfoRow>
                          <InfoRow icon={<FaSquarePhone />} label="Teléfono">
                            {telefono_contacto_emergencia2}
                          </InfoRow>
                        </ul>
                      </div>
                    )}
                  </div>
                </section>

                <Divider />

                {/* SECCIÓN DOCUMENTOS */}
                <section>
                  <SectionHeader>Documentos</SectionHeader>
                  <ul className="list-disc list-inside mt-2 flex flex-col gap-2">
                    {cv_colaborador && (
                      <li>
                        <a
                          href={`${laravelUrl}/colaboradores/${cv_colaborador}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Descargar CV
                        </a>
                      </li>
                    )}
                    {documentos_complementarios.length > 0 ? (
                      documentos_complementarios.map((doc) => (
                        <li key={doc.id}>
                          <a
                            href={`${laravelUrl}/colaboradores/${doc.link_doc_complementario}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {doc.nombre_doc_complementario}
                          </a>
                        </li>
                      ))
                    ) : (
                      <li className="text-neutral-500">
                        No hay documentos complementarios.
                      </li>
                    )}
                  </ul>
                </section>

                {/* SECCIONES ADICIONALES (Contratos y Memos) */}
                <Divider />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <section>
                    <SectionHeader>Contratos</SectionHeader>
                    {/* Asumo que 'contratos' es un array de objetos con {id, nombre_contrato} */}
                    <ul className="list-disc list-inside mt-2">
                      {contratos.length > 0 ? (
                        contratos.map((c) => (
                          <li key={c.id} className="text-sm">
                            {c.fecha_inicio} - {c.fecha_final}{" "}
                            <span
                              className={`${
                                c.estado_contrato === "vigente"
                                  ? "text-blue-600"
                                  : "text-red-500"
                              } `}
                            >
                              {c.estado_contrato}
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="text-neutral-500">
                          No hay contratos registrados.
                        </li>
                      )}
                    </ul>
                  </section>
                  <section>
                    <SectionHeader>Memos</SectionHeader>
                    {/* Asumo que 'memos' es un array de objetos con {id, motivo_memo} */}
                    <ul className="list-disc list-inside mt-2">
                      {memos.length > 0 ? (
                        memos.map((m) => <li key={m.id}>{m.motivo_memo}</li>)
                      ) : (
                        <li className="text-neutral-500">
                          No hay memos registrados.
                        </li>
                      )}
                    </ul>
                  </section>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cerrar
              </Button>
              <Button
                color="primary"
                onPress={() =>
                  generateColaboradorPdf(selectColaborador, laravelUrl)
                }
              >
                Descargar PDF
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalVerMasColaborador;
