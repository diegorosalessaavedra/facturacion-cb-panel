import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Autocomplete,
  AutocompleteItem,
  Divider,
  Chip,
} from "@nextui-org/react";
import axios from "axios";
import config from "../../../../utils/getToken";
import { toast } from "sonner";
import { handleAxiosError } from "../../../../utils/handleAxiosError";
import { API } from "../../../../utils/api";
import {
  Link,
  Unlink,
  Users,
  UserPlus,
  Search,
  IdCard,
  UsersRound,
} from "lucide-react";

const ClientesRevendedor = ({
  isOpen,
  onOpenChange,
  findClients,
  selectCliente,
  sinRevendedor,
}) => {
  const [clientesRevendedor, setClientesRevendedor] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [loadingRemoveId, setLoadingRemoveId] = useState(null);

  const nombreRevendedor =
    selectCliente?.nombreComercial ||
    selectCliente?.nombreApellidos ||
    "Revendedor";

  const getInitials = (name) => {
    if (!name) return "CL";
    return name.substring(0, 2).toUpperCase();
  };

  const handleClientesRevendedor = () => {
    if (!selectCliente?.id) return;

    const url = `${API}/clientes/revendedor/${selectCliente.id}`;
    axios
      .get(url, config)
      .then((res) => {
        setClientesRevendedor(res.data.clientes || []);
      })
      .catch((err) => handleAxiosError(err));
  };

  useEffect(() => {
    if (isOpen && selectCliente?.id) {
      handleClientesRevendedor();
      setSelectedClientId(null);
    }
  }, [selectCliente?.id, isOpen]);

  const handleAsociar = async () => {
    if (!selectedClientId) {
      return toast.warning("Por favor, selecciona un cliente primero.");
    }

    setIsLoadingAdd(true);
    try {
      const url = `${API}/clientes/asociar-revendedor/${selectedClientId}`;
      await axios.patch(url, { revendedor_id: selectCliente.id }, config);

      toast.success("Cliente asociado con éxito.");
      setSelectedClientId(null);

      handleClientesRevendedor();
      if (findClients) findClients();
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setIsLoadingAdd(false);
    }
  };

  const handleDesasociar = async (clienteId) => {
    setLoadingRemoveId(clienteId);
    try {
      const url = `${API}/clientes/desasociar-revendedor/${clienteId}`;
      await axios.patch(url, { revendedor_id: null }, config);

      toast.success("Cliente desasociado del revendedor.");

      handleClientesRevendedor();
      if (findClients) findClients();
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoadingRemoveId(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="2xl"
      classNames={{
        base: "bg-white",
        header: "border-b border-slate-100",
        footer: "border-t border-slate-100",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 pb-4 pt-6 px-6">
          <div className="flex items-center gap-3">
            {/* 🟢 Slate-900 con acento Amber para el ícono principal */}
            <div className="p-2 bg-slate-900 text-amber-400 rounded-xl shadow-md shadow-slate-900/10">
              <UsersRound size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                Gestión de Clientes
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                Revendedor:{" "}
                <span className="text-slate-900 font-bold">
                  {nombreRevendedor}
                </span>
              </p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="p-6">
          {/* SECCIÓN 1: AGREGAR NUEVO CLIENTE */}
          <div className="w-full flex flex-col gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2">
              {/* 🟢 Green para indicar acción positiva de agregar */}
              <UserPlus size={18} className="text-green-600" />
              <p className="text-sm font-bold text-slate-800">
                Vincular un nuevo cliente
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Autocomplete
                className="w-full"
                inputProps={{
                  classNames: {
                    input: "text-sm font-medium placeholder:text-slate-400",
                    // 🟢 Green para el focus del input
                    inputWrapper:
                      "bg-white min-h-[44px] border-slate-200 hover:border-green-400 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 shadow-sm transition-all",
                  },
                }}
                placeholder="Busca por nombre o DNI..."
                variant="bordered"
                radius="md"
                size="md"
                startContent={<Search size={16} className="text-slate-400" />}
                selectedKey={selectedClientId}
                onSelectionChange={setSelectedClientId}
              >
                {sinRevendedor?.map((cliente) => {
                  const nombre =
                    cliente.nombreApellidos || cliente.nombreComercial;
                  return (
                    <AutocompleteItem
                      key={cliente.id}
                      value={cliente.id}
                      textValue={`${nombre} - ${cliente.numeroDoc}`}
                    >
                      <span className="text-xs font-bold text-slate-800">
                        {nombre}
                      </span>{" "}
                      -{" "}
                      <span className="text-xs text-slate-500 font-medium">
                        Doc: {cliente.numeroDoc}
                      </span>
                    </AutocompleteItem>
                  );
                })}
              </Autocomplete>

              {/* 🟢 Green para el botón de Asociar */}
              <Button
                radius="md"
                className="bg-green-600 hover:bg-green-700 text-white font-bold shrink-0 h-[44px] px-6 shadow-md shadow-green-600/20 transition-all"
                isLoading={isLoadingAdd}
                onClick={handleAsociar}
                isDisabled={!selectedClientId}
                startContent={!isLoadingAdd && <Link size={16} />}
              >
                Asociar
              </Button>
            </div>
          </div>

          <Divider className="my-4 opacity-50" />

          {/* SECCIÓN 2: LISTA DE CLIENTES ASOCIADOS */}
          <section className="flex flex-col gap-3 h-full">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Users size={16} className="text-slate-500" />
                Clientes Vinculados
              </h3>
              {/* 🟢 Slate-900 y Amber para el Chip contador */}
              <Chip
                size="sm"
                className="bg-slate-900 text-amber-400 font-bold border-none"
              >
                {clientesRevendedor.length}
              </Chip>
            </div>

            <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
              {clientesRevendedor.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <UsersRound size={40} className="text-slate-300 mb-3" />
                  <p className="text-sm font-bold text-slate-700">
                    Sin clientes asociados
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-[250px]">
                    Utiliza el buscador de arriba para vincular el primer
                    cliente a este revendedor.
                  </p>
                </div>
              ) : (
                clientesRevendedor.map((cliente) => {
                  const nombre =
                    cliente.nombreApellidos || cliente.nombreComercial;
                  return (
                    <div
                      key={cliente.id}
                      className="group flex justify-between items-center p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md hover:shadow-slate-900/5 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        {/* 🟢 Efecto Hover inverso (Slate + Amber) en el Avatar */}
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0 border border-slate-200 group-hover:bg-slate-900 group-hover:text-amber-400 group-hover:border-slate-900 transition-colors duration-300">
                          {getInitials(nombre)}
                        </div>

                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800 leading-tight">
                            {nombre}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                            <IdCard size={12} />
                            <span className="text-[11px] font-semibold uppercase tracking-wide">
                              {cliente.numeroDoc}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 🟢 Amber usado como color de advertencia para Desasociar (reemplaza al rojo) */}
                      <Button
                        variant="light"
                        size="sm"
                        radius="md"
                        className="font-bold text-xs opacity-80 hover:opacity-100 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        isLoading={loadingRemoveId === cliente.id}
                        onClick={() => handleDesasociar(cliente.id)}
                        startContent={
                          loadingRemoveId !== cliente.id && <Unlink size={14} />
                        }
                      >
                        Desasociar
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ClientesRevendedor;
