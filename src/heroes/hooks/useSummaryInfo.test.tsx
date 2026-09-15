import type { PropsWithChildren } from "react";
import { describe, expect, test, vi} from "vitest";
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useSummaryInfo } from '@/heroes/hooks/useSummaryInfo';
import { getSummaryAction } from "../actions/get-summary.action";
import type { SummaryInformationResponse } from "../interfaces/get-summary.response";

vi.mock('../actions/get-summary.action', () => ({
    getSummaryAction: vi.fn(),
}));

const mockGetSummaryAction = vi.mocked(getSummaryAction);


const tanStackCustomProvider = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            }
        }
    });

    return ({children}: PropsWithChildren) => (<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>)
}

describe('useSummaryInfo', () => {
    test('should return the initial state (isLoading)', () => {
        const { result } = renderHook(() => useSummaryInfo(), {
            wrapper: tanStackCustomProvider(),
        });
        
        expect(result.current.isLoading).toBeTruthy();
        expect(result.current.isError).toBeFalsy();
        expect(result.current.data).toBeUndefined();
    });

    test('should return the correct data when the API call is completed', async () => {
        const mockSummaryResponse = {
            totalHeroes: 10,
            strongestHero: {
                id: 1,
                name: 'Superman'
            },
            smartestHero: {
                id: 2,
                name: 'Batman',
            },
            heroCount: 18,
            villainCount: 7,
        } as unknown as SummaryInformationResponse;

        mockGetSummaryAction.mockResolvedValue(mockSummaryResponse);

        const { result } = renderHook(() => useSummaryInfo(), {
            wrapper: tanStackCustomProvider(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBeTruthy();
        });

        expect(result.current.isError).toBeFalsy();
        expect(result.current.data).toStrictEqual(mockSummaryResponse);
        expect(mockGetSummaryAction).toHaveBeenCalledOnce();
    });

    test('should return an error state when API call fails', async () => {
        const mockError = new Error('Failed to fetch summary');

        mockGetSummaryAction.mockRejectedValue(mockError);

        const { result } = renderHook(() => useSummaryInfo(), {
            wrapper: tanStackCustomProvider(),
        });

        await waitFor(() => {
            expect(result.current.isError).toBeTruthy();
        });
        expect(result.current.error).toBeDefined();
        expect(result.current.isLoading).toBeFalsy();
        expect(mockGetSummaryAction).toHaveBeenCalled();
        expect(result.current.error?.message).toStrictEqual(mockError.message);
    });
});