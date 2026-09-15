import { useQuery } from '@tanstack/react-query';

import { CustomJumbotron } from '@/components/custom/CustomJumbotron';
import { HeroStats } from '@/heroes/components/HeroStats';
import { SearchControls } from './ui/SearchControls';
import { CustomBreadcrumbs } from '@/components/custom/CustomBreadcrumbs';
import { HeroGrid } from '@/heroes/components/HeroGrid';
import { useSearchParams } from 'react-router';
import { SearchHeroes } from '@/heroes/actions/search-heroes.action';

export const SearchPage = () => {

  const [searchParams] = useSearchParams();
  
  const name = searchParams.get('name') ?? undefined;
  const strength = searchParams.get('minStr') ?? undefined;


  const {data: searchedHeroes} = useQuery({
    queryKey: ['searchedHeroes', {name, strength}],
    queryFn: () => SearchHeroes({name, strength}),
    staleTime: 1000 * 60 * 5,
  })

  return (
    <>
      <CustomJumbotron
        title="Búsqueda de SuperHéroes"
        description="Descubre, explora y administra super héroes y villanos"
      />

      <CustomBreadcrumbs
        currentPage="Buscador de héroes"
        // breadcrumbs={[
        //   { label: 'Home1', to: '/' },
        //   { label: 'Home2', to: '/' },
        //   { label: 'Home3', to: '/' },
        // ]}
      />

      {/* Stats Dashboard */}
      <HeroStats />

      {/* Filter and search */}
      <SearchControls />

      <HeroGrid heroes={searchedHeroes} />
    </>
  );
};

export default SearchPage;
