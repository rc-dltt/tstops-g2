import { horses, races } from "./db";
import { 
  raceHorsesLoader,
   horseRaceLoader 
  } from './loader.js';

export const buildContext = async (req) => {
  const dataSources = {
    races,
    horses,
};
  const loaders = {
    raceLoader: raceHorsesLoader,
    horsesLoader: horseRaceLoader
  };
  return {
    dataSources,
    loaders
  };
};
