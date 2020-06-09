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
        .then(res)
        .catch(rej);
    });
}

export interface Props {
  number: string;
  message: string;
}
