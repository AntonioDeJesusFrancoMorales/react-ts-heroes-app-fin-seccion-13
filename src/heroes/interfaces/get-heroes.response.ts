import type { Hero } from "./heros.interface";

export interface HeroesResponse {
    total:  number;
    pages:  number;
    heroes: Hero[];
}


