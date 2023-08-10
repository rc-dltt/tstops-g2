import { Collection } from "notarealdb/dist/Collection";
import { Entity } from "notarealdb/dist/Entity";

import { horses, races } from "./db";
import DataLoader from "dataloader";

const racesDataSet = {
  getAll: () => {
    return races.list();
  },
  findById: new DataLoader((ids: string[]) => {
    return Promise.all(ids.map((id) => races.get(id)));
  }),
};

const horsesDataSet = {
  getAll: () => {
    return horses.list();
  },
  findById: new DataLoader((ids: string[]) => {
    return Promise.all(ids.map((id) => horses.get(id)));
  }),
  getAllByRaceId: new DataLoader((raceIds: string[]) => {
    return Promise.all(
      raceIds.map((raceId) =>
        horses.list().filter((horse: any) => horse.race === raceId)
      )
    );
  }),
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
