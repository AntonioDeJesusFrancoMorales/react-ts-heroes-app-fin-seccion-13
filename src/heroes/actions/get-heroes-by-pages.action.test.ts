import { afterEach, describe, expect, test } from "vitest";
import AxiosMockAdapter from "axios-mock-adapter";
import { heroesApi } from "../api/heroesApi";
import { getHeroesByPagesAction } from "./get-heroes-by-pages.action";

const heroesApiMock = new AxiosMockAdapter(heroesApi);
const BASE_URL = import.meta.env.VITE_BASE_URL;

describe('getHeroesByPagesAction', () => {
    afterEach(() => {
        heroesApiMock.reset();
        heroesApiMock.resetHistory();
    });
    test('should return default heroes', async ()=> {
        const responseMock = {
            total: 10,
            pages: 1,
            heroes: [
                {
                    image: '1.jpg'
                },
                {
                    image: '2.jpg'
                }
            ]
        };

        heroesApiMock.onGet('/').reply(200, responseMock);
        const result = await getHeroesByPagesAction(1,10);

        expect(result).toStrictEqual({
            total: 10,
            pages: 1,
            heroes: [
                {
                    image: `${BASE_URL}/images/1.jpg`
                },
                {
                    image: `${BASE_URL}/images/2.jpg`
                }
            ]
        });
    });

    test('should return the correct heroes when the page is not a number', () => {
        const responseMock = {
            total: 10,
            pages: 1,
            heroes: []
        };

        heroesApiMock.onGet('/').reply(200, responseMock);
        
        getHeroesByPagesAction('uno' as unknown as number);

        const request = heroesApiMock.history.get[0].params;
        expect(request).toStrictEqual({ offset: 0, limit: 6, category: 'all' });
    });

    test('should return the correct heroes when the page is a string number', () => {
        const responseMock = {
            total: 10,
            pages: 1,
            heroes: []
        };

        heroesApiMock.onGet('/').reply(200, responseMock);
        
        getHeroesByPagesAction('5' as unknown as number);

        const request = heroesApiMock.history.get[0].params;
        expect(request).toStrictEqual({ offset: 24, limit: 6, category: 'all' });
    });

    test('should call the API with the correct params', () => {
        const responseMock = {
            total: 10,
            pages: 1,
            heroes: []
        };

        heroesApiMock.onGet('/').reply(200, responseMock);

        getHeroesByPagesAction(5,10,'heroes');

        const request = heroesApiMock.history.get[0].params;
        expect(request).toStrictEqual({ offset: 40, limit: 10, category: 'heroes' });
    });
});