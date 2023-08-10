export const resolvers = {
  Query: {
    races: (_, __, { dataSources }) => {
      return dataSources.races.list();
    },
    horses: (_, __, { dataSources }) => {
      return dataSources.horses.list();
    },
  },
  Race: {
    horses: (parent, __, { loaders }) => {
      return loaders.raceHorsesLoader.load(parent.id);
    },
  },
  Horse: {
    race: (parent, _, { loaders }) => {
      return loaders.horseRaceLoader.load(parent.id);
    },
  },
};

