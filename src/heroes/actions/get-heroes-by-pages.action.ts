import { heroesApi } from "../api/heroesApi";
import type { HeroesResponse } from "../interfaces/get-heroes.response";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getHeroesByPagesAction = async(
    page: number,
    limit: number = 6,
    category: string = 'all',
): Promise<HeroesResponse> => {

    if (isNaN(page)) {
        page = 1;
    };

    if (isNaN(limit)) {
        limit = 6;
    };

    const { data } = await heroesApi.get<HeroesResponse>('/',{
        params: {
            offset: (page - 1) * limit,
            limit,
            category
        },
    });
    
    const heroes = data.heroes.map((hero) => ({
            ...hero,
            image: `${BASE_URL}/images/${hero.image}` 
        }));

    return {
        ...data,
        heroes: heroes,
    };
};