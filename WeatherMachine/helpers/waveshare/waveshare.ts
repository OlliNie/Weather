import { Port } from "../serial-port/serialPort";

import { promise as gpio } from "rpi-gpio";
import { withRouter } from "react-router";

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
          const availableNetworks = await this.getAvailableNetworks();

          //  manually select available operator
          const selectedOperator = await this.port.write(
            `AT+COPS=${availableNetworks[0]}`
          );
          console.log("selectedOperator:", selectedOperator);
          // check current network
          const currentNetworkStatus = await this.port.write("AT+COPS?");
          console.log("currentNetworkStatus:", currentNetworkStatus);
          // AT+CGATT=1    [ to attach the terminal to GPRS service ]
          await this.port.write("AT+CGATT=1", 15000);
          // AT+CGATT?    [ To return the current state of GPRS service : Attach/Detach ]
          const currenStateGprsService = await this.port.write("AT+CGATT?");
          console.log("currenStateGprsService", currenStateGprsService);
          // AT+CGDCONT=1,"IP","em"    [ To define PDP Context ]
          // saunalahti should be internet for prepaid.  Some say internet.internet
          const test = await this.port.write(
            `AT+CGDCONT=${availableNetworks[0]},"IP","internet"`,
            15000
          );

          console.log("test", test);

          const connected = await this.port.write("AT+CGACT=1", 30000);

          console.log("connected", connected);
          const check = await this.port.write("AT+CGDSCONT=?", 15000);
          console.log("connection status", check);
          const idk = await this.port.write("*99***1#", 30000);
          console.log("idk", idk);
        })
        .then(() => res(true));
    });
  };

  getAvailableNetworks = () =>
    new Promise<Number[]>((res, rej) => {
      const pattern = /[1-9]/g;
      this.port

        .write("AT+COPS=?")
        .then((r) => {
          console.log("response", r);
          const networks = (r.response.match(pattern) as unknown) as number[];
          console.log("Pattern match", networks);
          return networks;
        })
        .then((a) => res(a));
    });
}

export interface Props {
  number: string;
  message: string;
}
