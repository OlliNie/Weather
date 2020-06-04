import { Port } from "./WeatherMachine/helpers/waveshare/waveshare";

const port = new Port("ttyS0");

port.write("AT");
