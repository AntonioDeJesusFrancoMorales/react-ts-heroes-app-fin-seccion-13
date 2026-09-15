import { heroesApi } from "../api/heroesApi"
import type { Hero } from "../interfaces/heros.interface"

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getHeroAction = async (
    idSlug: string
): Promise<Hero> => {
    const { data } = await heroesApi.get<Hero>(`/${idSlug}`);

    return {
        ...data,
        image: `${BASE_URL}/images/${data.image}`,
    };
};