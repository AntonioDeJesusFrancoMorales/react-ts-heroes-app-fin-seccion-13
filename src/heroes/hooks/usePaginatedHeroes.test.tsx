import type { PropsWithChildren } from "react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { usePaginatedHeroes } from './usePaginatedHeroes';
import { getHeroesByPagesAction } from "../actions/get-heroes-by-pages.action";

vi.mock('../actions/get-heroes-by-pages.action', () => ({
    getHeroesByPagesAction: vi.fn(),
}));

const mockGetHeroesByPagesAction = vi.mocked(getHeroesByPagesAction);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        }
    }
});
const tanStackCustomProvider = () => {

    return ({children}: PropsWithChildren) => (<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>)
}

describe('usePaginatedHeroes', () => {

    afterEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
    });

    test('should return the initial state (isLoading)', () => {
        const { result } = renderHook(() => usePaginatedHeroes({page: 1, limit: 6, category: 'all'}), {
            wrapper: tanStackCustomProvider(),
        });
        
        expect(result.current.isLoading).toBeTruthy();
        expect(result.current.isError).toBeFalsy();
        expect(result.current.data).toBeUndefined();
    });

    test('should return the correct data when the API call is completed', async () => {
        const mockHeroesByPageData = {
            total: 10,
            pages: 1,
            heroes: []
        } ; 
        mockGetHeroesByPagesAction.mockResolvedValue(mockHeroesByPageData);

        const { result } = renderHook(() => usePaginatedHeroes({page: 1, limit: 6, category: 'all'}), {
            wrapper: tanStackCustomProvider(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBeTruthy();
        });

        expect(result.current.isError).toBeFalsy();
        expect(result.current.status).toBe('success');
        expect(result.current.data).toStrictEqual(mockHeroesByPageData);
        expect(mockGetHeroesByPagesAction).toHaveBeenCalledOnce();
        expect(mockGetHeroesByPagesAction).toHaveBeenCalledWith(1, 6, 'all');
    });

    test('should call getHeroesByPagesAction with arguments', async () => {
        const mockHeroesByPageData = {
            total: 10,
            pages: 1,
            heroes: []
        } ; 
        mockGetHeroesByPagesAction.mockResolvedValue(mockHeroesByPageData);

        const { result } = renderHook(() => usePaginatedHeroes({page: 3, limit: 2, category: 'all123'}), {
            wrapper: tanStackCustomProvider(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBeTruthy();
        });

        expect(mockGetHeroesByPagesAction).toHaveBeenCalledOnce();
        expect(mockGetHeroesByPagesAction).toHaveBeenCalledWith(3, 2, 'all123');
    });
});