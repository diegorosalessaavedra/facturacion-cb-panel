import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormComprobanteOrdenCompra from "./components/formComprobanteOrdenCompra/FormComprobanteOrdenCompra";
import axios from "axios";
import config from "../../../utils/getToken";
import { Modal, ModalBody, ModalContent } from "@nextui-org/react";
import BanerComprobanteOrdenCompra from "../comprobanteOrdenCompra/components/BanerComprobanteOrdenCompra";

const EditarComprobanteOrdenCompra = ({
  isOpen,
  onOpenChange,
  id,
  userData,
}) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [ordenCompra, setOrdenCompra] = useState();

  const handleOrdenCompra = () => {
    const url = `${
      import.meta.env.VITE_URL_API
    }/compras/comprobante/orden-compra/${id}`;

    axios
      .get(url, config)
      .then((res) => {
        setOrdenCompra(res.data.comprobanteOrdenCompra);
      })
      .catch((err) => navigate("/compras/ordenes-compra"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleOrdenCompra();
  }, [id]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="5xl"
    >
      <ModalContent>
        <ModalBody>
          <div className="w-full  bg-white flex flex-col gap-8 p-2 rounded-md ">
            <BanerComprobanteOrdenCompra />
            {ordenCompra && !loading && (
              <FormComprobanteOrdenCompra
                ordenCompra={ordenCompra}
                userData={userData}
                id={id}
              />
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditarComprobanteOrdenCompra;
