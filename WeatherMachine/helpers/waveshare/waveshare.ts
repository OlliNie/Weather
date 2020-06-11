import { Port } from "../serial-port/serialPort";

import { promise as gpio } from "rpi-gpio";

export class Waveshare {
  port: Port;
  gpio = gpio;

  constructor(port: string) {
    // gpio.destroy();
    this.port = new Port(port);
  }

  text = ({ number, message }: Props) =>
    new Promise(async (res, rej) => {
      this.port
        .write("AT")
        .then((r) => {
          console.log(r);
          return this.port.write("AT+CMGF=1");
        })
        .then((r) => {
          console.log(r);
          return this.port.write(`AT+CMGW="${number}"`);
        })
        .then((r) => {
          console.log(r);
          return this.port.send(`${message}`);
        })
        .then((res) => {
          if (res.response.includes("+CMGW")) {
            const textIndex = +res.response.slice(6);
            return this.port.write(`AT+CMSS=${textIndex}`);
          } else {
            rej(
              new Error(`Expected response to have +CMGW, got: ${res.response}`)
            );
          }
        })
        .then((response) => res(response?.response))
        .catch(rej);
    });

  powerOn = () => {
    gpio
      .setup(7, gpio.DIR_OUT)
      .then(() => gpio.read(7))
      .then((res) => {
        console.log("initial state:", res);
        return gpio.write(7, false);
      })
      .then((res) => {
        return new Promise((res, rej) => {
          setTimeout(() => {
            console.log("res:", res);
            res(gpio.read(7));
          }, 5000);
        });
      })
      .catch(console.log);
  };
  powerOff = () => {
    gpio
      .setup(7, gpio.DIR_OUT)
      .then(() => gpio.read(7))
      .then((res) => {
        console.log("initial state:", res);
        return gpio.write(7, true);
      })
      .then((res) => {
        return new Promise((res, rej) => {
          setTimeout(() => {
            console.log("res:", res);
            res(gpio.read(7));
          }, 5000);
        });
      })
      .catch(console.log);
  };
}

export interface Props {
  number: string;
  message: string;
}
