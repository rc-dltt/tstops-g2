import DataLoader from 'dataloader';
import { getRaceById, getHorseByRaceId } from './datastore';

const loaders = (): any => ({
    raceLoader: new DataLoader((ids) => {
      return Promise.all(ids.map((id) => getRaceById(id)));
    }),
    horseLoader: new DataLoader((raceIds) => {
      return Promise.all(raceIds.map((raceId) => getHorseByRaceId(raceId)));
    }),
  });

  const createLoaders = () => ({
    raceLoader: new DataLoader((ids) => {
      return Promise.all(ids.map((id) => fetchRaceById(id)));
    }),
    horsesLoader: new DataLoader((raceIds) => {
      return Promise.all(raceIds.map((raceId) => fetchHorsesByRaceIds(raceId)));
    }),
  });
  
  // Assuming you have a resolver function for the 'race' field
  const resolvers = {
    Query: {
      race: (_, { id }, context) => {
        return context.loaders.raceLoader.load(id);
      },
    },
    Race: {
      horses: (race, _, context) => {
        return context.loaders.horsesLoader.load(race.id);
      },
    },
    Horse: {
      race: (horse, _, context) => {
        return context.loaders.raceLoader.load(horse.raceId);
      },
    },
  };