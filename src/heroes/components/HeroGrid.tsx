import type { Hero } from '../interfaces/heros.interface';
import { HeroGridCard } from './HeroGridCard';

interface Props {
  heroes?: Hero[]
};

export const HeroGrid = ( { heroes = [] }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
      
      {heroes.length > 0 ? heroes?.map((hero) => (
        <HeroGridCard key={hero.id} hero = {hero}/>
      )) : <h1 className='text-4xl'> Vacio </h1>}
    </div>
  );
};
