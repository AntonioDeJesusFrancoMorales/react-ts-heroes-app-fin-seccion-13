import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { appRouter } from './app.router';
import { createMemoryRouter, Outlet, RouterProvider, useParams } from "react-router";

vi.mock('@/heroes/pages/home/HomePage', () => ({
    HomePage: () => <div data-testid = "home-page">Home Page</div>,
}));

vi.mock('@/heroes/layouts/HeroesLayout', () => ({
    HeroesLayout: () => 
        <div data-testid = "heroes-layout">  
            <div>Heroes Layout</div>
            <Outlet/>
        </div>
}));

vi.mock('@/heroes/pages/hero/HeroPage', () => ({
    default: () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const {idSlug} = useParams();
        return <div data-testid = "hero-page">Hero Page - {idSlug}</div>
    },
}));

vi.mock('@/heroes/pages/search/SearchPage', () => ({
    default: () => <div data-testid="search-page">Search Page</div>
}));

describe('appRouter', () => {
    test('Should be configurated properly', () => {
        expect(appRouter.routes).toMatchSnapshot();
    });

    test('should render HomePage at root path', () => {
        const testRouter = createMemoryRouter(appRouter.routes, {
            initialEntries: ['/']
        });
        render(<RouterProvider router={testRouter}/>);
        const homePage = screen.getByTestId('home-page');

        expect(homePage).toBeDefined();
    });

    test('should render HeroPage at /heroes/idSlug path', () => {
        const testRouter = createMemoryRouter(appRouter.routes, {
            initialEntries: ['/heroes/superman'],
        });
        render(<RouterProvider router={testRouter}/>);

        expect(screen.getByTestId('hero-page')).toBeDefined();
        expect(screen.getByTestId('hero-page').innerHTML).toContain('superman');
    });

    test('should render SearchPage at /search path', async () => {
        const testRouter = createMemoryRouter(appRouter.routes, {
            initialEntries: ['/search'],
        });
        render(<RouterProvider router={testRouter}/>);

        expect((await screen.findByTestId('search-page')).innerHTML).toContain('Search Page');
    });

    test('should render HomePage at unknown path', () => {
        const testRouter = createMemoryRouter(appRouter.routes, {
            initialEntries: ['/literalmente-esto-esta-mal'],
        });
        render(<RouterProvider router={testRouter}/>);
        const homePage = screen.getByTestId('home-page');

        expect(homePage).toBeDefined();
    });
});