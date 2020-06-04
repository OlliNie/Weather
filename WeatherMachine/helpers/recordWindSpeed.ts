import { configuration } from "../configuration/configuration";
import { calculateWindSpeed } from "./calculateWindSpeed";
import { getSenesorVoltage } from "./getSensorVoltage";
import { Units } from "../configuration/types";
import firebase from "firebase";
import SerialPort from "serialport";
const serialport = new SerialPort("/dev/ttyS0");

interface WindRecoding {
  windSpeed: number;
  unit: Units;
  time: string;
}

// initialise firebase
const app = firebase.initializeApp(configuration.firebaseConfig);
// firebase.analytics();
const db = app.firestore();

const getDay = () => {
  const date = new Date();
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}_${day}_${year}`;
};

export const recordWindSpeed = () => {
  console.log("recording wind speed");
  const sampleRate = configuration.sampleRateInMs;
  const unit = configuration.units;
  const saveInterval = configuration.saveIntervalinMs;

  //  RecordedSamples is each sample
  let recordedSamples: any = [];
  //  Recorded wind includes min and max measurements for configured interval
  const recordedWind: any = [];
  let sampleIntervalHandle: any;
  let updateCloudIntervalHandle: any;

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
    const time = new Date();
    const windRecording: WindRecoding = {
      windSpeed: calculateWindSpeed(voltage),
      unit,
      time: `${time.getHours()}:${time.getMinutes()}`,
    };
    return windRecording;
  };

  sampleIntervalHandle = setInterval(() => {
    recordedSamples.push(windRecording(getSenesorVoltage()));
  }, sampleRate);

  updateCloudIntervalHandle = setInterval(() => {
    const date = new Date();
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
      recordIntervalInMs: configuration.saveIntervalinMs,
      recordTime: `${date.getHours()}:${date.getMinutes()}`,
    };
    recordedWind.push(strongestWeakestRecoding);
    recordedSamples = [];

    const day = getDay();
    console.log("day", day);
    db.collection("windSpeeds")
      .doc("recordings")
      .set({
        [day]: recordedWind,
      });
  }, saveInterval);

  const stopRecoding = () => {
    clearInterval(sampleIntervalHandle);
    clearInterval(updateCloudIntervalHandle);
  };

  return {
    stopRecoding,
  };
};
