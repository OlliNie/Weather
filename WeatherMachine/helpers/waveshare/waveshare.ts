import { Port } from "../serial-port/serialPort";

import { promise as gpio } from "rpi-gpio";

export class Waveshare {
  port: Port;
  gpio = gpio;

  constructor(port: string) {
    // gpio.destroy();
    this.port = new Port(port);
  }

  write = (data: string) => this.port.write(data);

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
        .then((response) => res(response?.response));
    });

  togglePower = () => {
    return gpio
      .setup(7, gpio.DIR_OUT)
      .then(() => gpio.read(7))
      .then((res) => {
        console.log("initial state:", res);
        return gpio.write(7, false);
      })
      .then((res) => {
        return new Promise((res, rej) => {
          setTimeout(() => {
            res(gpio.write(7, true));
          }, 5000);
        });
      });
  };

  powerOn = () =>
    new Promise((res, rej) => {
      this.port
        .write("AT")
        .then(({ response }) => {
          if (response) {
            res(true);
          }
        })
        .catch(() => {
          //  If no response, power on and check for response
          console.log("turn on power");
          this.togglePower()
            .then(() => this.port.write("AT"))
            .then(({ response }) => {
              if (response) {
                res(true);
              }
            })
            .catch(rej);
        });
    });

  internetOn = () => {
    new Promise((res, rej) => {
      this.port
        .write("AT+CSQ")
        .then((signalQuality) => {
          console.log("signalQuality:", signalQuality);
        })
        .then(() => this.port.write("AT+CREG=1"))
        .then((networkReqistered) =>
          console.log("networkRegisterd:", networkReqistered)
        )
        .then(() => this.port.write("AT+CREG?"))
        .then((stateOfRegistration) =>
          console.log("stateOfRegistration:", stateOfRegistration)
        )
        .then(async () => {
          const availableNetworks = this.getAvailableNetworks();
          console.log("availableNetworks", availableNetworks);
        })
        .then(() => res(true));
    });
  };

  getAvailableNetworks = () =>
    new Promise((res, rej) => {
      const pattern = /[1-9]/;
      this.port
        .write("AT+COPS=?")
        .then((r) => r.response.match(pattern))
        .then((a) => res(a));
    });
}

export interface Props {
  number: string;
  message: string;
}
