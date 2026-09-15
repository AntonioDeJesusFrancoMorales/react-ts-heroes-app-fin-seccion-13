import { describe, expect, test } from "vitest";
import { heroesApi } from "./heroesApi";

const BASE_URL = import.meta.env.VITE_BASE_URL;

describe('Testing backend base url',() => {
    test('Base url should be defined and has 3001 as port', () => {
        const api = heroesApi.defaults.baseURL;
        
        expect(api).toBeDefined();
        expect(api).toBe(`${BASE_URL}/api/heroes`);
        expect(api).toContain('3001');
    });
});