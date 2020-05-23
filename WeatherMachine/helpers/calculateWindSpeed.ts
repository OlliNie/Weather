import { configuration } from "../configuration/configuration";

export const calculateWindSpeed = (voltage: number): number => {
  //  Calculate slope
  const deltaVoltage = configuration.maxVoltage - configuration.minVoltage;
  const deltaWind =
    configuration.maxWindSpeed[configuration.units] -
    configuration.minWindSpeed[configuration.units];
  const slope = deltaWind / deltaVoltage;

  //  Calculate wind value
  return slope * voltage;
};
