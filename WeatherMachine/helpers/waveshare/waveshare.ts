import { Port } from "../serial-port/serialPort";

export class Waveshare {
  port: Port;

  constructor(port: string) {
    this.port = new Port(port);
  }

  text = ({ number, message }: Props) =>
    new Promise(async (res, rej) => {
      this.port
        .write("AT")
        .then(() => this.port.write("AT+CMGF=1"))
        .then(() => this.port.write(`AT+CMGW="${number}"`))
        .then(() => this.port.send(`${message}`))
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
}

export interface Props {
  number: string;
  message: string;
}
