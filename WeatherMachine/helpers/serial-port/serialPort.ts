import SerialPort from "serialport";

const pattern = /(?<=\r|\r\n|\r).*(?=\r|\r\n|\r)|(?<=\r\n)>/gi;

export class Port {
  port: SerialPort;

  constructor(port: string) {
    this.port = new SerialPort(port, { baudRate: 9600 });
  }

  write = (dataToWrite: string, timeout = 5000) =>
    new Promise<Response>((res, rej) => {
      let serialData: string[] = [];

      const handle = this.port.on("data", (data) => {
        serialData.push(data.toString());
        const answer = serialData.join("").match(pattern);
        if (answer) {
          handle.removeListener;
          const response: Response = {
            command: dataToWrite,
            response: answer[0],
          };

          res(response);
        }
      });

      setTimeout(() => {
        handle.removeListener;
        rej(new Error("Command Timed Out"));
      }, timeout);

      this.port.write(`${dataToWrite}\n`);
    });

  send = (dataToSend: string) =>
    new Promise<Response>((res, rej) => {
      let serialData: string[] = [];

      const handle = this.port.on("data", (data) => {
        serialData.push(data.toString());
        const answer = serialData.join("").match(pattern);
        if (answer) {
          handle.removeListener;
          const response = {
            command: dataToSend,
            response: answer[0],
          };
          res(response);
        }
      });

      setTimeout(() => {
        handle.removeListener;
        rej(new Error("Command Timed Out"));
      }, 5000);

      this.port.write(`${dataToSend}\x1A`);
    });
}

interface Response {
  command: string;
  response: string;
}
