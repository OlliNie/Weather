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
  sampleIntervalinMs: number;
}

export enum Units {
  METRIC = "METRIC",
  STANDARD = "STANDARD",
}
