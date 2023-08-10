import DataLoader from 'dataloader';
import { horses, races } from "./db";

const dataSources = {
    races,
    horses,
};

export const raceHorsesLoader = new DataLoader(async (raceIds) => {
    return dataSources.horses
    .list()
    .filter((horse) => horse.race === raceIds);
});

export const horseRaceLoader = new DataLoader(async (horseIds) => {
    return dataSources.races.get(horseIds);
});


