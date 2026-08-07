import { useLocation } from "react-router-dom";
import { useMemo } from "react";

export const useQuery = () => {
  const { search } = useLocation();

  return useMemo(() => {
    const params = new URLSearchParams(search);
    const queryObj = {};

    // Convertimos los parámetros en un objeto normal
    for (let [key, value] of params.entries()) {
      queryObj[key] = value;
    }

    return queryObj;
  }, [search]);
};
