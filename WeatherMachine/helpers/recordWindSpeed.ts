import { configuration } from "../configuration/configuration";
import { calculateWindSpeed } from "./calculateWindSpeed";
import { getSenesorVoltage } from "./getSensorVoltage";
import { Units } from "../configuration/types";

interface WindRecoding {
  windSpeed: number;
  unit: Units;
  date: string;
}

export const recordWindSpeed = () => {
  const sampleRate = configuration.sampleRateInMs;
  const unit = configuration.units;
  const recordInterval = configuration.sampleIntervalinMs;

  //  RecordedSamples is each sample
  let recordedSamples: any = [];
  //  Recorded wind includes min and max measurements for configured interval
  const recordedWind: any = [];
  let sampleIntervalHandle: number;
  let recordIntervalHandle: number;

  const getStrongestWindRecording = (
    acc: WindRecoding,
    current: WindRecoding
  ) => {
    if (acc === undefined || current.windSpeed > acc.windSpeed) {
      return current;
    } else {
      return acc;
    }
  };
  const getWeakestWindRecording = (
    acc: WindRecoding,
    current: WindRecoding
  ) => {
    if (acc === undefined || current.windSpeed < acc.windSpeed) {
      return current;
    } else {
      return acc;
    }
  };

  const windRecording = (voltage: number) => {
    const windRecording: WindRecoding = {
      windSpeed: calculateWindSpeed(voltage),
      unit,
      date: Date(),
    };
    return windRecording;
  };

  sampleIntervalHandle = setInterval(() => {
    recordedSamples.push(windRecording(getSenesorVoltage()));
  }, sampleRate);

  recordIntervalHandle = setInterval(() => {
    const strongestWind = recordedSamples.reduce(
      getStrongestWindRecording,
      undefined
    );
    const weakestWind = recordedSamples.reduce(
      getWeakestWindRecording,
      undefined
    );
    const strongestWeakestRecoding = {
      strongest: strongestWind,
      weakest: weakestWind,
    };
    recordedWind.push(strongestWeakestRecoding);
    recordedSamples = [];
    console.log("recorded Wind", recordedWind);
  }, recordInterval);

  const stopRecoding = () => {
    clearInterval(sampleIntervalHandle);
    clearInterval(recordIntervalHandle);
  };

  return {
    stopRecoding,
  };
};
