"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var waveshare_1 = require("./WeatherMachine/helpers/waveshare/waveshare");
var port = new waveshare_1.Port("ttyS0");
port.write("AT");
