import { use } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { FavoriteHeroesContext, FavoriteHeroesProvider } from '@/heroes/context/FavoriteHeroesContext';
import type { Hero } from "../interfaces/heros.interface";

const mockHero = {
    id: 1,
    name: 'superman',
    alias: 'clark-kent'
} as unknown as Hero ;

const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
});

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

    beforeEach(() => {
        vi.clearAllMocks();
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
        expect(localStorage.setItem).toHaveBeenCalled();
        expect(localStorage.setItem).toHaveBeenCalledWith("favoriteHeroes", "[{\"id\":1,\"name\":\"superman\",\"alias\":\"clark-kent\"}]");
    });

    test('should remove a hero in favorites when toggleFavorite is called', ()=>{
        mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockHero]));
        renderTestComponent();
        const button = screen.getByTestId('toggleFavorites');

        expect(screen.getByTestId('isFavorite').textContent).toBe('true');
        expect(screen.getByTestId(`hero-${mockHero.id}`).textContent).toBe(mockHero.name);
        expect(screen.getByTestId('favorites-count').textContent).toBe('1');
        expect(localStorage.setItem).toHaveBeenCalled();
        expect(localStorage.setItem).toHaveBeenCalledWith("favoriteHeroes", "[{\"id\":1,\"name\":\"superman\",\"alias\":\"clark-kent\"}]");
        
        fireEvent.click(button);

        expect(screen.getByTestId('isFavorite').textContent).toBe('false');
        expect(screen.queryByTestId(`hero-${mockHero.id}`)).toBeNull();
        expect(screen.getByTestId('favorites-count').textContent).toBe('0');
        expect(localStorage.setItem).toHaveBeenCalled();
        expect(localStorage.setItem).toHaveBeenCalledWith("favoriteHeroes", "[]");
    });
});