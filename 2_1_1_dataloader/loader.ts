import DataLoader from 'dataloader';
import { horses, races } from './db';

interface Horse {
  id: string;
  race: string;
  // Add other properties of the Horse type
}

interface Race {
  id: string;
  // Add other properties of the Race type
}

interface DataSources {
  races: {
    get(id: string): Promise<Race | undefined>;
  };
  horses: {
    list(): Promise<Horse[]>;
  };
}

const dataSources: DataSources = {
  races: {
    get: async (id: string) => races.find((race) => race.id === id),
  },
  horses: {
    list: async () => horses
  },
};

export const raceHorsesLoader = new DataLoader<string, Horse[]>(async (raceIds) => {
  const allHorses = await dataSources.horses.list();
  return raceIds.map((raceId) => allHorses.filter((horse) => horse.race === raceId));
});

export const horseRaceLoader = new DataLoader<string, Race | undefined>(async (horseIds) => {
  const racesData = await Promise.all(horseIds.map((horseId) => dataSources.races.get(horseId)));
  return racesData;
});