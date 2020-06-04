import SerialPort from "serialport";

export class Port {
  port: SerialPort;
  parser = new SerialPort.parsers.Readline({ delimiter: "\n" });

  constructor(port: string) {
    this.port = new SerialPort(port, { baudRate: 9600 });
    this.port.pipe(this.parser);
  }

  write = async (ATcommand: string) => {
    this.port.write(`${ATcommand}\n`);
    console.log(this.port.read());
    setTimeout(() => {
      console.log(this.port.read());
    }, 3000);
  };
}
