import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { HeroStats } from "./HeroStats";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useSummaryInfo } from "../hooks/useSummaryInfo";
import type { SummaryInformationResponse } from "../interfaces/get-summary.response";
import { FavoriteHeroesProvider } from "../context/FavoriteHeroesContext";
import type { Hero } from "../interfaces/heros.interface";

const mockHero: Hero = {
        "id": "1",
        "name": "Clark Kent",
        "slug": "clark-kent",
        "alias": "Superman",
        "powers": [
            "Súper fuerza",
            "Vuelo",
            "Visión de calor",
            "Visión de rayos X",
            "Invulnerabilidad",
            "Súper velocidad"
        ],
        "description": "El Último Hijo de Krypton, protector de la Tierra y símbolo de esperanza para toda la humanidad.",
        "strength": 10,
        "intelligence": 8,
        "speed": 9,
        "durability": 10,
        "team": "Liga de la Justicia",
        "image": "1.jpeg",
        "firstAppearance": "1938",
        "status": "Active",
        "category": "Hero",
        "universe": "DC"
    };

const mockData = {
    "totalHeroes": 25,
    "strongestHero": {
        "id": "1",
        "name": "Clark Kent",
        "slug": "clark-kent",
        "alias": "Superman",
        "powers": [
            "Súper fuerza",
            "Vuelo",
            "Visión de calor",
            "Visión de rayos X",
            "Invulnerabilidad",
            "Súper velocidad"
        ],
        "description": "El Último Hijo de Krypton, protector de la Tierra y símbolo de esperanza para toda la humanidad.",
        "strength": 10,
        "intelligence": 8,
        "speed": 9,
        "durability": 10,
        "team": "Liga de la Justicia",
        "image": "1.jpeg",
        "firstAppearance": "1938",
        "status": "Active",
        "category": "Hero",
        "universe": "DC"
    },
    "smartestHero": {
        "id": "2",
        "name": "Bruce Wayne",
        "slug": "bruce-wayne",
        "alias": "Batman",
        "powers": [
            "Artes marciales",
            "Habilidades de detective",
            "Tecnología avanzada",
            "Sigilo",
            "Genio táctico"
        ],
        "description": "El Caballero Oscuro de Ciudad Gótica, que utiliza el miedo como arma contra el crimen y la corrupción.",
        "strength": 6,
        "intelligence": 10,
        "speed": 6,
        "durability": 7,
        "team": "Liga de la Justicia",
        "image": "2.jpeg",
        "firstAppearance": "1939",
        "status": "Active",
        "category": "Hero",
        "universe": "DC"
    },
    "heroCount": 18,
    "villainCount": 7
} as SummaryInformationResponse;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        }
    }
});

vi.mock('../hooks/useSummaryInfo');
const mockUseSummaryInfo = vi.mocked(useSummaryInfo);

const renderHeroStats = (data?: SummaryInformationResponse) => {
    if (data) {
        mockUseSummaryInfo.mockReturnValue({
            data: data,
        }as unknown as ReturnType<typeof useSummaryInfo>);
    } else {
        mockUseSummaryInfo.mockReturnValue({
            data: undefined,
        }as unknown as ReturnType<typeof useSummaryInfo>);
    }

    return render(
        <QueryClientProvider client={queryClient} >
            <FavoriteHeroesProvider>
                <HeroStats/>
            </FavoriteHeroesProvider>
        </QueryClientProvider>
    );
};

describe('HeroStats', ()=> {
    test('should render with initial state', () => {
        const {container} = renderHeroStats();

        expect(container).toMatchSnapshot();
        expect(screen.getByText('Loading...')).toBeDefined();
    });

    test('should render correctly with getSummaryAction data', () => {
        const {container} = renderHeroStats(mockData);

        expect(container).toMatchSnapshot();
        expect(screen.getByText('Total de personajes')).toBeDefined();
        expect(screen.getByText('Favoritos')).toBeDefined();
        expect(screen.getByText('Fuerte')).toBeDefined();
        expect(screen.getByText('Inteligente')).toBeDefined();

        expect(screen.getByText(mockData.smartestHero.alias)).toBeDefined();
    });

    test('should render HeroStats with calculated values', () => {
        localStorage.setItem('favoriteHeroes', JSON.stringify([mockHero]));
        const {container} = renderHeroStats(mockData);
        const divFavoritePercentage = screen.getByTestId('favoritePercentage');

        expect(container).toMatchSnapshot();
        expect(divFavoritePercentage.innerHTML).toBeDefined();
        expect(divFavoritePercentage.innerHTML).toContain('4.00% del total');
    });
});