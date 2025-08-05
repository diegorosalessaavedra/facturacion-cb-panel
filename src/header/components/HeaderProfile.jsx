import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { FaArrowLeft } from "react-icons/fa";
import { IoLogOutSharp } from "react-icons/io5";

const HeaderProfile = ({ userData }) => {
  const logOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div
      className="left-[280px] top-0 absolute h-[65px] bg-blue-700 p-4 flex justify-between items-center z-30 "
      style={{ width: "calc(100vw - 280px)" }}
    >
      <div className="flex items-center gap-2 text-white ">
        <button className="h-10 w-10 rounded-full hover:bg-blue-600 cursor-pointer flex items-center justify-center">
          <FaArrowLeft onClick={() => window.history.back()} />
        </button>

        <h1 className=" text-lg">Atras</h1>
      </div>

      <Dropdown placement="bottom-end">
        <DropdownTrigger className="flex gap-2">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <p className=" text-white text-sm ">
                {/* {userData?.nombre} asdasdasdas {userData?.apellidos} */}
                {userData?.nombre}
              </p>
              <p className=" text-slate-50 text-xs">
                {/* asdasdasda {userData?.dni} */}
                {userData?.correo}
              </p>
            </div>
            <Avatar
              isBordered
              as="button"
              className="transition-transform bg-white"
              name="Jason Hughes"
              color="default"
              size="sm"
              src="/logo.jpeg"
            />
          </div>
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem
            key="Chicken"
            color="primary"
            href="https://sistema-facturacion-chicken-baby.netlify.app"
            startContent={<img className="w-7" src="/logo.jpg" alt="" />}
          >
            <p className="text-xs">Facturación Chicken baby</p>
          </DropdownItem>
          <DropdownItem
            key="Multinacional"
            color="primary"
            href="https://facturacion-multinacional.netlify.app/#/log-in"
            startContent={<img className="w-7" src="/logoM.jpeg" alt="" />}
          >
            <p className="text-xs">Facturación Multinacional</p>
          </DropdownItem>
          <DropdownItem
            key="Diego"
            color="primary"
            href="https://facturacion-diego.netlify.app"
            startContent={<img className="w-7" src="/logoDiego.jpeg" alt="" />}
          >
            <p className="text-xs">Facturación Diego Rosales</p>
          </DropdownItem>
          <DropdownItem
            key="logout"
            color="danger"
            onPress={logOut}
            startContent={<IoLogOutSharp className="w-7 text-xl" />}
          >
            Cerrar Sesion
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default HeaderProfile;
