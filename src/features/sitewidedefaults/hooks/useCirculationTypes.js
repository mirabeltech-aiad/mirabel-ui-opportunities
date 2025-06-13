import { useQuery } from "@tanstack/react-query";
import { getCirculationTypes } from "../services/sitewideService";

export const useCirculationTypes = () => {
  return useQuery({
    queryKey: ["circulation-types"],
    queryFn: getCirculationTypes,
    staleTime: 1000 * 60 * 10,
  });
}; 