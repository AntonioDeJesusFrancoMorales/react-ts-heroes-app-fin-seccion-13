import { use } from 'react';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, Zap } from 'lucide-react';

import { HeroStatCard } from './HeroStatCard';
import { useSummaryInfo } from '../hooks/useSummaryInfo';
import { FavoriteHeroesContext } from '../context/FavoriteHeroesContext';

export const HeroStats = () => {
  const {favoritesCount} = use(FavoriteHeroesContext);

  const { data: summaryInfo} = useSummaryInfo();

  if (!summaryInfo) return (
    <div>Loading...</div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <HeroStatCard
        title="Total de personajes"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-2xl font-bold">{summaryInfo.totalHeroes}</div>
        <div className="flex gap-1 mt-2">
          <Badge variant="secondary" className="text-xs">
            {summaryInfo.heroCount} Heroes
          </Badge>
          <Badge variant="destructive" className="text-xs">
            {summaryInfo.villainCount} Villains
          </Badge>
        </div>
      </HeroStatCard>

      {/* TODO: terminas apenas se sepa como xd xd xd xddddddd */}
      <HeroStatCard
        title="Favoritos"
        icon={<Heart className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-2xl font-bold text-red-600">{favoritesCount}</div>
        <p className="text-xs text-muted-foreground" data-testid = 'favoritePercentage'>{((favoritesCount * 100) / (summaryInfo.totalHeroes ?? 1)).toFixed(2)}% del total</p>
      </HeroStatCard>

      <HeroStatCard
        title="Fuerte"
        icon={<Zap className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-lg font-bold">{summaryInfo.strongestHero.alias}</div>
        <p className="text-xs text-muted-foreground">Strength: {summaryInfo.strongestHero.strength}/10</p>
      </HeroStatCard>

      <HeroStatCard
        title="Inteligente"
        icon={<Heart className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-lg font-bold">{summaryInfo.smartestHero.alias}</div>
        <p className="text-xs text-muted-foreground">Intelligence: {summaryInfo.smartestHero.intelligence}/10</p>
      </HeroStatCard>
    </div>
  );
};
