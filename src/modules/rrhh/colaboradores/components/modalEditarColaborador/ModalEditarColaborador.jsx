import { useState } from "react";
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import config from "../../../../../utils/getToken";
import Loading from "../../../../../hooks/Loading";
import { FaPlus, FaTrash, FaTrashAlt } from "react-icons/fa"; // Importamos FaTrash para el botón de eliminar
import { inputClassNames } from "../../../../../assets/classNames";
import EditarDatosPesonalesColaborador from "./components/EditarDatosPesonalesColaborador";
import EditarEducacionCargoLaboral from "./components/EditarEducacionCargoLaboral";

const laravelUrl = import.meta.env.VITE_LARAVEL_URL;

const ModalEditarColaborador = ({
  isOpen,
  onOpenChange,
  handleFindColaboradores,
  selectColaborador,
}) => {
  const { register, handleSubmit, reset } = useForm();
  const [departamento, setDepartamento] = useState();
  const [provincia, setProvincia] = useState();
  const [distrito, setDistrito] = useState();
  const [archivosComplementarios, setArchivosComplementarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [foto, setfoto] = useState();
  const [deletesDocsId, setDeletesDocsId] = useState([]);

  const handleAddArchivo = () => {
    setArchivosComplementarios([
      ...archivosComplementarios,
      { id: Date.now(), name: "", file: null }, // Usamos Date.now() como un id simple
    ]);
  };

  const handleRemoveArchivo = (id) => {
    setArchivosComplementarios(
      archivosComplementarios.filter((archivo) => archivo.id !== id)
    );
  };

  const handleFileNameChange = (id, value) => {
    setArchivosComplementarios(
      archivosComplementarios.map((archivo) =>
        archivo.id === id ? { ...archivo, name: value } : archivo
      )
    );
  };

  const handleFileChange = (id, selectedFile) => {
    setArchivosComplementarios(
      archivosComplementarios.map((archivo) =>
        archivo.id === id ? { ...archivo, file: selectedFile } : archivo
      )
    );
  };

  const submit = (data) => {
    setLoading(true);

    const url = `${import.meta.env.VITE_URL_API}/rrhh/colaboradores/${
      selectColaborador.id
    }`;

    const formData = new FormData();

    formData.append("nombre_colaborador", data.nombre_colaborador);
    formData.append("apellidos_colaborador", data.apellidos_colaborador);
    formData.append(
      "fecha_nacimiento_colaborador",
      data.fecha_nacimiento_colaborador
    );
    formData.append("dni_colaborador", data.dni_colaborador);
    formData.append("telefono_colaborador", data.telefono_colaborador);
    formData.append("correo_colaborador", data.correo_colaborador);
    formData.append(
      "nombre_contacto_emergencia",
      data.nombre_contacto_emergencia
    );
    formData.append(
      "apellidos_contacto_emergencia",
      data.apellidos_contacto_emergencia
    );
    formData.append(
      "telefono_contacto_emergencia",
      data.telefono_contacto_emergencia
    );
    formData.append(
      "vinculo_contacto_emergencia",
      data.vinculo_contacto_emergencia
    );

    formData.append(
      "nombre_contacto_emergencia2",
      data.nombre_contacto_emergencia2
    );
    formData.append(
      "apellidos_contacto_emergencia2",
      data.apellidos_contacto_emergencia2
    );
    formData.append(
      "telefono_contacto_emergencia2",
      data.telefono_contacto_emergencia2
    );
    formData.append(
      "vinculo_contacto_emergencia2",
      data.vinculo_contacto_emergencia2
    );
    formData.append("direccion_colaborador", data.direccion_colaborador);
    formData.append("departamento_colaborador", departamento.Departamento);
    formData.append("provincia_colaborador", provincia.Provincia);
    formData.append("distrito_colaborador", distrito.Distrito);

    formData.append("cargo_laboral_id", data.cargo_laboral_id);
    deletesDocsId.forEach((id) => {
      formData.append("deletesDocsId[]", id);
    });
    if (foto) {
      formData.append("foto_colaborador", foto);
    }
    // Archivo CV (existente)
    if (data.cv_colaborador && data.cv_colaborador[0]) {
      formData.append("cv_colaborador", data.cv_colaborador[0]);
    }

    // --- Agregar archivos complementarios al FormData ---
    archivosComplementarios.forEach((archivo, index) => {
      if (archivo.file) {
        // Solo agregamos si hay un archivo seleccionado
        // Es crucial que el nombre del campo coincida con la configuración de Multer en el backend
        formData.append(`archivos_complementarios`, archivo.file); // Envía cada archivo con el mismo nombre de campo
        // También enviamos los nombres ingresados por el usuario en un array separado
        formData.append(
          `archivos_complementarios_names[${index}]`,
          archivo.name
        );
      }
    });
    // --- FIN NUEVO ---

    axios
      .patch(url, formData, config)
      .then(() => {
        toast.success("El colaborador se registró correctamente");
        handleFindColaboradores();
        onOpenChange(false);
        reset();
        setArchivosComplementarios([]); // Limpiar archivos complementarios al cerrar
      })
      .catch((err) => {
        toast.error(
          err.response.data?.error ||
            "Hubo un error al registrar al colaborador. Revisa la consola para más detalles."
        );
      })
      .finally(() => {
        setLoading(false); // Corregido: debe ser false al finalizar
      });
  };

  console.log(deletesDocsId);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="5xl"
    >
      <ModalContent className="h-[80svh]">
        <ModalHeader className="flex flex-col gap-1 text-base">
          Registrar nuevo colaborador
        </ModalHeader>
        <ModalBody className="h-full overflow-y-auto">
          {loading && <Loading />}
          <div className="w-full flex flex-col  ">
            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(submit)}
            >
              <EditarDatosPesonalesColaborador
                register={register}
                setDepartamento={setDepartamento}
                setProvincia={setProvincia}
                setDistrito={setDistrito}
                setfoto={setfoto}
                selectColaborador={selectColaborador}
              />
              <EditarEducacionCargoLaboral
                register={register}
                selectColaborador={selectColaborador}
              />

              <h3>Documentos complementarios</h3>
              <div className="w-full max-w-2xl ">
                {selectColaborador?.documentos_complementarios?.map((doc) => (
                  <div key={doc.id} className="w-full flex justify-between">
                    <a
                      href={`${laravelUrl}/colaboradores/${doc.link_doc_complementario}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {doc.nombre_doc_complementario}
                    </a>

                    <div className="flex gap-2">
                      <button type="button">
                        <FaTrashAlt
                          className="text-lg text-red-500 cursor-pointer"
                          onClick={() => {
                            if (deletesDocsId.some((d) => d === doc.id)) {
                              setDeletesDocsId((prev) =>
                                prev.filter((d) => d !== doc.id)
                              );
                            } else {
                              setDeletesDocsId((prev) => [...prev, doc.id]);
                            }
                          }}
                        />
                      </button>
                      <Checkbox
                        isDisabled
                        color="danger"
                        isSelected={deletesDocsId.includes(doc.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <h3>Agregar documentos complementarios</h3>
              {/* Botón para agregar nuevos campos de archivo */}
              <Button
                color="primary"
                onPress={handleAddArchivo}
                className="w-fit" // Ajusta el ancho del botón
              >
                <FaPlus /> Agregar Archivo
              </Button>

              {archivosComplementarios.map((archivo) => (
                <div
                  key={archivo.id}
                  className="w-full flex gap-2 items-center"
                >
                  <Input
                    className="flex-grow" // Permite que el input de nombre crezca
                    classNames={inputClassNames}
                    labelPlacement="outside"
                    type="text"
                    variant="bordered"
                    label="Nombre del archivo"
                    placeholder="..."
                    radius="sm"
                    size="sm"
                    value={archivo.name}
                    onChange={(e) =>
                      handleFileNameChange(archivo.id, e.target.value)
                    }
                  />
                  <Input
                    className="flex-grow" // Permite que el input de archivo crezca
                    classNames={inputClassNames}
                    labelPlacement="outside"
                    type="file"
                    variant="bordered"
                    label="Seleccione el archivo complementario"
                    placeholder="..."
                    radius="sm"
                    size="sm"
                    accept=".doc,.docx,.pdf"
                    onChange={(e) =>
                      handleFileChange(archivo.id, e.target.files[0])
                    }
                  />
                  {/* Botón para eliminar este par de campos */}
                  <Button
                    isIconOnly
                    color="danger"
                    variant="light"
                    onPress={() => handleRemoveArchivo(archivo.id)}
                    className="self-end mb-2" // Alinea el botón con los inputs
                  >
                    <FaTrash />
                  </Button>
                </div>
              ))}
              {/* --- FIN Renderizar --- */}

              <div className="w-full flex items-center justify-end gap-3 p-4">
                <Button
                  color="danger"
                  type="button"
                  onPress={() => {
                    onOpenChange();
                    reset();
                    setArchivosComplementarios([]);
                    setDeletesDocsId([]);
                  }}
                >
                  Cancelar
                </Button>
                <Button color="primary" type="submit">
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalEditarColaborador;
