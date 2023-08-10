import { horses, races } from "./db";

const racesDataSet = {
  getAll: () => {
    return races.list();
  },
  findById: (id) => {
    return races.get(id);
  },
  add: (race: any) => {
    const id = races.create(race);
    race.id = id;
    return race;
  }
};

const horsesDataSet = {
  getAll: () => {
    return horses.list();
  },
  findById: (id) => {
    return horses.get(id);
  },
  getAllByRaceId: (raceId) => {
    return horses.list()
      .filter((horse: any) => horse.race === raceId);
  },
  add: (horse: any) => {
    const id = horses.create(horse);
    horse.id = id;
    return horse;
  },
  enroll: (horseId: string, raceId: string) => {
    const horse: any = horses.get(horseId);
    horse.race = raceId;
    horses.update(horse);
    return horse;
  }
};

export const buildContext = async ({ req }) => {
  const dataSources = {
    races: racesDataSet,
    horses: horsesDataSet,
  };

  return {
    dataSources,
  };
};
