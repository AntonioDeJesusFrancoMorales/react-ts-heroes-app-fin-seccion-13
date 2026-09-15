import { useQuery } from "@tanstack/react-query";
import { getHeroesByPagesAction } from "../actions/get-heroes-by-pages.action";

interface Params {
    page: number,
    limit: number,
    category: string,
}

export const usePaginatedHeroes = ({ page, limit, category }: Params) => {
  return useQuery({
      queryKey: ['heroes', {page, limit, category} ],
      queryFn: () => getHeroesByPagesAction(+page,+limit, category),
      staleTime: 1000 * 60 * 5 //5 minutos aprox
    });
}
