import { Port } from "./WeatherMachine/helpers/waveshare/waveshare";

const port = new Port("/dev/ttyS0");

port.write("AT");
