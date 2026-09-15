import { afterEach, describe, expect, test, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { HomePage } from './HomePage';
import { usePaginatedHeroes } from "@/heroes/hooks/usePaginatedHeroes";
import { FavoriteHeroesProvider } from "@/heroes/context/FavoriteHeroesContext";

vi.mock('@/heroes/hooks/usePaginatedHeroes', () => ({
    usePaginatedHeroes: vi.fn(),
}));

// vi.mock('@/heroes/hooks/useSummaryInfo', () => ({
//     useSummaryInfo: vi.fn(),
// }));

const mockUsePaginatedHeroes = vi.mocked(usePaginatedHeroes);
mockUsePaginatedHeroes.mockReturnValue({
    data: [],
} as unknown as ReturnType<typeof usePaginatedHeroes>);

// const mockUseSummaryInfo = vi.mocked(useSummaryInfo);
// mockUseSummaryInfo.mockReturnValue({
//     data: [],
// } as unknown as ReturnType<typeof useSummaryInfo>);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        }
    }
});

const renderHomePage = (urlPath: string[] = ['/']) => {
    return render(
        <MemoryRouter initialEntries={urlPath}>
            <QueryClientProvider client={queryClient}>
                <FavoriteHeroesProvider>
                    <HomePage/>
                </FavoriteHeroesProvider>
            </QueryClientProvider>
        </MemoryRouter>
    );
};

describe('HomePage', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    test('should initialize with default values', () => {
        const {container} = renderHomePage();

        expect(container).toMatchSnapshot();
    });

    test('should call usePaginatedHeroes with default values', () => {
        renderHomePage();

        expect(mockUsePaginatedHeroes).toHaveBeenCalledWith({page:1, limit:6, category:'all'});
    });

    test('should call usePaginatedHeroes with custom values', () => {
        renderHomePage(['/?page=10&limit=9&category=heroes']);

        expect(mockUsePaginatedHeroes).toHaveBeenCalledWith({page:10, limit:9, category:'heroes'});
    });

    test('should called usePaginatedHeroes with default page and same limit on tab clicked', () => {
        renderHomePage(['/?page=10&limit=9&category=favorites']);
        const [, , , villainsTab] = screen.getAllByRole('tab');
        
        fireEvent.click(villainsTab);
        
        expect(mockUsePaginatedHeroes).toHaveBeenCalledWith({page:1, limit:9, category:'villain'})

    });
});