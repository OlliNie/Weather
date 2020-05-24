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
  sampleRateInMs: 5000,
  saveIntervalinMs: 1000 * 60 * 15,
  firebaseConfig: firebaseConfig,
};
