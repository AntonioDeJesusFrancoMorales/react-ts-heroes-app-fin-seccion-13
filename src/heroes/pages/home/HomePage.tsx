import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CustomJumbotron } from '@/components/custom/CustomJumbotron';
import { HeroStats } from '@/heroes/components/HeroStats';
import { HeroGrid } from '@/heroes/components/HeroGrid';
import { CustomPagination } from '@/components/custom/CustomPagination';
import { CustomBreadcrumbs } from '@/components/custom/CustomBreadcrumbs';

import { useSummaryInfo } from '@/heroes/hooks/useSummaryInfo';
import { usePaginatedHeroes } from '@/heroes/hooks/usePaginatedHeroes';
import { useHome } from '@/heroes/hooks/useHome';
import { use } from 'react';
import { FavoriteHeroesContext } from '@/heroes/context/FavoriteHeroesContext';

export const HomePage = () => {
  const {favorites, favoritesCount} = use(FavoriteHeroesContext);

  const {limit, page, category, setSearchParams, verifiedTab } = useHome();
  
  const { data: heroesResponse } = usePaginatedHeroes({page: +page, limit: +limit, category});

  const { data: summaryInfo } = useSummaryInfo();
  

  return (
    <>
      <>
        {/* Header */}
        <CustomJumbotron
          title="Universo de SuperHéroes"
          description="Descubre, explora y administra super héroes y villanos"
        />

        <CustomBreadcrumbs currentPage="Super Héroes" />

        {/* Stats Dashboard */}
        <HeroStats />

        {/* Tabs */}
        <Tabs value={verifiedTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger 
              value="all" 
              onClick={() => setSearchParams((prev) => {
                prev.set('tab','all');
                prev.set('category', 'all');
                prev.set('page', '1');
                return prev;
              })}>
              All Characters ({summaryInfo?.totalHeroes})
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="flex items-center gap-2"
              onClick={() => setSearchParams((prev) => {
                prev.set('tab','favorites');
                return prev;
              })}
            >
              Favorites ({favoritesCount})
            </TabsTrigger>
            <TabsTrigger 
              value="heroes" 
              onClick={() => setSearchParams((prev) => {
                prev.set('tab','heroes');
                prev.set('category', 'hero');
                prev.set('page', '1');
                return prev;
              })}
            >
              Heroes ({summaryInfo?.heroCount})
            </TabsTrigger>
            <TabsTrigger
              value="villains"
              onClick={() => setSearchParams((prev) => {
                prev.set('tab','villains');
                prev.set('category', 'villain');
                prev.set('page', '1');
                return prev;
              })}
            >
              Villains ({summaryInfo?.villainCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {/* Mostrar todos los personajes */}
            <HeroGrid heroes={heroesResponse?.heroes} />
          </TabsContent>
          <TabsContent value="favorites">
            {/* Mostrar todos los personajes favoritos */}
            <HeroGrid heroes={favorites} />
          </TabsContent>
          <TabsContent value="heroes">
            {/* Mostrar todos los héroes */}
            <HeroGrid heroes={heroesResponse?.heroes} />
          </TabsContent>
          <TabsContent value="villains">
            {/* Mostrar todos los Villanos */}
            <HeroGrid heroes={heroesResponse?.heroes} />
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {verifiedTab !== 'favorites' && (
          <CustomPagination totalPages={heroesResponse?.pages ?? 1} />
        )}
      </>
    </>
  );
};
