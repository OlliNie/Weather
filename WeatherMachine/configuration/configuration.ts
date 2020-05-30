import { Configuration, Units } from "./types";
import { firebaseConfig } from "./firebaseConfig/firebaseConfig";

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
  sampleRateInMs: 1000 * 30,
  saveIntervalinMs: 1000 * 60 * 2,
  firebaseConfig: firebaseConfig,
};
