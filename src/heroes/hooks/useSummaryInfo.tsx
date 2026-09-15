import { useQuery } from "@tanstack/react-query";
import { getSummaryAction } from "../actions/get-summary.action";

export const useSummaryInfo = () => {
    return useQuery({
      queryKey: ['summary-info'],
      queryFn: getSummaryAction,
      staleTime: 1000 * 60 * 5,
    });
};