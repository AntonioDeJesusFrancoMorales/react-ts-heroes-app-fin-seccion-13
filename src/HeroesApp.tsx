import { RouterProvider } from 'react-router';
import { appRouter } from './router/app.router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FavoriteHeroesProvider } from './heroes/context/FavoriteHeroesContext';

const queryClient = new QueryClient();

export const HeroesApp = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <FavoriteHeroesProvider>
          <RouterProvider router={appRouter} />
          <ReactQueryDevtools initialIsOpen={false} />
        </FavoriteHeroesProvider>
      </QueryClientProvider>
    </>
  );
};
