import { heroesApi } from "../api/heroesApi";
import type { Hero } from "../interfaces/heros.interface";

interface Params {
    name?: string;
    team?: string;
    category?: string;
    universe?: string;
    status?: string;
    strength?: string;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const SearchHeroes = async ({name, team, category, universe, status, strength}: Params) => {
    
    if (!name && !team && !category && !universe && !status && !strength ) return [];
    
    const { data } = await heroesApi.get<Hero[]>('/search',{
        params: {
            name,
            team,
            category,
            universe,
            status,
            strength,
        }
    });

    const formatHeroes = data.map((hero) => 
        (
            {
                ...hero, 
                image: `${BASE_URL}/images/${hero.image}` 
            }
        ) );

    return formatHeroes;
};