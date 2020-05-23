import { Configuration, Units } from "./types";

export const configuration: Configuration = {
  units: Units.METRIC,
  minVoltage: 0,
  maxVoltage: 10,
  minWindSpeed: {
    METRIC: 0,
    STANDARD: 0,
  },
  maxWindSpeed: {
    METRIC: 30,
    STANDARD: 50,
  },
  sampleRateInMs: 1000,
  sampleIntervalinMs: 1000 * 60 * 5,
};
