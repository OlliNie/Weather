import SerialPort from "serialport";

const pattern = /(?<=\r|\r\n|\r).*(?=\r|\r\n|\r)/gi;

export class Port {
  port: SerialPort;
  parser = new SerialPort.parsers.Readline({ delimiter: "\n" });

  constructor(port: string) {
    this.port = new SerialPort(port, { baudRate: 9600 });
    this.port.pipe(this.parser);
    // this.parser.on("readable", () => {
    //   console.log(this.port.read());
    // });
  }

  write = (dataToWrite: string) =>
    new Promise((res, rej) => {
      let serialData: string[] = [];
      console.log("data to write", dataToWrite);

      const handle = this.port.on("data", (data) => {
        serialData.push(data.toString());
        console.log("serialData:", serialData);
        const answer = serialData.join("").match(pattern);
        if (answer) {
          handle.removeListener;
          res(answer[0]);
        }
      });

      setTimeout(() => {
        handle.removeListener;
        // rej(new Error("Command Timed Out"));
        res(serialData);
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
      }, 10000);

      this.port.write(`${dataToSend}\x1A`);
    });
}
