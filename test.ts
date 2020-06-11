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
    waveShare.write("AT").then((res) => {
      console.log("power on check:", res);
      //  If get respose from chip, dont power on

      //  If no response, power on and check for response
    });

    // waveShare.togglePower();

    // const testResult = await waveShare.text(textParams);
    // console.log("rest result", testResult);
  })();
}
