import SerialPort from "serialport";

const pattern = /(?<=\r|\r\n|\r).*(?=\r|\r\n|\r)|(?<=\r\n)>/gi;

export class Port {
  port: SerialPort;

  constructor(port: string) {
    this.port = new SerialPort(port, { baudRate: 9600 });
  }

  write = (dataToWrite: string) =>
    new Promise((res, rej) => {
      let serialData: string[] = [];

      const handle = this.port.on("data", (data) => {
        serialData.push(data.toString());
        const answer = serialData.join("").match(pattern);
        if (answer) {
          handle.removeListener;
          res(answer[0]);
        }
      });

      setTimeout(() => {
        handle.removeListener;
        rej(new Error("Command Timed Out"));
      }, 5000);

      this.port.write(`${dataToWrite}\n`);
    });

  send = (dataToSend: string) =>
    new Promise((res, rej) => {
      let serialData: string[] = [];

      const handle = this.port.on("data", (data) => {
        serialData.push(data.toString());
        const answer = serialData.join("").match(pattern);
        if (answer) {
          handle.removeListener;
          res(answer[0]);
        }
      });

      setTimeout(() => {
        handle.removeListener;
        rej(new Error("Command Timed Out"));
      }, 5000);

      this.port.write(`${dataToSend}\x1A`);
    });
}
