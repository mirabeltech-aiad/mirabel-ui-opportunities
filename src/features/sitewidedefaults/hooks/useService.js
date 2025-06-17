


import { getSiteWideList } from "../services/sitewideService";
import { getCirculationTypes } from "../services/sitewideService";
import { useQuery } from "@tanstack/react-query";

export const useSiteWideList = () => {
  return useQuery({
    queryKey: ["site-wide-list"], // ✅ cache key
    queryFn: getSiteWideList,
    staleTime: 1000 * 60 * 5,  // ✅ cache lives for 5 minutes
  });
};

export const useCirculationTypes = () => {
  return useQuery({
    queryKey: ["circulation-types"],
    queryFn: getCirculationTypes,
    staleTime: 1000 * 60 * 10,
  });
};

