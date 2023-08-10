export const resolvers = {
  Query: {
    races: (_, __, { dataSources }) => {
      return dataSources.races.getAll();
    },
    horses: (_, __, { dataSources }) => {
      return dataSources.horses.getAll();
    },
  },
  Mutation: {
    addRace: (_, { command }, { dataSources }) => {
      return dataSources.races.add(command);
    },
    addHorse: (_, { command }, { dataSources }) => {
      return dataSources.horses.add(command);
    },
    enrollHorse: (_, { command }, { dataSources }) => {
      return dataSources.horses.enroll(command.horse, command.race);
    },
  },
  Race: {
    horses: (parent, _, { dataSources }) => {
      return dataSources.horses.getAllByRaceId(parent.id);
    },
  },
  Horse: {
    race: (parent, _, { dataSources }) => {
      return dataSources.races.findById(parent.race);
    },
  },
};
