import { createContext, useEffect, useState, type PropsWithChildren } from "react";
import type { Hero } from "../interfaces/heros.interface";

interface FavoriteHeroesContext {
    //states
    favorites: Hero[],
    favoritesCount: number,
    //methods
    isFavorite: (hero: Hero) => boolean,
    toggleFavorites: (hero: Hero) => void,
}

const getFavoritesFromLocalStorage = (): Hero[] => {
    const favorites = localStorage.getItem('favoriteHeroes');
    return favorites ? JSON.parse(favorites) : [];
}

// eslint-disable-next-line react-refresh/only-export-components
export const FavoriteHeroesContext = createContext({} as FavoriteHeroesContext);

export const FavoriteHeroesProvider = ( { children }: PropsWithChildren ) => {
    const [favorites, setFavorites] = useState<Hero[]>(getFavoritesFromLocalStorage());

    const toggleFavorites = (hero: Hero) => {
        const isHero = favorites.find((h) => h.id === hero.id); 
        if (isHero) {
            const newFavorites = favorites.filter((h) => h.id !== hero.id);
            setFavorites(newFavorites);
            return;
        }

        setFavorites([...favorites, hero]);
    };

    const isFavorite = (hero: Hero) => {
        return favorites.some((h) => h.id === hero.id);
    }

    useEffect(() => {
      localStorage.setItem('favoriteHeroes', JSON.stringify(favorites));
    }, [favorites])
    
    
    return (
        <FavoriteHeroesContext 
            value={{
                //states
                favorites: favorites,
                favoritesCount: favorites.length,
                //methods
                isFavorite: isFavorite,
                toggleFavorites: toggleFavorites
            }}>
            {children}
        </FavoriteHeroesContext>
    )
};
