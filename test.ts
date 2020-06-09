import { Waveshare, Props } from "./WeatherMachine/helpers/waveshare/waveshare";

const waveShare = new Waveshare("/dev/ttyS0");

const textParams: Props = {
  number: "0444036147",
  message: "programmatically awesome!",
};

waveShare.text(textParams);
