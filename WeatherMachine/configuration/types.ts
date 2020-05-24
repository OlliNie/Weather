export interface Configuration {
  units: Units;
  minVoltage: number;
  maxVoltage: number;
  minWindSpeed: {
    METRIC: number;
    STANDARD: number;
  };
  maxWindSpeed: {
    METRIC: number;
    STANDARD: number;
  };
  sampleRateInMs: number;
  saveIntervalinMs: number;
  firebaseConfig: any;
}

export enum Units {
  METRIC = "METRIC",
  STANDARD = "STANDARD",
}
