import { config as dotenv } from "dotenv";
import { Waveshare, Props } from "./WeatherMachine/helpers/waveshare/waveshare";

dotenv();

const phoneNumber = process.env.PHONE_NUMBER;

if (phoneNumber) {
  const waveShare = new Waveshare("/dev/ttyS0");

  const textParams: Props = {
    number: phoneNumber,
    message: "programmatically awesome!",
  };

  (async () => {
    const testResult = await waveShare.text(textParams);
    console.log("rest result", testResult);
  })();
}
