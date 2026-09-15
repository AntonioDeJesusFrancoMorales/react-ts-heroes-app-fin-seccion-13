import { use } from "react";
import { beforeEach, describe, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { FavoriteHeroesContext, FavoriteHeroesProvider } from '@/heroes/context/FavoriteHeroesContext';
import type { Hero } from "../interfaces/heros.interface";

const mockHero = {
    id: 1,
    name: 'superman',
    alias: 'clark-kent'
} as unknown as Hero ;

const TestComponent = () => {
    const {favorites, favoritesCount, isFavorite, toggleFavorites} = use(FavoriteHeroesContext);

    return (
        <div>
            <div data-testid = 'favorites-count'>{favoritesCount}</div>
            <div data-testid = 'favorites'> {favorites.map(hero => (
                <div key={hero.id} data-testid = {`hero-${hero.id}`}>{hero.name}</div>
            ))} </div>
            <button data-testid= 'toggleFavorites' onClick={() => {toggleFavorites(mockHero)}}></button>
            <div data-testid = 'isFavorite' >{isFavorite(mockHero).toString()}</div>
        </div>
    )
};

const renderTestComponent = () => {
    return render(
        <FavoriteHeroesProvider>
            <TestComponent/>
        </FavoriteHeroesProvider>
    )
}

describe('FavoriteHeroesContext', () => {
    beforeEach(()=>{
        localStorage.clear();
    });

    test('should render with default values', () => {
        renderTestComponent();

        expect(screen.getByTestId('favorites-count').textContent).toBe('0');
        expect(screen.getByTestId('favorites').children.length).toBe(0);
    });

    test('should add a hero in favorites when toggleFavorite is called with a new hero', ()=>{
        renderTestComponent();
        const button = screen.getByTestId('toggleFavorites');
        
        fireEvent.click(button);

        expect(screen.getByTestId('isFavorite').textContent).toBe('true');
        expect(screen.getByTestId(`hero-${mockHero.id}`).textContent).toBe(mockHero.name);
        expect(screen.getByTestId('favorites-count').textContent).toBe('1');
        expect(localStorage.getItem('favoriteHeroes')).toBe(JSON.stringify([mockHero]));
    });

    test('should remove a hero in favorites when toggleFavorite is called', ()=>{
        localStorage.setItem('favoriteHeroes', JSON.stringify([mockHero]));
        renderTestComponent();
        const button = screen.getByTestId('toggleFavorites');

        expect(screen.getByTestId('isFavorite').textContent).toBe('true');
        expect(screen.getByTestId(`hero-${mockHero.id}`).textContent).toBe(mockHero.name);
        expect(screen.getByTestId('favorites-count').textContent).toBe('1');
        expect(localStorage.getItem('favoriteHeroes')).toBe(JSON.stringify([mockHero]));
        
        fireEvent.click(button);

        expect(screen.getByTestId('isFavorite').textContent).toBe('false');
        expect(screen.queryByTestId(`hero-${mockHero.id}`)).toBeNull();
        expect(screen.getByTestId('favorites-count').textContent).toBe('0');
        expect(localStorage.getItem('favoriteHeroes')).toBe('[]');
    });
});