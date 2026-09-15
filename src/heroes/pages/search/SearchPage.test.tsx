import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SearchPage } from './SearchPage';
import { SearchHeroes } from "@/heroes/actions/search-heroes.action";
import type { Hero } from "@/heroes/interfaces/heros.interface";

vi.mock("@/heroes/actions/search-heroes.action");
const mockSearchHerosAction = vi.mocked(SearchHeroes);

vi.mock('@/components/custom/CustomJumbotron', () => ({
    CustomJumbotron: () => <div data-testid = 'custom-jumbrotron'/>
}));

vi.mock('@/heroes/components/HeroGrid', () => ({
    HeroGrid: vi.fn(({heroes = []}: {heroes: Hero[]}) => 
    (<div data-testid= 'hero-grid'>
        {heroes.map((hero) => (<div key={hero.id}>{hero.name}</div>))}
    </div>))
}));

vi.mock('./ui/SearchControls', () => ({
    SearchControls: () => <div data-testid = 'search-controls'/>
}));

const queryClient = new QueryClient();

const renderSearchPage = (urlPath: string[] = ['/']) => {
    return render(
        <MemoryRouter initialEntries={urlPath}>
            <QueryClientProvider client={queryClient}>
                <SearchPage/>
            </QueryClientProvider>
        </MemoryRouter>
    );
};

describe('SearchPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should render the component properly', () => {
        const {container} = renderSearchPage();

        expect(container).toMatchSnapshot();
    });

    test('should render with default values', () => {
        renderSearchPage();

        expect(mockSearchHerosAction).toHaveBeenCalledWith({name: undefined, strength: undefined});
    });

    test('should call SearchHeroesAction with name parameter', () => {
        renderSearchPage(['/search?name=superman']);

        expect(mockSearchHerosAction).toHaveBeenCalledWith({name: 'superman', strength: undefined});
    });

    test('should call SearchHeroesAction with strength parameter', () => {
        renderSearchPage(['/search?minStr=10']);

        expect(mockSearchHerosAction).toHaveBeenCalledWith({name: undefined, strength: '10'});
    });

    test('should call SearchHeroesAction with strength and name parameters', () => {
        renderSearchPage(['/search?minStr=10&name=superman']);

        expect(mockSearchHerosAction).toHaveBeenCalledWith({name: 'superman', strength: '10'});
    });

    test('should render HeroGrid with the searched heroes', async () => {
        const mockHeroes = [
            {id: 1, name: 'Superman'},
            {id: 2, name: 'Bat-Man'}
        ] as unknown as Hero[]

        mockSearchHerosAction.mockResolvedValue(mockHeroes);
        renderSearchPage();
        vi.clearAllMocks();
        await waitFor(() => {
            expect(screen.getByText('Superman')).toBeDefined();
            expect(screen.getByText('Bat-Man')).toBeDefined();
        });
    });
});