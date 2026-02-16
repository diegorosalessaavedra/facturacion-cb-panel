// components/LoadingSpinner.jsx

import { Spinner } from "@nextui-org/react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black/60  flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <Spinner />
        <p className="text-white font-medium">Cargando...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
