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
    waveShare.internetOn();

    // waveShare
    //   .write("AT")
    //   .then((res) => {
    //     if (res) {
    //       // resolve power on
    //     }
    //   })
    //   .catch((e) => {
    //     //  If no response, power on and check for response
    //     console.log("e", e);

    //     waveShare
    //       .togglePower()
    //       .then(() => waveShare.write("AT"))
    //       .then((res) => {
    //         // resolve power on
    //         console.log("power on");
    //       })
    //       .catch(() => {
    //         // toggling didnt turn power on
    //         console.log("toggle didnt help");
    //       });
    //   });

    // waveShare.togglePower();

    // const testResult = await waveShare.text(textParams);
    // console.log("rest result", testResult);
  })();
}
