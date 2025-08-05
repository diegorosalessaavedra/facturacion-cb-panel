import { Spinner } from "@nextui-org/react";
import React from "react";

const Loading = () => {
  return (
    <div className="fixed w-screen h-[100vh] bg-black/[0.7] top-0 left-0 z-[100] flex flex-col gap-2 items-center justify-center ">
      <Spinner color="primary" size="lg" />
      <p className="text-white">Cargando ...</p>
    </div>
  );
};

export default Loading;
